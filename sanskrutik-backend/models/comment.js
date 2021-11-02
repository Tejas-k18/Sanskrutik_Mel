import mongoose from 'mongoose'

const commentSchema = mongoose.Schema({
    user : String,
    avatar : String,
    text: String,
    createdAt : Number,
});

const commentModel = mongoose.model('comments', commentSchema);
export {commentModel, commentSchema};
