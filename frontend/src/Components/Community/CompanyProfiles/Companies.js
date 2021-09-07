import React, { useEffect, useState } from 'react'
import Company from './Company';
import MembersList from './MembersList';
import RequestList from './RequestList';
import '../../../Styles/Companies.css'
import { useFirebase } from "../../Utils/Firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ListItem, List, ListItemText, Input} from "@material-ui/core";
import { nanoid } from 'nanoid';

function JoinCompany({onClose, open, userId, update, db}) {
    
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        async function fetchData() {
            let newCompanies = [];
            await db.collection('companies').get().then( querySnapshot => {
                querySnapshot.docs.map( doc => {
                    if (!doc.data().members.includes(userId)) {
                        newCompanies.push(doc.data())
                    }
                })
                setCompanies(newCompanies);
            })
        }
        fetchData(); 
    }, [update]);

    return (
        <Dialog onClose={() => onClose('', false)} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">Join a company</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Select the company you want to join.
                </DialogContentText>
            </DialogContent>
            <List>
                {companies.map((company) => (
                    <ListItem button onClick={() => onClose(company.companyId,company.creatorId,company.name, true)} key={company.companyId}>
                        <ListItemText primary={`${company.name} (${company.companyId})`} />
                    </ListItem>
                ))}
            </List>
            <DialogActions>
                <Button onClick={() => onClose('', false)} color="primary">
                    Cancel
                </Button>
            </DialogActions>
      </Dialog>
    );
}


// Pop-up form for adding a company
function AddCompany({onClose, open}) {

    // To keep track of the values the user entered.
    const [company, setCompany] = useState('');
    const [mission, setMission] = useState('');

    return (
        <Dialog open={open} onClose={() => onClose(company, mission, false)} aria-labelledby="form-dialog-title">

            <DialogTitle id="form-dialog-title">Add new company</DialogTitle>

            <DialogContent>

                <DialogContentText>
                    Fill out the information below to create new company.
                </DialogContentText>

                <TextField
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Company Name"
                    fullWidth
                />

                <TextField
                    value={mission}
                    onChange={ (e) => setMission(e.target.value) }
                    autoFocus
                    margin="dense"
                    id="mission"
                    label="Mission Statement"
                    fullWidth
                />

            </DialogContent>

            <DialogActions>
                <Button onClick={() => onClose(company, mission, false)} color="primary">
                    Cancel
                </Button>
                <Button onClick={ () => onClose(company, mission, true)} color="primary">
                    Create
                </Button>
            </DialogActions>

        </Dialog>

    )
}

// Pop-up form for editing a company
function EditCompany({onClose, open, initialCompany, initialMission}) {

    // To keep track of the values the user entered.
    const [company, setCompany] = useState(initialCompany);
    const [mission, setMission] = useState(initialMission);
    const [file, setFile] = useState(null);
    
    useEffect(()=> {
        setFile(null)
    },[open])

    // When files are chosen.
    function handleFileChange(e) {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    }


    return (
        <Dialog open={open} onClose={() => onClose(company, mission, file, false)} aria-labelledby="form-dialog-title">

            <DialogTitle id="form-dialog-title">Edit Company Info</DialogTitle>

            <DialogContent>

                <DialogContentText>
                    Fill out the information below to edit company company.
                </DialogContentText>

                <TextField
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Company Name"
                    fullWidth
                />

                <TextField
                    value={mission}
                    onChange={ (e) => setMission(e.target.value) }
                    autoFocus
                    margin="dense"
                    id="mission"
                    label="Mission Statement"
                    fullWidth
                />

                <br></br>
                <br></br>

                
                <DialogContentText>
                    Add files that can be seen by other company members.
                </DialogContentText>

                <Input type="file" onChange={handleFileChange}>

                </Input>

            </DialogContent>

            <DialogActions>
                <Button onClick={() => onClose(company, mission, file, false)} color="primary">
                    Cancel
                </Button>
                <Button onClick={ () => onClose(company, mission, file, true)} color="primary">
                    Apply
                </Button>
            </DialogActions>

        </Dialog>

    )
}



function Companies() {
    // This hook will re-render the componenet everytime the "user" collection changes on firebase.
    const firebase = useFirebase();
    const db = firebase.firestore();
    const userID = JSON.parse(localStorage.user).userID;
    const userName = JSON.parse(localStorage.user).username;
    const [company, loading] = useCollectionData(db.collection('companies').where('members', 'array-contains-any', [userID]));
    const [addOpen, setAddOpen] = useState(false);
    const [joinOpen, setJoinOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    

    // Async function to upload a file to firebase.
    async function uploadFile(file) {
        let fileId = nanoid();
        let fileRef = firebase.storage().ref().child(fileId);
        await fileRef.put(file);
        let Url = await fileRef.getDownloadURL();
        await firebase.firestore().collection('files').doc(fileId).set({
            fileId: fileId,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uploaderId: userID,
            url: Url,
            name: file.name,
            type: file.type,
            // privacy: pri,
        });
        console.log('Uploaded file to firebase');
    }

    // Handler for the submitting the form.
    const handleAddClose = (company, mission, flag) => {
        console.log(company, mission, flag)
        setAddOpen(false);
        // If the flag is false then user just clicked cancel
        if (!flag) return;

        // Check if the data is given is valid
        if ((company.length === 0) || (mission.length === 0)) return;

        // Add the company to database
        const companyID = nanoid()
        const companyDb = {
            companyId: companyID,
            courses: [],
            creatorId: userID,
            members: [userID],
            mission: mission,
            name: company,
            stage: 0
        }
        db.collection('companies').doc(companyID).set(companyDb)
        // On success
        .then((val) => {
            console.log("Added", company, "to firebase!")
        })
        // On Error
        .catch((val) => {
            console.log("Could not add", company, ":", val)
        });
        
    }

    // Handler when editing current field
    const handleEditClose = (newCompany, newMission, newFile, flag) => {
        console.log(newCompany, newMission, newFile, flag);
        setEditOpen(false);
        // If the flag is false then user just clicked cancel
        if (!flag) return;

        // Check if the data is given is valid
        if ((newCompany.length === 0) || (newMission.length === 0)) return;

        // Update company name if it's new
        if (newCompany !== company[0].name) {
            db.collection('companies').doc(company[0].companyId).update( {
                name: newCompany 
            })
            // On success
            .then((val) => {
                console.log("Updated new company name:", newCompany, "to firebase!")
            })
            // On Error
            .catch((val) => {
                console.log("Could not update new company name", newCompany, ":", val)
            });
        }

        // Update mission if it's new
        if (newMission !== company[0].mission) {
            db.collection('companies').doc(company[0].companyId).update( {
                mission: newMission 
            })
            // On success
            .then((val) => {
                console.log("Updated new mission :", newMission, "to firebase!")
            })
            // On Error
            .catch((val) => {
                console.log("Could not update new mission", newMission, ":", val)
            });
        }
        // Add the file to firebase if present
        if (newFile !== null) {
            uploadFile(newFile);
        }
    }

    const handleJoinClose = (companyId,creatorId,companyname,flag) => {
        setJoinOpen(false);
        // If the flag is false then user just clicked cancel
        if (!flag) return;
        
        const reqId = nanoid();

        if(userID != creatorId){
            
            db.collection('requests').doc(reqId).set({
                creatorId: creatorId,
                senderId: userID,
                senderName: userName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                reqId: reqId,
                currentCompanyId: company.length != 0 ? company[0].companyId : '',
                newcompanyId: companyId,
                newcompanyName: companyname,  
            })
            .then((docRef) => {
                console.log("added post to firestore!")
                alert('Request sent to join: '+companyname);
            })
            .catch((error) => {
                console.log("Error:",error)
            });

        }
        else{
            
            // Add user to new company
            db.collection('companies').doc(companyId).update({
                members: firebase.firestore.FieldValue.arrayUnion(userID)
            })
            // On success
            .then((val) => {
                console.log("Joined", companyId)
            })
            // On Error
            .catch((val) => {
                console.log("Could not join", company, ":", val)
            });

            if(company.length != 0){
                const oldCompany = company[0].companyId;

                // Remove user from old company
                db.collection('companies').doc(oldCompany).update({
                    members: firebase.firestore.FieldValue.arrayRemove(userID)
                })
                // On success
                .then((val) => {
                    console.log("Removed from old", oldCompany)
                })
                // On Error
                .catch((val) => {
                    console.log("Could not remove", oldCompany, ":", val)
                });
            }
        }
    }

    // First determine if the user is in a company.
    if (loading) return (<h1>  Loading </h1>);
    return (
        <div className="companies">
            <div className='companies_container'>  
                {/* If the user is a part of a company display the company info, otherwise display the option
                to create a new company */}
                { 
                company.length !== 0 ?
                    <>
                        <Company name={company[0].name} mission={company[0].mission} creatorId= {company[0].creatorId} members={company[0].members} editCallback={setEditOpen}/>
                        {/* Pop up form to edit company. */}
                        <EditCompany open={editOpen} onClose={handleEditClose} initialCompany={company[0].name} initialMission={company[0].mission}/>
                        {/* Pop up form to join another company. */}
                        <JoinCompany open={joinOpen} onClose={handleJoinClose} userId={userID} update={company[0].name} db={db}/>
                        <br/>
                        <Button variant="contained" onClick={() => setJoinOpen(true)}>Join another company</Button>
                    </>
                :
                    <>
                        <h3>You are not apart of any company!</h3>
                        <Button variant="contained" onClick={() => setAddOpen(true)}>Add a company</Button>
                        <br/>
                        {/* Pop up form to create a new company. */}
                        <Button variant="contained" onClick={() => setJoinOpen(true)}>Join another company</Button>
                        <JoinCompany open={joinOpen} onClose={handleJoinClose} userId={userID} update={company.length} db={db}/>
                        <br/>
                        <AddCompany open={addOpen} onClose={handleAddClose}/>
                    </>
                }
            
            
            </div>

            <div className="companies_memberlist">
                {
                    company.length !== 0 ? 
                        <MembersList
                            creatorId= {company[0].creatorId}
                            members= {company[0].members} 
                            companyId = {company[0].companyId}
                        />
                    :
                    <h2>No members in company</h2>
                }
            </div>

            <div className="companies_requests">
                {company.length !== 0 ? (userID == company[0].creatorId ? <RequestList/> : null) : null}
            </div>




        </div>
    );
}

export default Companies
