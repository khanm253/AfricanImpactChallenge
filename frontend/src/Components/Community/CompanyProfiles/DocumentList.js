import React from 'react'
import Document from './Document';
import { useFirebase } from "../../Utils/Firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import '../../../Styles/DocumentList.css'

function DocumentList({creatorId, members}) {
    const userID = JSON.parse(localStorage.user).userID;

    // This hook will re-render the componenet everytime the "user" collection changes on firebase.
    const firebase = useFirebase();
    const db = firebase.firestore();
    const [documents, loading] = useCollectionData(db.collection('files').where('uploaderId', 'in', members));

    function handleDelete(fileId) {
        function deletePost() {
            // Call fire base to delete the file
            db.collection('files').doc(fileId).delete()
            .then(
                // on successful change
                (val) => {
                    console.log('Delete File Succesful!', val);
                },
                // on non-sucessful change
                (err) => {
                    console.log('Error, File could not delete!', err);
                }
            );
        }
        return deletePost

    }

    return (
        <div>
            <h2>Company Documents</h2>

            <div className="documentlist">
                
                {!loading ?
                    documents.map( (doc,index) => 
                        <Document 
                            key={index} 
                            name={doc.name} 
                            url={doc.url} 
                            uploaderId={doc.uploaderId} 
                            creatorId={creatorId} 
                            deleteCallBack={handleDelete(doc.fileId)} 
                        />
                    )
                :
                    <></>
                }
                
            </div>

        </div>
    )
}

export default DocumentList
