
import {React, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useAuth } from '../Utils/Auth';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from "@material-ui/core/Snackbar"

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <span color="inherit">
        Project Cloud Engineers
      </span>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Login(props) {
  const classes = useStyles();

  const [form, updateForm] = useState({ email: "", password: "" });
  let history = useHistory();
  let auth = useAuth();

  const [successAlert, setSuccessAlert] = useState(false);
  const [failAlert, setFailAlert] = useState(false);
  const [infoAlert, setInfoAlert] = useState(false);

  const handleClose = (event, reason, type) => {
    if (reason === 'clickaway') {
      return;
    }
    
    switch (type) {
        case 0:
            setSuccessAlert(false);      
            break;          
        case 1:
            setFailAlert(false);
            break;
        case 2:
            setInfoAlert(false);
            break;
        default:
            break;
    }
    setSuccessAlert(false);
};

  function handleFormChange(e) {
    let newState = {
      ...form,
    };
    newState[e.target.id] = e.target.value;
    updateForm(newState);
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    if ((form.email === "") || (form.password === "")) {
      setInfoAlert(true);
      return;
    }

    auth.signIn(form, (flag) => {
      if (!flag) {
        setFailAlert(true);
        return;
      }
      history.push('/home');
    });
    updateForm({ email: "", password: "" });
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleFormSubmit}>
          <TextField
            type="email"
            id="email"
            name="email"
            value={form.email}
            required
            onChange={handleFormChange}
            variant="outlined"
            margin="normal"
            fullWidth
            label="Email Address"
            autoComplete="email"
            autoFocus
          />
          <TextField
            type="password"
            id="password"
            name="password"
            value={form.password}
            required
            onChange={handleFormChange}
            variant="outlined"
            margin="normal"
            fullWidth
            label="Password"
            autoComplete="current-password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Login
          </Button>
          <Grid container>
            <Grid item style={{margin:'auto'}}>
              <Link to={`/register`}>Don't have an account? Sign Up</Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>

      <Snackbar open={successAlert} autoHideDuration={1000} onClose={(event, reason) => handleClose(event, reason, 0)}>
        <Alert onClose={(event, reason) => handleClose(event, reason, 0)} severity="success">
            Logged in!
        </Alert>
      </Snackbar>

      <Snackbar open={failAlert} autoHideDuration={1000} onClose={(event, reason) => handleClose(event, reason, 1)}>
          <Alert onClose={(event, reason) => handleClose(event, reason, 1)} severity="error">
              Incorrect username/password combination! 
          </Alert>
      </Snackbar>

      <Snackbar open={infoAlert} autoHideDuration={1000} onClose={(event, reason) => handleClose(event, reason, 2)}>
          <Alert onClose={(event, reason) => handleClose(event, reason, 2)} severity="info">
              Fields are empty! 
          </Alert>
      </Snackbar>


    </Container>
  );
}

export default Login;



