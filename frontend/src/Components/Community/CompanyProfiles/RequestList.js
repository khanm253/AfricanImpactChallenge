import React, {useState, useEffect} from 'react'
import { useFirebase } from "../../Utils/Firebase";
import Request from './Request';
import '../../../Styles/RequestList.css'

function RequestList() {
    
    const firebase = useFirebase();
    const db = firebase.firestore();
    let user = JSON.parse(localStorage.user);

    const [requests, setRequests] = useState([]);

    //Remove request when owner has made a decision.
    const handleDecision = (requestId) => {
        let temp = requests.filter((req) => req.reqId != requestId);
        setRequests(temp);
    }

    //Get all the requests information from the database.
    useEffect(() => {
        async function fetchingData(){
            await db.collection('requests').where("creatorId", "==", user.userID).get().then((querySnapshot)=>{
                let temp = []
                querySnapshot.forEach((doc) =>{
                    temp.push(doc.data())
                });
                setRequests(temp);
            })
        }
        fetchingData();
    }, [])

    return (
        //List of all requests
        <div className="reqlist">
            <h2>Requests:</h2>
            {requests.map((req) => (
                <Request
                    reqInfo = {req}
                    handleDecision = {handleDecision}
                />
            ))}
        </div>
    )
}

export default RequestList
