import React, { useEffect, useState } from 'react'
import Post from './Post'
import axios from '../axios'
import Pusher from 'pusher-js'
import './SearchResult.css'
import { useLocation } from "react-router-dom";

const pusher = new Pusher('76a2a535c2203dc6eeff', {
    cluster: 'ap2'
});

function SearchResult (prop) {
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

    const location = useLocation()
    const searchkey = location.search.substring(1).toUpperCase();
    const element = [];
    postsData.forEach(dataentry)
    function dataentry(entry) {
        console.log(entry.text.toUpperCase(),searchkey,entry.text.toUpperCase().includes(searchkey))
        if(entry.text.toUpperCase().includes(searchkey) || entry.user.toUpperCase().includes(searchkey)){
            element.push(<Post 
                profilePic={entry.avatar}
                message={entry.text}
                timeStamp={entry.timeStamp}
                imgName={entry.imgName}
                username={entry.user}
            />)
        }
    }
    return(
        <div className="SearchResult">
            <h1>Search Result for <strong>{searchkey}</strong></h1>
            {element}
        </div>
    )
}

export default SearchResult;