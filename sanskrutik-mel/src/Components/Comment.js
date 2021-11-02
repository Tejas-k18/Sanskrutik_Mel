import React from 'react';
import { useStateValue } from '../StateProvider'
import { Avatar } from '@material-ui/core'
import './Comment.css';

const Comment = ({data: {text, user: username, avatar, createdAt}}) => {
  const [{user}] = useStateValue();
  return (
    <div className="messageSender__top">
      <Avatar src={avatar} className='post__avatar' />
      <div className="comment__text_wrap">
        <div className="comment__username">{username ? username : null}</div>
        <div className="comment__text">{text ? text : null}</div>
        <div className="comment__time">
          {new Date(createdAt).toUTCString().split(' ').slice(0, 5).join(' ')}
        </div>
      </div>
    </div>
  )
};
export default Comment
