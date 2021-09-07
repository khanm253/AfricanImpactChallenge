import AssignCompanies from "./AssignCompanies"
import React, { useState } from "react";
import { useFirebase } from "../Utils/Firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { makeStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import { Typography, Button, Select, InputLabel, MenuItem, FormHelperText, FormControl, Snackbar } from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 400,
    }
  }));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Admin() {

    // This hook will re-render the componenet everytime the "user" collection changes on firebase.
    const firebase = useFirebase();
    const db = firebase.firestore();
    const [users, loading] = useCollectionData(db.collection('users').where('role', '!=', 'admin'));

    // To keep track of the user and role selected in the drop down menu.
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [successAlert, setSuccessAlert] = useState(false);
    const [failAlert, setFailAlert] = useState(false);
    const [infoAlert, setInfoAlert] = useState(false);
    const classes = useStyles();
    

    // Sort the users array. (This must be done here due to limitations of firebase query)
    if (!loading) {
        users.sort( (firstEle, secondElement) => {
            if (firstEle.email < secondElement.email) {
                return -1;
            }
            else if (firstEle.email > secondElement.email) {
                return 1;
            }
            else {
                return 0;
            }
        });
    }

    // When the success alert is closed
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

    // When form is submitted update firebase.
    const handleSubmit = () => {
        // For the case when form is not complete.
        if ((selectedUser === "") || (selectedRole === "")){
            return;
        }

        // If the new role selected is the same.
        if (users[selectedUser].role === selectedRole) {
            console.log('New role for', users[selectedUser].email , 'is the same! No updates required');
            setInfoAlert(true);
        }
        // send request to db to change role
        else {
            console.log('Changing role of', users[selectedUser].email, 'from', users[selectedUser].role, 'to', selectedRole);
            db.collection('users').doc(users[selectedUser].uid).update( {
                role: selectedRole 
            })
            .then(
                // on successful change
                (val) => {
                    console.log('Done update!', val);
                    setSuccessAlert(true);
                },
                // on non-sucessful change
                (err) => {
                    console.log('Could not update!', err);
                    setFailAlert(true);
                }
            );
            
        }
    }

    return (
        <div>
            
            <Typography variant="h3" color="textPrimary" gutterBottom>
                Admin Settings
            </Typography>
            <br></br>
            <Typography variant="h4" gutterBottom>
                Assign Roles
            </Typography>

            <FormControl className={classes.formControl}>
                <InputLabel>Select a user</InputLabel>
                <Select
                    autoWidth={true}
                    value={selectedUser}
                    onChange={(event) => setSelectedUser(event.target.value)}>

                    {
                        !loading ? 
                        users.map((user,index) => <MenuItem key={user.uid} value={index}> {user.email} : {user.role} </MenuItem>) 
                        : <MenuItem> </MenuItem> }

                </Select>
                <FormHelperText>The value after the email indicates the user's current role.</FormHelperText>
            </FormControl>

            <br></br>
            <FormControl className={classes.formControl}>
                <InputLabel>Select a Role</InputLabel>
                <Select 
                    autoWidth={true} 
                    value={selectedRole}
                    onChange={(event) => setSelectedRole(event.target.value)}
                    >
                
                    <MenuItem value="inaccessible"> Inaccessible </MenuItem>
                    <MenuItem value="mod"> Moderator </MenuItem>
                    <MenuItem value="instructor"> Instructor </MenuItem>
                
                </Select>
                <FormHelperText>Moderators have extra privileges in the community section.</FormHelperText>
                <br></br>

            </FormControl>
            <br></br>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
                Submit
            </Button>

            <Snackbar open={successAlert} autoHideDuration={1000} onClose={(event, reason) => handleClose(event, reason, 0)}>
                <Alert onClose={(event, reason) => handleClose(event, reason, 0)} severity="success">
                    Update Sucessful!
                </Alert>
            </Snackbar>

            <Snackbar open={failAlert} autoHideDuration={1000} onClose={(event, reason) => handleClose(event, reason, 1)}>
                <Alert onClose={(event, reason) => handleClose(event, reason, 1)} severity="error">
                    Something went wrong!
                </Alert>
            </Snackbar>

            <Snackbar open={infoAlert} autoHideDuration={1000} onClose={(event, reason) => handleClose(event, reason, 2)}>
                <Alert onClose={(event, reason) => handleClose(event, reason, 2)} severity="info">
                    The user selected already has that role!
                </Alert>
            </Snackbar>
            <br></br>
            <br></br>
            <AssignCompanies/>
        </div>
    );

}

export default Admin;
