import express from 'express';
import cors from 'cors';
import upload from './services/upload.js';
import { getFiveFakeProducts, normalizeUtils, __dirname } from './utils.js';
import { Server } from 'socket.io';
// import productos from './routes/products.js';
import {messages } from './daos/indexDao.js';
import { normalize, schema } from 'normalizr';

const app = express();
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () =>{
    console.log(`Servidor escuchando en mi proyecto, products: ${PORT}`);
})
server.on('error', (error)=>console.log(`Error en el servidor ${error}`))

// const messagesService = new MessagesClass();
// const productService = new ProductsClass();

export const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors());
app.use(express.static(__dirname+'/public'));
app.use((req,res,next)=>{
    let timestamp = Date.now();
    let time = new Date(timestamp);
    console.log(`Peticion hecha a las ${time.toTimeString().split(" ")[0]}`);
    next();
})

// Routes
// app.use('/api/productos', productos);


// POST 
app.post('/api/uploadfile',upload.array('images'),(req,res)=>{
    const files = req.files;
    if(!files || files.length===0){
        res.status(500).send({message:"No se subio el archivo"})
    }
    res.send(files);
})

app.post('/api/messages/',async (req,res)=>{
    let data = req.body;
    let result = await messages.save(data);
    console.log(result);
    res.send({message:`Mensaje creado con exito!`, payload:result})
})


io.on('connection', socket=>{
    messages.getAllP().then(result=>{
        const objectNorm = {
            id:"mensajes",
            mensajes:result
        }
        const normalizeObj = normalizeUtils(objectNorm);
        console.log(normalizeObj);
        console.log(JSON.stringify(normalizeObj,null,2));
        // io.emit('messagesHistory',result)
        io.emit('messagesHistory',normalizeObj)
    })
    

    socket.on('realTimeCards', data=>{
        messages.getAllP().then(result=>{
            const objectNorm = {
                id:"mensajes",
                mensajes:result
            }
            const normalizeObj = normalizeUtils(objectNorm);
            console.log(normalizeObj);
            console.log(JSON.stringify(normalizeObj,null,2));
            // io.emit('messagesHistory',result)
            io.emit('messagesHistory',normalizeObj)
        })
    })

});

// new NORMALIZR Y MOCKS


app.get('/api/productos-test', (req,res)=>{
    let products = getFiveFakeProducts();
    res.send({products});
})

app.get('/api/mensajes/', (req,res)=>{
    messages.getAllP().then(result=>{
        res.send(result);
    })
})
