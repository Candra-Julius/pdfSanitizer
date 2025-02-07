class FileUploadController {
    constructor(fileUploadUsecase, fs, util){
        this.fileUploadUsecase = fileUploadUsecase
        this.fs = fs
        this.util = util
    }
    
    testXss = async (req,res)=>{
        const file = req.files.files
        try {
            console.time('testXss')
            const {message, data} = await this.fileUploadUsecase.testXss(file)
            const response = this.util.buildResponse(message, data)

            res.status(200).json(response)
        } catch (error) {
            console.log(error)
            res.status(500).json(this.util.errorMessage(error.message))
        }
        finally{
            console.timeEnd('testXss')
            await this.fs.rm(file.tempFilePath, {force:true})
        }
    }
    terminateScript = async (req,res)=>{
        const file = req.files.files
        try {
            const result = await this.fileUploadUsecase.sanitizedPdf(file)
            const pdfBuffer = Buffer.from(result);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="sanitized-${file.name}.pdf"`);
            res.setHeader('Content-Length', pdfBuffer.length);
            res.status(200).send(pdfBuffer);
        } catch (error) {
            console.log(error)
            res.status(500).json({error: error.message})
        }
        finally{
            await this.fs.rm(file.tempFilePath, {force:true})
        }
    }
}

module.exports = FileUploadController