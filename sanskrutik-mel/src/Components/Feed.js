import React, { useEffect, useState } from 'react'
import './Feed.css'
import MessageSender from './MessageSender'
import Post from './Post'
import StoryReel from './StoryReel'
import axios from '../axios'
import Pusher from 'pusher-js'
import db from '../firebase'

const pusher = new Pusher('76a2a535c2203dc6eeff', {
    cluster: 'ap2'
  });

const Feed = () => {
    const [profilePic, setProfilePic] = useState('')
    const [postsData, setPostsData] = useState([])

    const syncFeed = () => {
        axios.get('/retrieve/posts')
            .then((res)=>{
                console.log(res.data);
                setPostsData(res.data);
            })
    }

    useEffect(() => {
        const channel = pusher.subscribe('posts');
        channel.bind('inserted', function(data) {
            syncFeed()
        });
    }, [])  
    
    useEffect(() => {
        syncFeed()
    }, [])  


    return (
        <div className='feed' >
            <StoryReel />
            <MessageSender />

            {
                postsData.map(post => (
                    <Post
                        postId={post._id}
                        profilePic={post.avatar}
                        message={post.text}
                        timeStamp={post.timeStamp}
                        imgName={post.imgName}
                        username={post.user}
                        likes={post.likes}
                        comments={post.comments}
                    />
                ))
            }
        </div>
    )
}

export default Feed
