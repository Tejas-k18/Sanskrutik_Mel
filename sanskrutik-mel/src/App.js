import React from 'react';
import './App.css';
import Feed from './Components/Feed';
import Header from './Components/Header';
import Login from './Components/Login';
import Sidebar from './Components/Sidebar';
import Widgets from './Components/Widget';
import { useStateValue } from './StateProvider';
// import Profile from './Components/Profile';
import SearchResult from './Components/SearchResult';
import Home  from './Home';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


function App() {
  const [{ user }, dispatch] = useStateValue()
  
  return (
    <div className="app">
      {
        user ? (
          <>
            <Router>
              <Header />
              <div className="app__body">
                <Sidebar />
                <Switch>
                  <Route exact path="/">
                    <Feed />
                    <Widgets />
                  </Route>
                  <Route path="/searchresult">
                    <SearchResult />
                  </Route>
                </Switch>
              </div>
            </Router>
          </>
        ) : (
            <Login />
          )
      }
    </div>
  );
}

export default App;