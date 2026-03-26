import mongoose from "mongoose"

const postSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    content:{
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        default: ""
    },
    likes:{
        type: Number,
        default: 0
    },
    commentsCount:{
        type: Number,
        default: 0
    },
    shares:{
        type: Number,
        default: 0
    },
    saves:{
        type: Number,
        default: 0
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
},{timestamps: true})

export default mongoose.model("Post", postSchema)