import React from 'react'
import Companies from './CompanyProfiles/Companies'
import PostList from './Posts/PostList'
import Chat from './Chat/Chat'
import Navbar from './Navbar'
import { Switch, Route, Link, useHistory, useLocation, useRouteMatch } from 'react-router-dom';

function Community() {
    let { path } = useRouteMatch();

    return (
        <div className="community__page">
            <div className="community__top">
                <Navbar/> 
            </div>
        <Switch>
            <div className="community__bottom">
                <Route exact path={path}>
                    <PostList/>           
                </Route>
                <Route exact path={`${path}/chat`}>
                    <Chat />
                </Route>
                <Route exact path={`${path}/companies`}>
                    <Companies />
                </Route>
            </div>
        </Switch>
        </div>
    )
}

export default Community
