import express, { Request, Response } from 'express';  
import multer from 'multer';  
import cors from 'cors';  

const app = express();  
const upload = multer({ dest: 'uploads/' });  

app.use(cors());  

app.post('/upload', upload.single('file'), (req: Request, res: Response) => {  
  if (!req.file || req.file.mimetype !== 'application/pdf') {  
    res.status(400).send({ message: 'Only PDF files are allowed.' });  
    return;  
  }  

  res.status(200).send({  
    message: 'File uploaded successfully.',  
    fileName: req.file.originalname,  
    uploadDate: new Date().toLocaleString(),  
  });  
});  

app.get('/extractions/:documentId', (req: Request<{ documentId: string }>, res: Response) => {  
  const mockExtractions = [  
    { key: 'Extraction 1', page: Math.floor(Math.random() * 10) + 1 },  
    { key: 'Extraction 2', page: Math.floor(Math.random() * 10) + 1 },  
    { key: 'Extraction 3', page: Math.floor(Math.random() * 10) + 1 },  
  ];  
  res.status(200).send(mockExtractions);  
});  

app.listen(5000, () => {  
  console.log('Server running on port 5000');  
});  