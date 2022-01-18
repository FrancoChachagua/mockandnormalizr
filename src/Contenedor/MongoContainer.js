import mongoose  from "mongoose";

mongoose.connect("mongodb+srv://franco:123@ecommercemessages.aehi9.mongodb.net/ecommercemessages?retryWrites=true&w=majority",
    {
    useNewUrlParser:true,
    useUnifiedTopology:true
    }
)

export default class MongoContainer{
    constructor(collection,schema,timestamps){
        this.collection = mongoose.model(collection, new mongoose.Schema(schema,timestamps))
    }
    async getAllP(){
        try{
            let documents = await this.collection.find()
            return documents
        }catch(error){
            return {message:"error",error:`Ha sucedido un error y no es tu culpa! Error name:${error}`}
        }
    }
    async save(obj){
        try{
            let createObj = await this.collection.create(obj)
            return {message:"Ha sido creado con exito!",payload:createObj}
        }catch(error){
            return {message:"error",error:`Ha sucedido un error y no es tu culpa! Error name:${error}`}
        }
    }
}