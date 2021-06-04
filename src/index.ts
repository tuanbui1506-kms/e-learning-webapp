import express from 'express';
import route from './middlewares/routes.mdw';
import viewMdw from './middlewares/view.mdw';
import  sessionMdw from './middlewares/session.mdw';
import localMdw from './middlewares/local.mdw';
import morgan from 'morgan'

const app = express();
const PORT = (process.env.PORT || 3000) as number;

app.use('/design', express.static('design'));
app.use('/video', express.static('video'));
app.use('/imgs', express.static('imgs')); //lấy hình ảnh

viewMdw(app);
sessionMdw(app);
localMdw(app);

app.use(express.urlencoded());
app.use(morgan('tiny'));
app.use(route)


app.use((req:express.Request,res:express.Response) =>{
    res.send("Hello there!!")
})

app.listen(PORT,()=>{
    console.log(`Server is listening on Port:${PORT}`)
})