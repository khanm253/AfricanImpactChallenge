import React, { useEffect } from "react";
import { Switch, Route, Link, useHistory } from 'react-router-dom';
import { useAuth, PrivateRoute } from './Utils/Auth';
import { Typography, FormHelperText } from "@material-ui/core";
import TextLoop from "react-text-loop";

import Register from './External/Register';
import Login from './External/Login';
import Home from './Home/Home';
import '../Styles/App.css';


function App() {
  let auth = useAuth();
  let history = useHistory();

  useEffect(() => {
    auth.checkSession(() => {
      history.push('/home');
    });
  }, []);
  //Original template:
  return (
    <div className="App">
      <Switch>
        <Route exact path='/'>
          <div style={{
            backgroundImage: `url("https://ds6br8f5qp1u2.cloudfront.net/blog/wp-content/uploads/2017/04/web-design-background.png?x31155")`
            ,'background-repeat': 'repeat-x', 'width':"100%",  position: "fixed"
         }} >
            <div class="hero-head">
              <nav class="navbar">
                <div class="container">
                  <div class="navbar-brand">
                    <span class="navbar-burger burger" data-target="navbarMenu">
                      <span></span>
                      <span></span>
                      <span></span>
                    </span>
                  </div>
                  <div id="navbarMenu" class="navbar-menu">
                    <div class="navbar-end">
                      <span class="navbar-item">
                        <a class="button is-white is-outlined" href="#">
                          <span class="icon">
                            <i class="fa fa-home"></i>
                          </span>
                          <Link className="App-link" to={`/home`}>Home</Link>
                        </a>
                      </span>
                      <span class="navbar-item">
                        <a class="button is-white is-outlined" href="#">
                          <Link className="App-link" to={`/register`}>Register</Link>
                        </a>
                      </span>
                      <span class="navbar-item">
                        <a class="button is-white is-outlined" href="#">
                          <span class="icon">
                            <i class="fa fa-superpowers"></i>
                          </span>
                          <Link className="App-link" to={`/login`}>Login</Link>
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
            <div class="hero-body">
              <div class="container has-text-left">
                <div class="column is-6">
                  <h1 class="title">
                    Welcome to Stonks!
                    </h1>

                  <TextLoop>
                  <Typography variant="h4" gutterBottom>Build Market-Creating Inovations</Typography>
                  <Typography variant="h4" gutterBottom>Complete E-Learning Access</Typography>
                  <Typography variant="h4" gutterBottom>Join or Start a Company</Typography>
                  <Typography variant="h4" gutterBottom>Gain Advice From Mentors</Typography>
                  <Typography variant="h4" gutterBottom>Easy Registration Process</Typography>
                  </TextLoop>
                  <a target="_blank" href="https://www.africanimpact.ca/the-african-impact-challenge">
                  <img src="https://images.squarespace-cdn.com/content/v1/5959429eff7c50228e412bf1/1607561881703-9EE9CN7L551HJPITP9XB/AII+LOGO.png?format=1500w" alt="Girl in a jacket"/>
                  </a>
                </div>
              </div>
            </div>
            <footer class="footer">
              <div class="content has-text-centered">
                <p>
                  <strong>Copyright 2021</strong> by <a>Cloud Engineers </a>
                  <a>University of Toronto</a>
                </p>
              </div>
            </footer>
          </div>
        </Route>
        <Route exact path='/register'>
          <Register />
        </Route>
        <Route exact path='/login'>
          <Login />
        </Route>
        <PrivateRoute path="/home">
          <Home />
        </PrivateRoute>
      </Switch>
    </div>
  );
}

export default App;
