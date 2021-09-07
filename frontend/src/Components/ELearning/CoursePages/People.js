import React, { useState, useEffect } from "react";
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import { useParams, Link } from 'react-router-dom';
import { useFirebase } from '../../Utils/Firebase';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

function People(props) {
    let { courseId } = useParams();
    let user = JSON.parse(localStorage.getItem("user"));
    const [userArr, setUserArr] = useState([]);

    let firebase = useFirebase();
    let db = firebase.firestore();
    const [values, loading, error] = useCollectionDataOnce(db.collection("courses").where('courseId', '==', courseId));

    const useStyles = makeStyles((theme) => ({
        root: {
          width: '100%',
          maxWidth: '36ch',
          backgroundColor: theme.palette.background.paper,
        },
        inline: {
          display: 'inline',
        },
      }));
    const classes = useStyles();

    useEffect(async()=>{
        if(values){
            let userDoc;
            let userResult = await db.collection('users').where('uid', 'in', values[0].students).get();
            userResult.forEach((doc) => {
                userDoc = doc.data();
                setUserArr(oldArray => [...oldArray, userDoc]);
            })
        }

    },[values]);


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    
    


    function generateMarkup(students){
        return(
        userArr.map((student) =>{
            return(
                <div>
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar alt={student.firstname} src={student.avatar} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={student.firstname}
                            secondary={
                            <React.Fragment>
                                <Typography
                                component="span"
                                variant="body2"
                                className={classes.inline}
                                color="textPrimary"
                                >{student.bio}
                                </Typography>
                                <br/>
                                <p>{student.email}</p>
                            </React.Fragment>
                            }
                        />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                </div>
            )
        })
        )
    }
      
    return (
        <div className="column is-10">
            <p>{values[0].title} Class List!</p>
            <List className={classes.root}     style={{
                position: 'absolute', left: '50%', top: '50%',
                transform: 'translate(-50%, -50%)'
            }}>
            {values && generateMarkup(values[0].students)}
            </List>
            

        </div>
        
    )
}

export default People;
