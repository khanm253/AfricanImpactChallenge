import React, { useState, useEffect } from "react";
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useParams, Link, useRouteMatch } from 'react-router-dom';
import { useFirebase } from '../../Utils/Firebase';

//Rows styling template: https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/dashboard/Orders.js

function GradeSubmission(props) {
    let { courseId, assId, subId } = useParams();
    let user = JSON.parse(localStorage.getItem("user"));
    let firebase = useFirebase();
    let db = firebase.firestore();
    let [formData, setFormData] = useState({ grade: '', comments: '' });

    const [values, loading, error] = useCollectionData(db.collection("submissions").where('submissionId', '==', subId));

    let handleChange = (e) => {
        setFormData((old) => {
            return ({
                ...old,
                [e.target.name]: e.target.value
            })
        });
    }

    let handleSubmit = async (e) => {
        e.preventDefault();
        await firebase.firestore().collection('submissions').doc(subId).set({
            grade: formData.grade || values[0].grade,
            comments: formData.comments || values[0].comments
        }, { merge: true })
        setFormData({ grade: '', comments: '' });
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <div className="column is-10" style={{ height: '100vh' }}>
            <div className="columns" style={{ height: '100vh' }}>

                <div className="column is-9" style={{ height: '95vh' }}>
                    <iframe className="" src={values[0].url} frameborder="1" style={{ width: '100%', height: '100%', border: '1px solid black' }}></iframe>
                </div>
                <div className="column is-3">
                    <table class="table is-fullwidth">
                        <tbody>
                            <tr>
                                <th>Submission Time</th>
                                <td>{values[0].createdAt}</td>
                            </tr>
                            <tr>
                                <th>Grade</th>
                                <td>{values[0].grade}</td>
                            </tr>
                            <tr>
                                <th>Feedback</th>
                                <td>{values[0].comments}</td>
                            </tr>

                        </tbody>
                    </table>

                    {user.role === 'instructor' ?
                        <>
                            <h1>Update Grades</h1>
                            <form onSubmit={handleSubmit}>
                                <div class="field">
                                    <div class="control has-icons-left">
                                        <input class="input" type="text" name="grade" value={formData.grade} onChange={handleChange} placeholder="New Grade" required />
                                        <span class="icon is-left">
                                            <i class="fas fa-calculator" />
                                        </span>
                                    </div>
                                </div>
                                <div class="field">
                                    <div class="control has-icons-right">
                                        <textarea class="textarea" name="comments" value={formData.comments} onChange={handleChange} placeholder="Enter Feedback" />
                                        <span class="icon is-right">
                                            <i class="fas fa-envelope" />
                                        </span>
                                    </div>
                                </div>
                                <div class="control">
                                    <button class="button is-primary">Submit</button>
                                </div>
                            </form>
                        </> : true
                    }
                </div>
            </div>
        </div>
    )
}

export default GradeSubmission;
