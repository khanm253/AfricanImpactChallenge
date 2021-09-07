import React from 'react';
import ReactDOM from 'react-dom';
import './Styles/index.css';
import App from './Components/App';

import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './Components/Utils/Auth';
import { FirebaseProvider } from './Components/Utils/Firebase';

ReactDOM.render(
  <React.StrictMode>
    <FirebaseProvider>
      <AuthProvider>
        <Router>
          <App />
        </Router>
      </AuthProvider>
    </FirebaseProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

