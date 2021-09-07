import {React, useState} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../Utils/Auth';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Register() {
  const classes = useStyles();

  let auth = useAuth();
  let history = useHistory();
  const [info, setInfo] = useState({ firstname:"", lastname:"", username: "", email: "", password: "", bio: ""});

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

  const signUp = e => {
    e.preventDefault();
    if ((info.firstname === "") || (info.lastname === "") || (info.username === "") || (info.email === "") || (info.password === "")) {
      setFailAlert(true)
      return;
    }
    auth.signUp(info, (flag) => {
      if (!flag) {
        setInfoAlert(true);
        return;
      }
      history.push('/login'); 
    });
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <form className={classes.form}>
          
          <FormHelperText id="helper-text-mandatory" style={{padding:'0.5rem 0'}}>Mandatory Fields</FormHelperText>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                onChange={e => setInfo({ ...info, firstname: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                onChange={e => setInfo({ ...info, lastname: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="username"
                label="User Name"
                name="username"
                onChange={e => setInfo({ ...info, username: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={e => setInfo({ ...info, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={e => setInfo({ ...info, password: e.target.value })}
              />
            </Grid>
          
          </Grid>

          <FormHelperText id="helper-text-optional" style={{padding:'0.5rem 0'}}>Optional Fields</FormHelperText>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                id="bio"
                label="Biography"
                name="bio"
                onChange={e => setInfo({ ...info, bio: e.target.value })}
              />
            </Grid>
          
          </Grid>


          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={signUp}
            className={classes.submit}>
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item style={{margin:'auto'}}>
              <Link to={`/login`}>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>


      <Snackbar open={successAlert} autoHideDuration={1000} onClose={(event, reason) => handleClose(event, reason, 0)}>
        <Alert onClose={(event, reason) => handleClose(event, reason, 0)} severity="success">
            User created sucessfully!
        </Alert>
      </Snackbar>

      <Snackbar open={failAlert} autoHideDuration={1000} onClose={(event, reason) => handleClose(event, reason, 1)}>
          <Alert onClose={(event, reason) => handleClose(event, reason, 1)} severity="error">
              Not all mandatory fields are filled out!
          </Alert>
      </Snackbar>

      <Snackbar open={infoAlert} autoHideDuration={1000} onClose={(event, reason) => handleClose(event, reason, 2)}>
          <Alert onClose={(event, reason) => handleClose(event, reason, 2)} severity="info">
              That email is taken!
          </Alert>
      </Snackbar>


    </Container>
  );
}

export default Register;
