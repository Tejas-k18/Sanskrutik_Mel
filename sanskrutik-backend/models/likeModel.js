import mongoose from 'mongoose'

const likeSchema = mongoose.Schema({
    user : String,
    avatar : String,
    createdAt : Number,
});

const likeModel = mongoose.model('likes', likeSchema);
export {likeModel, likeSchema};
