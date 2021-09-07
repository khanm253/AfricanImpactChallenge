import React from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import ChatIcon from '@material-ui/icons/Chat';
import BusinessIcon from '@material-ui/icons/Business';
import '../../Styles/CommunityNavbar.css'

function Navbar() {
 
    let history = useHistory();
    let { path } = useRouteMatch();

    return (
        <div className="navbar">
            <div 
                className="navbar__postIcon" 
                onClick={() => history.push(`${path}`)}
            >
                <SupervisorAccountIcon 
                    fontSize='large'
                ></SupervisorAccountIcon>
            </div>

            <div 
                onClick={() => history.push(`${path}/companies`)}
                className="navbar__businessIcon"
            >
                <BusinessIcon
                    fontSize='large'
                ></BusinessIcon>
            </div>
        </div>
    )
}

export default Navbar
