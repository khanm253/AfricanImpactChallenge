import React, { useState, useEffect, useRef } from "react";
import { useCollectionDataOnce, useCollectionData } from 'react-firebase-hooks/firestore';
import { useParams } from 'react-router-dom';
import {List,ListItemText, ListItem, ListSubheader} from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import { useFirebase } from '../../Utils/Firebase';
import {Link}  from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';

import "../../../Styles/Modules.css"


const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  }
});

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

//component for course modules
function Modules(props) {

  const classes = useStyles();
  let { courseId } = useParams();

  const firebase = useFirebase();

  let db = firebase.firestore();
  const [values, loading, error] = useCollectionDataOnce(db.collection("modules").where('courseId', '==', courseId));
  const [curDisplay, setDisplay] = useState([]);


  async function handleCard(cardId,isAss){
      let userDoc;
      let userResult;
      if(isAss){
          userResult = await db.collection('assignments').where('assignmentId', '==', cardId).get();
      }else{
          userResult = await db.collection('lessons').where('lessonId', '==', cardId).get();
      }
      userResult.forEach((doc) => {
          userDoc = doc.data();
          if(isAss){
              userDoc.type = "assignment";
          }else{
              userDoc.type = "lesson";
          }
      })

      setDisplay(JSON.stringify(userDoc));
  }
  function generateItemsMarkup(items){
      if(items){
          return (
              <div>{
              items.map((item)=>{
                  if(item.type == "assignment"){
                      return(
                          <Button variant="contained" color="primary" value={item.id} onClick={() => { handleCard(item.id,1)}}>Assignment: {item.title}</Button>
                      )
                  }
                  else if(item.type == "lesson"){
                      return(
                          <Button variant="contained" color="secondary" value={item.id} onClick={() => { handleCard(item.id,0)}}>Lesson: {item.title}</Button>
                      )
                  }
                  return(
                      <br></br>
                  )
              })
          }
              </div>
          )
          }

  }
  function generateMarkup(modules){
      values.sort((a, b) => (a.order > b.order) ? 1 : -1)
      return(
          modules.map((module)=>{
              return (
                  <div style={{border: "2px solid black"}} >
                      <ListItem button>
                          <ListItemText primary={module.title} />
                      </ListItem>
                      {
                          generateItemsMarkup(module.items)
                      }
                      <Divider />
                  </div>
                );
          })
      )
    }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
      <div>
          <List component="nav" aria-label="mailbox folders">
              {
                  generateMarkup(values)
              }
              <br></br>
          </List>

          {
              curDisplay && curDisplay.length!=0 && (<MediaCard curDisplay={curDisplay}/>)
          }

          <Link className="App-link" to={'/home/e-learning/'+courseId}>Back to Course Homepage</Link>

      </div>
    )
}



// Display more info for a specific module
function MediaCard({curDisplay}) {


  //const classes = useStyles();
  const [fileURL, setFileURL] = useState('');
  const [fileName, setFileName] = useState('');
  const [successAlert, setSuccessAlert] = useState(false);
  const [failAlert, setFailAlert] = useState(false);

  const firebase = useFirebase();
  let db = firebase.firestore();

  let newCard = JSON.parse(curDisplay);
  console.log(newCard)

  const t = firebase.firestore.Timestamp.fromDate(new Date());

  // Fetching user data from database
  const uid = JSON.parse(localStorage.getItem('user')).userID;
  const sid = `${newCard.assignmentId}_${uid}`; //submission id that ties one unique user and assignment to a single submission

  const [userSubmission, loading] = useCollectionData(db.collection('submissions').where('submissionId', '==', sid));
  if (!loading) {
    console.log(userSubmission);
  }

  // clears file input whenever
  const fileRef = useRef();
  useEffect(() => {
    if (newCard.type == 'assignment') {
      fileRef.current.value = '';
    }
  }, [curDisplay, fileName])

  // Downloads media
  async function handleDownloads(files){
    if(files){
        files.forEach( async (file) =>{
            let userResult = await db.collection('files').where('fileId', '==', file).get();
            userResult.forEach((doc) => {
                window.open(doc.data().url, "_blank");
            })
        })
    }
  }

  // Handles assignment upload when file input is changed
  const handleInputChange = async (event) => {

    const file = event.target.files[0];
    console.log({filename: fileName, file: file});

    // creating firebase storage reference to put file
    let fileRef = firebase.storage().ref().child('submissions').child(`${newCard.assignmentId}`).child(`${uid}`);
    let fileUploadSuccessful = null; //ensures database interaction is atomic (firestore is only updated if firebase storage is updated succesfully)

    // put file in firebase storage
    await fileRef.put(file)
    .then(
      (val) => {
        console.log('file uploaded successfully', val);
        fileUploadSuccessful = true;
      },
      (err) => {
        console.log('file upload fail', err);
        fileUploadSuccessful = false;
        setFailAlert(true);

      });
   
    // update or create new submission document in firestore
    if (fileUploadSuccessful) {
      await fileRef.getDownloadURL()
      .then(
        (url) => {
          firebase.firestore().collection('submissions').doc(sid).set({
            submissionId: sid,
            createdAt: (new Date()).toISOString(),
            userId: uid,
            assignId: newCard.assignmentId,
            url: url,
            filename: file.name
      
          }, {merge: true})
          .then(
            (val) => {
              console.log('firestore updated', val);
              setSuccessAlert(true);
              setFileName(file.name);
            },
            (err) => {
              console.log('firestore update fail');
              setFailAlert(true);  
            }
          );
        }
      );
    }
  }

  // New Submission button triggers hidden file input
  const handleSubmission = () => { 
    const fileInput = document.getElementById('fileUpload');
    fileInput.click();

  }

  // Displays current submission under assingment card if submission exists
  const displaySubmission = () => {
    
    if (userSubmission.length) {
      return (
      <React.Fragment>
        <Typography variant="body2" color="textSecondary" component="p">
          Submitted! <a href={userSubmission[0].url} download>{userSubmission[0].filename}</a>
        </Typography>
        
      </React.Fragment>
      );
    }

    else {
      return (
        <Typography variant="body2" color="textSecondary" component="p">
        No Submission
        </Typography>
      )
    }
        
      
  }

  // Renders assignment card
  const renderAssignment = () => {
    let date = new Date(newCard.duedate);
    let dueDate = ("Date: "+date.getDate()+
      "/"+(date.getMonth()+1)+
      "/"+date.getFullYear());

      return (
        //<Card className={classes.root}>
        <Card>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {newCard.title}
              </Typography>
            
              <Typography variant="body2" color="textSecondary" component="p">
                  {newCard.description}
              </Typography>
              <br></br>
              <Typography color="textSecondary">
              Due {dueDate}
              </Typography>

              {loading ? (
                <Typography variant="body2" color="textSecondary" component="p">
                loading...
                </Typography>
                ) : displaySubmission()}
                
            </CardContent>
          <CardActions>
            <Button size="small" color="primary" value={newCard.files} onClick={() => {handleDownloads(newCard.files)}} >
              Download Handout
            </Button>
            <input 
              ref={fileRef}
              id='fileUpload'
              type='file'
              hidden='hidden'
              onChange={handleInputChange}/>
            <Button size="small" color="primary" text-align="right" value={newCard.files} onClick={handleSubmission} >
              New Submission
            </Button>

            <Snackbar open={successAlert} autoHideDuration={1000} onClose={() => setSuccessAlert(false)}>
                <Alert onClose={() => setSuccessAlert(false)} severity="success">
                    Update Sucessful!
                </Alert>
            </Snackbar>

            <Snackbar open={failAlert} autoHideDuration={1000} onClose={() => setFailAlert(false)}>
                <Alert onClose={() => setFailAlert(false)} severity="error">
                    Something went wrong!
                </Alert>
            </Snackbar>
            
                
          </CardActions>
        </Card>
    );
  }
  

  // Renders non assignment card (e.g. video lesson)
  const renderInfo = () => {
      return (
          <Card>
            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {newCard.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    {newCard.content}
                </Typography>
                <Button size="small" color="primary" value={newCard.files} onClick={() => {handleDownloads(newCard.files)}} >
              Download Handout
                </Button>
                <br></br>
              </CardContent>
            </CardActionArea>
            <CardActions>
            </CardActions>
          </Card>
        );
  }

  //Render MediaCard Component
  return (
    <React.Fragment>
      {newCard.type === "assignment" ? renderAssignment() : renderInfo()}
    </React.Fragment>
    
  )
}

  


export default Modules;
