import React, { useState, useEffect } from "react";
import { useCollectionDataOnce, useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { useParams, Link, useRouteMatch } from 'react-router-dom';
import { useFirebase } from '../../Utils/Firebase';

//Rows styling template: https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/dashboard/Orders.js

function Submissions(props) {
  let { courseId, assId } = useParams();
  let { url } = useRouteMatch();
  let firebase = useFirebase();
  let db = firebase.firestore();

  const [values, loading, error] = useCollectionDataOnce(db.collection("submissions").where('assignId', '==', assId));
  const [ass, l, e] = useDocumentDataOnce(db.doc(`assignments/${assId}`));
  let [userValues, setUserValues] = useState([]);

  useEffect(() => {
    if (values && values.length !== 0) {
      let user_list = values.map(e => e.userId);
      db.collection('users').where('uid', 'in', user_list)
        .get()
        .then((querySnapshot) => {
          let tem = [];
          querySnapshot.forEach((doc) => {
            tem.push(doc.data());
          });
          setUserValues(tem);
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }
  }, [values])

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  if (l) return <p>Loading...</p>;
  if (e) return <p>Error :(</p>;

  return (
    <div className="column is-10">
      <h1 className="is-size-4 has-text-left has-text-weight-medium">Submissions for {ass.title}</h1>
      <table class="table  is-fullwidth is-hoverable">
        <thead>
          <tr>
            <th>Student id</th>
            <th>Student Username</th>
            <th>submission time</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {values.map((sub) => {
            if (userValues.length > 0) {
              return (
                <tr key={sub.submissionId}>
                  <td>{sub.userId}</td>
                  <td>{userValues.find(e => e.uid === sub.userId).username}</td>
                  <td>{sub.createdAt}</td>
                  <td><Link className="navbar-item button is-primary is-small" to={`${url.replace('submissions', 'gradesubmission')}/${sub.submissionId}`}>Grade Submission</Link></td>
                </tr>
              )
            }
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Submissions;
