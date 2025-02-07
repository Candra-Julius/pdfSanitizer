const util = require('util')
const {exec} = require('child_process')

class FileUploadUsecase {
    constructor(fs,pdfExtract,pdfPattern,scannerPattern,dcPattern,spawn,path){
        this.fs = fs
        this.pdfExtract = pdfExtract
        this.pdfPattern = pdfPattern
        this.scannerPattern = scannerPattern
        this.dcPattern = dcPattern
        this.spawn = spawn
        this.execPromise = util.promisify(exec)
        this.path = path
    }

    #isPdfFile(buffer) {
        // PDF signature/magic number: %PDF-
        const signature = new Uint8Array(buffer.slice(0, 4));
        const pdfSignature = [0x25, 0x50, 0x44, 0x46];
        return pdfSignature.every((byte, index) => byte === signature[index])
    }
    async testXss(file){
        try {
            const pdfData = await this.fs.readFile(file.tempFilePath);
            const type = this.#isPdfFile(pdfData)
            if(!type) throw new Error('Bukan file Pdf atau Pdf dikompresi dengan format yang tidak diizinkan');
            const data = await this.pdfExtract.extractBuffer(Buffer.from(pdfData))
            const metadata = data.meta
            
            const metaCreator = metadata.info.Creator || ''
            const metaProducer = metadata.info.Producer || ''
            const metadataExsist = {
                checkDc: false,
                checkXmp: false,
                metaDc: '',
                metaXmp: ''
            }
            if(metadata.metadata){
                const xmpMetadata = metadata.metadata['xmp:creatortool']? metadata.metadata['xmp:creatortool'] : ''
                const checkDc = metadata.metadata['dc:creator']? metadata.metadata['dc:creator'] : ['']
                const dcMetadata = Array.isArray(checkDc)?  checkDc : [checkDc]
                const resultDc = dcMetadata.some(t =>{
                    const [result, metaDcDetected] = this.dcPattern.search(t)
                    metadataExsist.metaDc = metaDcDetected
                    return result
                })
                const [resultXmp, metaXmpDetected] = this.scannerPattern.search(xmpMetadata);
                metadataExsist.checkXmp = resultXmp
                metadataExsist.checkDc = resultDc 
                metadataExsist.metaXmp = metaXmpDetected
            }

            const [scanCreatorResult] = this.scannerPattern.search(metaCreator)
            const [scanProducerResult] = this.scannerPattern.search(metaProducer)
            const scanResult = scanCreatorResult || scanProducerResult

            const result = (scanResult || metadataExsist.checkDc || metadataExsist.checkXmp)
           
            if(result) return {
                message: `pdf diloloskan karena menggunakan metadata yang aman`,
                data: {
                    creator: metaCreator,
                    producer: metaProducer,
                    dcMetadata: metadataExsist.metaDc,
                    xmpMetadata: metadataExsist.metaXmp   
                }
            }
            const strings = pdfData.toString();
            const [scanPdf, maliciousTagDetected] = this.pdfPattern.search(strings);

            if (scanPdf) {
                await this.fs.rm(file.tempFilePath, {force:true})
                throw new Error(`PDF terdeteksi mengandung script berbahaya: ${maliciousTagDetected}`);
            };
            return {
                message:'PDF diloloskan karena tidak mengandung script berbahaya', 
                data: {
                    creator: metaCreator,
                    producer: metaProducer,
                    dcMetadata: metadataExsist.metaDc,
                    xmpMetadata: metadataExsist.metaXmp   
                }
            }
        } catch (error) {
            if(error.message == 'No password given'){
                throw new Error('ini file pdf yang memerlukan password')
            }
            console.log(error)
            throw new Error(error.message);
        }
    };
    async sanitizedPdf(file, temp = 'tmp'){
        try {
            const isExist = await this.fs.access(temp).then(() => true).catch(() => false);
            if (!isExist) {
                await this.fs.mkdir(temp, { recursive: true });
            }
            const timestamp = Date.now();
            const outputPath = this.path.join(temp, `sanitized_${timestamp}.pdf`);
            const gsCommand = `gs -q -sDEVICE=pdfwrite -dSAFER -dBATCH -dNOPAUSE -dCompatibilityLevel=1.4 -sOutputFile=${outputPath} ${file.tempFilePath}`;
            
            await this.execPromise(gsCommand);
            const files = await this.fs.readFile(outputPath);
            const buffer = Buffer.from(files, 'binary')
            await this.fs.rm(outputPath, {force:true})
            await this.fs.rmdir(temp, {force:true})
            return buffer;
          } catch (error) {
            if(error.message == 'No password given'){
                throw new Error('ini file pdf yang memerlukan password')
            }
            throw error;
          }
    }
}

module.exports = FileUploadUsecase
