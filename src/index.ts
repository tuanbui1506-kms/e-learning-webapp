import express from 'express'
import {routeFunc as routeMdwFunc} from './middlewares/route.mdw';
import {viewMdwFunc} from './middlewares/view.mdw';
import morgan from 'morgan'

const app:express.Express = express();
const PORT:number = (process.env.PORT || 3000) as number;

routeMdwFunc(app);
viewMdwFunc(app);
app.use(morgan('tiny'));
app.use((req:express.Request,res:express.Response) =>{
    res.send("Hello there!!")
})

app.listen(PORT,()=>{
    console.log(`Server is listening on Port:${PORT}`)
})