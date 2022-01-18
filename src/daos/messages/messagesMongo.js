import Schema from "mongoose";
import MongoContainer from "../../Contenedor/MongoContainer.js";

export default class MessagesMongo extends MongoContainer{
    constructor(){
        super(
            'messages',
            {
            text:{
                type:String,
                required:true
            },
            author: {
                nombre:{
                    type:String,
                    required:true,
                },
                apellido:{
                    type:String,
                    required:true,
                },
                edad:{
                    type:Number,
                    required:true,
                },
                alias:{
                    type:String,
                    required:true,
                },
                avatar:{
                    type:String,
                    required:true,
                },
                email:{
                    type:String,
                    required:true,
                
                }
            }
            },{timestamps:true}
        )
    }
}