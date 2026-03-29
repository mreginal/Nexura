import mongoose, { mongo } from "mongoose"

const postSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
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
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],
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
    }
},{timestamps: true})

export default mongoose.model("Post", postSchema)