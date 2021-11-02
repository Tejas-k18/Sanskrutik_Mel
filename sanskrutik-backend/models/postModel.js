import mongoose from 'mongoose'
import {likeSchema} from './likeModel.js'
import {commentSchema} from './comment.js'

const postModel = mongoose.Schema({
    user : String,
    imgName : String,
    text : String,
    avatar : String,
    timeStamp : Number,
    likes: [likeSchema],
    comments: [commentSchema],
    user_id : String
});

export default mongoose.model('posts', postModel)