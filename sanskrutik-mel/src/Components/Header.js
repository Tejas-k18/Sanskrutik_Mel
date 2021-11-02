import FlagIcon from '@material-ui/icons/Flag';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import StorefrontOutlinedIcon from '@material-ui/icons/StorefrontOutlined';
import SubscriptionsOutlinedIcon from '@material-ui/icons/SubscriptionsOutlined';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import { Avatar , IconButton } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React,{ useState } from 'react';
import './Header.css';
import { useStateValue } from '../StateProvider'
import {
    BrowserRouter as Router,
    useHistory,
    Switch,
    Route,
    Link
  } from "react-router-dom";


const Header = () => {

    const [{user},dispatch] = useStateValue()
    
    const [searchkey,setsearchkey] = useState('')

    const history = useHistory();
    
    console.log(user);
    
    const handlesearchinput = (e) =>{
        if (e.key === 'Enter') {
            const value = e.target.value;
            setsearchkey(value);
            console.log(searchkey);
            history.push(
                {
                    pathname: '/searchresult',
                    search: value
                  });
            e.target.value="";
        }
      
    }

    return (
        <div className="header" data={searchkey}>
            
            <div className="header__left">
                <img src="/logo.png" alt="sans logo"></img>
            </div>

            <div className="header__input">
                <SearchIcon />
                <input 
                    placeholder='Search'
                    type="text"
                    name="searchkey"
                    onKeyDown={handlesearchinput}
                    autoComplete="off"
                />
            </div>


            <div className="header__center">
                <div className="header__option header__option--active">
                    <Link to="/" class="header__link"><HomeIcon fontSize='large' /></Link>
                </div>
                <div className="header__option">
                    <FlagIcon fontSize='large' />
                </div>
                <div className="header__option">
                        <SubscriptionsOutlinedIcon fontSize='large' />
                </div>
                <div className="header__option">
                    <StorefrontOutlinedIcon fontSize='large' />
                </div>
                <div className="header__option">
                    <SupervisedUserCircleIcon fontSize='large' />
                </div>
            </div>


            <div className="header__right">
                <div className="header__info">
                   
                    <Avatar src={user.photoURL}/>
                    <h4>{user.displayName}</h4>
                </div>


                <IconButton>
                <ExpandMoreIcon />
                </IconButton>

            </div>

        </div>
    )
}

export default Header
