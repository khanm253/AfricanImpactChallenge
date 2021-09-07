import React, { useState, useEffect } from "react";
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import { useParams, Link, useRouteMatch } from 'react-router-dom';
import { useFirebase } from '../../Utils/Firebase';


//Rows styling template: https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/dashboard/Orders.js

function Assignments(props) {
  let { courseId } = useParams();
  let { url } = useRouteMatch();

  let user = JSON.parse(localStorage.getItem("user"));
  let [curAss, setAss] = useState([]);
  let firebase = useFirebase();
  let db = firebase.firestore();
  const [values, loading, error] = useCollectionDataOnce(db.collection("assignments").where('courseId', '==', courseId));
  const [usubs, l, e] = useCollectionDataOnce(db.collection("submissions").where('userId', '==', user.userID));


  useEffect(() => {
    if (values) {
      values.forEach((assignment) => {
        let newAssignment = {};
        newAssignment.title = assignment.title;

        let test = Date.parse(assignment.duedate);
        let date = new Date(test * 1000);

        let dueDate = (date.getDate() +
          "/" + (date.getMonth() + 1));
        newAssignment.duedate = dueDate;


        setAss(oldArray => [...oldArray, newAssignment]);
      })
    }
  }, [values]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  if (l) return <p>Loading...</p>;
  if (e) return <p>Error :(</p>;

    function graded(ass){
      let a = usubs.find(e => e.assignId === ass.assignmentId);
      console.log(usubs);
      console.log(ass);
      if (a && a.grade) {
        return true;
      } else {
        return false
      }
    }

    function submitted(ass){
      return usubs.some(e => e.assignId === ass.assignmentId);
    }

  function generateMarkup(markupArray) {
    return (
      <table class="table is-fullwidth is-hoverable">
        <thead>
          <tr>
            <th>Assignment</th>
            <th>Deadline</th>
            <th>Grading</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {values.map((ass) => {
            return (
              <tr key={ass.assignmentId}>
                <td>{ass.title}</td>
                <td>{ass.duedate}</td>
                <td>{ submitted(ass) ? ( graded(ass) ? <span>Completed</span> : <span>Pending</span>) : <span>Not Submitted</span>}</td>
                <td>{submitted(ass) && graded(ass) ? 
                      <Link className="navbar-item button is-primary is-small" to={`${url}/${ass.assignmentId}/gradesubmission/${ass.assignmentId}_${user.userID}`}>View Grade</Link>
                      : <button class="button" title="Disabled button" disabled>View Grade</button>}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }

  function generateInsMarkup() {
    return (
      <table class="table is-fullwidth is-hoverable">
        <thead>
          <tr>
            <th>Assignment</th>
            <th>Deadline</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {values.map((ass) => {
            return (
              <tr key={ass.assignmentId}>
                <td>{ass.title}</td>
                <td>{ass.duedate}</td>
                <td><Link className="navbar-item button is-primary is-small" to={`${url}/${ass.assignmentId}/submissions`}>View Submissions</Link></td>
                <td><Link className="navbar-item button is-primary is-small" to={`${url}/${ass.assignmentId}/gradessummary`}>Grades Summary</Link></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }

  return (
    <div className="column is-10">
      {user.role === 'instructor' ?
        generateInsMarkup() : generateMarkup(curAss)
      }
      <Link className="App-link" to={'/home/e-learning/' + courseId}>Back to Course Homepage</Link>
    </div>
  )
}

export default Assignments;
