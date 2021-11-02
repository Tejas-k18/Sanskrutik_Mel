import React from 'react';
import './App.css';
import Feed from './Components/Feed';
import Header from './Components/Header';
import Login from './Components/Login';
import Sidebar from './Components/Sidebar';
import Widgets from './Components/Widget';
import { useStateValue } from './StateProvider';


function Home() {

    const [{ user }, dispatch] = useStateValue()
    return(
        <div className="app">
        {
            user ? (
            <>
                <Header />
                <div className="app__body">
                <Sidebar />
                <Feed />
                <Widgets />
                </div>
            </>
            ) : (
                <Login />
            )
        }
        </div>
    )
}

export default Home