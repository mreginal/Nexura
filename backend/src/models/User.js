import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: String,
    email:{
        type: String,
        unique: true,
        required: true
    },
    cpf:{
        type: String,
        unique:true
    },
    username:{
        type: String,
        unique:true
    },
    cep: String,
    street: String,
    number: String,
    neighborhood: String,
    city: String,
    state: String,
    password:{
        type: String,
        required:true    
    }
}, {timestamps:true})

export default mongoose.model("User", userSchema)