import React from "react";
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import { useAuth } from './Auth';
import Tooltip from '@material-ui/core/Tooltip';
import "../../Styles/Navbar.css";

function Home(props) {
    let { path, url } = useRouteMatch();
    let history = useHistory();
    let auth = useAuth();
    let user = JSON.parse(localStorage.getItem("user"));
     
    return (
        <nav className="navbar is-transparent" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <Link className="navbar-item" to={`/`}>
                    <img src="https://dslv9ilpbe7p1.cloudfront.net/Ln9SnKBLyrz_YNr7I_bH8g_store_logo_image.png" width="150" height="60" />
                </Link>

                <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div id="navbarBasicExample" className="navbar-menu">
                {/* These are routes that are only defined after we log in and get to the home screen */}
                {auth.user ? (
                    <div className="navbar-start">
                        <Link className="navbar-item" to={`/home`}>Home</Link>
                        <Link className="navbar-item" to={`/home/e-learning`}>E-Learning</Link>
                        <Link className="navbar-item" to={`/home/community`}>Community</Link>
                        {user.role === 'admin' ? <Link className="navbar-item" to={`/home/admin`}>Admin Settings</Link> 
                        : <></>}
                    </div>
                ) : (
                    <div className="navbar-start">
                        {/* <a className="navbar-item"><Link to={`/home`}>Home</Link></a>
                        <a className="navbar-item"><Link to={`/`}>Some page that doesnt need signin</Link></a> */}
                    </div>
                )}

                <div className="navbar-end">
                    <div className="navbar-item">
                        {auth.user ? (
                            <Tooltip title='Update Profile' placement='left'>
                                <Link className='navbar-item' to={'/home/user-preferences'}>
                                    <i className="fas fa-user-cog"></i>
                                </Link>
                            </Tooltip>
                            
                        ) : (<></>)}
                    </div>

                    <div className="navbar-item">
                        {auth.user ? (
                            <div className="buttons">
                                <a className="button is-primary" onClick={() => auth.signOut(() => history.push("/"))}><strong>Log Out</strong></a>
                            </div>
                        ) : (
                            <div className="buttons">
                                <Link className="button is-primary" to="/register">Sign Up</Link>
                                <Link className="button is-light" to="/login">Log In</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Home;

