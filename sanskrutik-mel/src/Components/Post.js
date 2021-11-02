import { Avatar } from '@material-ui/core'
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import NearMeIcon from '@material-ui/icons/NearMe';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExpandMoreOutlinedIcon from '@material-ui/icons/ExpandMoreOutlined';
import { useStateValue } from '../StateProvider'
import Comment from './Comment';
import React , { useState } from 'react';
import axios from '../axios'
import { Button } from '@material-ui/core'
import './Post.css'

const Post = ({postId,profilePic,imgName,username,timeStamp,message, likes=[], comments=[]}) => {
    const [{user},dispatch] = useStateValue();
    const [showComments, setShowComments] = useState(false);
    const [inputComment, setInputComment] = useState("");

    const toggleShowComments = () => {
      setShowComments(!showComments)
    };

    const handleCommentSubmit = (event) => {
      if (inputComment.length == 0) {
        return;
      }

      axios
        .post(`/posts/${postId}/comments`, {
          user: user.username,
          avatar: user.photoURL,
          text: inputComment,
        })
        .then((resp)=>{
          setInputComment("");
        })


      event.preventDefault();
    };

    const currentUserLike = likes.find(like => {
        return user.displayName === like.user;
    });
    const currentUserLikesThisPost = !!currentUserLike;

    const toggleLike = () => {
        currentUserLikesThisPost ? doUnLike() : doLike();
    };

    const doLike = () => {
        axios.post(`/posts/${postId}/likes`, {
                user: user.displayName,
                avatar: user.photoURL,
            })
            .then((resp)=>{
                console.log(resp);
            });
    };

    const doUnLike = () => {
        axios.delete(`/posts/${postId}/likes/${currentUserLike._id}`)
            .then((resp)=>{
                console.log(resp);
            });
    };

    const likesFormatted = () => {
      const names = [];
      let othersText = "";
      if (currentUserLikesThisPost) {
        names.push("You");
      }

      const otherNames = likes.filter(like => {
        return like.user != user.displayName;
      });
      names.push(...otherNames.map(like => like.user));

      let othersLength = likes.length > 2 ? (names.length - 2) : 0;
      if (othersLength > 0) {
        othersText = ` and ${othersLength} other${othersLength > 1 ? "s" : ""}`;
      }
      const namesText = names.length <= 2 ? names.join(" and ") : names.slice(0, 2).join(", ");
      return `${namesText}${othersText} liked this`;
    };

    return (
        <div className="post">
           <div className="post__top">
               <Avatar src={profilePic} className='post__avatar' />
               <div className="post__topInfo">
                   <h3>{username}</h3>
                   <p>{new Date(timeStamp).toUTCString().split(' ').slice(0, 5).join(' ')}
                    </p>
               </div>
           </div>

            <div className="post__bottom">
                <p>{message}</p>

            </div>

            {
                imgName ? (
                    <div className="post__image">
                        <img src={`http://localhost:9000/retrieve/image/single?name=${imgName}`} alt='post-img' />
                    </div>
                ) : (
                        console.log('DEBUG >>> no image here')
                    )
            }
            <div className="post__options_wrap">
                {
                  likes.length > 0 && (
                    <div className="post__likes">
                    {likesFormatted()}
                    </div>
                  )
                }
                <div className="post__options">
                    <span className={`post__option${currentUserLikesThisPost ? " post__option_selected" : ""}`} onClick={toggleLike}>
                        <ThumbUpIcon/>
                          <p>Like</p>
                    </span>

                    <span className="post__option" onClick={toggleShowComments}>
                        <ChatBubbleOutlineIcon/>
                        <p>Comments{comments.length>0 ? ` (${comments.length})` : null}</p>
                    </span>

                    <div className="post__option">
                        <NearMeIcon/>
                        <p>Share</p>
                    </div>

                    <div className="post__option">
                        <AccountCircleIcon/>
                        <ExpandMoreOutlinedIcon/>
                    </div>
                </div>
            </div>
            <div className="post__comments">
                {
                  showComments
                    ? comments.map(comment => <Comment data={comment}/>)
                    : null
                }
                <div className="messageSender__top comment__input_wrap">
                  <Avatar src={user.photoURL} className='post__avatar' />
                  <form onSubmit={handleCommentSubmit}>
                    <input
                        type="text"
                        className='messageSender__input'
                        placeholder="Write a comment..."
                        value={inputComment}
                        onChange={(e)=> setInputComment(e.target.value)}
                    />
                  </form>
                </div>
            </div>
        </div>
    )
}

export default Post
