import React, { useState, useContext, createContext } from "react";
import { Route, Redirect } from 'react-router-dom';
import axios from 'axios';

const authContext = createContext();

function AuthProvider({ children }) {
  const auth = useAuthProvider();
  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  );
}

function useAuth() {
  return useContext(authContext);
}

function useAuthProvider() {
  const [user, setUser] = useState(null);

  const signUp = (details, cb) => {
    return axios.post('http://localhost:8080/register', details)
      .then((response) => {
        cb(true);
      })
      .catch((error) => {
        cb(false);
        console.error(error);
      });
  };

  const signIn = (details, cb) => {
    return axios.post('http://localhost:8080/login', details)
      .then((response) => {
        // set the user info into state
        let user = { userID: response.data.userID, username: response.data.username, role: response.data.role };
        setUser(user);
        // store the JWT and user in localStorage
        localStorage.setItem("authToken", response.data.authToken);
        localStorage.setItem("user", JSON.stringify(user));
        cb(true);
      })
      .catch((error) => {
        cb(false)
        console.error(error);
      });
  }

  const signOut = (cb) => {
    return axios.post('http://localhost:8080/logout', {}, {
      headers: {
        'Authorization': `token ${localStorage.getItem("authToken")}`
      }
    }).then((response) => {
      // set the local storage of auth and user to null
      localStorage.setItem("authToken", "");
      localStorage.setItem("user", "");
      setUser(null);
      cb();
    }).catch((error) => {
      console.error(error);
    });
  }

  const checkSession = async (cb) => {
    // check if the token and user are in local storage
    let token = localStorage.getItem("authToken");
    let user = localStorage.getItem("user");
    if ( token !== null && token !== "" && user !== null && user !== "") {
        // revalidate the token if it exists
        try {
            let response = await axios.post('http://localhost:8080/verify', {}, {
                headers: {
                    'Authorization': `token ${token}`
                }
            });
            setUser(JSON.parse(user));
            cb();
        } catch (error) {
            console.error("auth caught error on verify", error);
            // set the local storage of auth and user to null
            localStorage.setItem("authToken", "");
            localStorage.setItem("user", "");
            setUser(null);
        }
    } else {
        setUser(null);
    }
    // check if tings in local Storage
    // if in local storage then, then send req to auth service
    // depending on response from backed, either call callback or setUser(null)
    // user ? cb() : console.log("not logged in");
  }

  return {
    user,
    signIn,
    signOut,
    signUp,
    checkSession
  };
}

function PrivateRoute({ children, ...rest }) {
  let auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

export {
  AuthProvider,
  PrivateRoute,
  useAuth
}