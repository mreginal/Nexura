import mongoose from "mongoose"

const postSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    content:String,
    image: String,
    createAt:{
        type:Date,
        default: Date.now
    }
})

export default mongoose.model("Post", postSchema)