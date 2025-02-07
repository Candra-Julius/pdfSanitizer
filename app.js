require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000
const helmet = require('helmet')
const fs = require('fs/promises');
const PDFExtract = require('pdf.js-extract').PDFExtract;
const AhoCorasick = require('./src/interface/middlewere/AhoCorasick')
const {exec} = require('child_process')
const util = require('util')
const execPromise = util.promisify(exec)
const path = require('path')

const fileUpload = require('express-fileupload');
app.set('trust proxy', 'loopback')
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: './temp/'
}));

//utilities
const Utilities = require('./src/utilities/utilities')
    
//interface/router
const Router = require('./src/interface/routes/index');

const FileUploadUsecase = require('./src/usecase/fileUploadUseCase');
const FileUploadController = require('./src/interface/controller/fileUploadController');
const pdfPatterns = process.env.PDFPATTERN.split(',')

const scannerPatterns = process.env.SCANNERPATTERN.split(',')

const dcPattern = process.env.DCPATTERN.split(',')



const pdfFSM = new AhoCorasick(pdfPatterns)
const scannerFSM = new AhoCorasick(scannerPatterns)
const dcFSM = new AhoCorasick(dcPattern)
/////////////////////////////////////////////////////////////////////////////////
app.use(helmet())
app.use(express.json())
/////////////////////////////////////////////////////////////////////////////////
const utilities = new Utilities()
const pdfExtract = new PDFExtract();
const fileUploadUsecase = new FileUploadUsecase(fs,pdfExtract,pdfFSM,scannerFSM,dcFSM, execPromise, path)
const fileUploadController = new FileUploadController(fileUploadUsecase,fs,utilities)
const route = new Router(express.Router(), fileUploadController);

app.use('/', route.getRouter())
app.use((req, res, next) => {
    res.status(404).send({ error: 'Not Found' })
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`)
})