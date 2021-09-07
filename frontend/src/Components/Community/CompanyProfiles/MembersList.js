import React, {useState, useEffect} from 'react'
import { useFirebase } from "../../Utils/Firebase";
import Members from './Members';
import '../../../Styles/MembersList.css'
import { Button } from '@material-ui/core';

function MembersList({creatorId, members, companyId}) {
    
    const firebase = useFirebase();
    const db = firebase.firestore();
    
    const [memberNames, setmemberNames] = useState([]);

    //Get information about all members in the company.
    useEffect(() => {
        async function fetchingData(){
            await db.collection('users').where("uid", "in", members).get().then((querySnapshot)=>{
                let temp = []
                querySnapshot.forEach((doc) =>{
                    temp.push({
                        firstname : doc.data().firstname,
                        lastname : doc.data().lastname,
                        username: doc.data().username,
                        uid: doc.data().uid,
                    })
                });
                setmemberNames(temp);
            })
        }
        fetchingData();
    }, [members])

    //Update states and data base when company owner removes member.
    const handleRemoval = (uid) => {
        console.log('This is the uid: ', uid);
        const temp = members.filter((member) => member != uid);
        const temp1 = memberNames.filter((member) => member.uid != uid);
        setmemberNames(temp1);
        
        //Remove member from company collection.
        db.collection('companies').doc(companyId).update({
            members: temp
        })
        .then(() => {
            console.log("Document successfully updated!");
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    }

    return (
        //List of all members
        <div className="memberlist">
            <h2>Members:</h2>
            {memberNames.map(member => {
                return(
                    <Members
                        uid = {member.uid} 
                        firstname = {member.firstname}
                        lastname = {member.lastname}
                        username = {member.username}
                        creatorId = {creatorId}
                        companyId = {companyId}
                        handleRemoval = {handleRemoval}
                    />
                )
            })}
        </div>
    )
}

export default MembersList
