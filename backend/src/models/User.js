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
    },
    resetPasswordToken: String,
    resetPasswordExpires:Date,
    bio: String,
    profileImage: {
        type: String,
        default: "https://res.cloudinary.com/dvaoigpfv/image/upload/v1774317968/profile-default_opxczd.png"
    },
    coverImage: { 
        type: String,
        default: "https://res.cloudinary.com/dvaoigpfv/image/upload/v1774318345/Nexura_1_lqqubt.png"
    },
friends: {
  type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  default: []
},

friendRequestsSent: {
  type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  default: []
},

friendRequestsReceived: {
  type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  default: []
}
}, {timestamps:true})

export default mongoose.model("User", userSchema)