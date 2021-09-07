import React, { useState, useEffect } from "react";
import { useCollectionDataOnce, useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { useParams, Link, useRouteMatch } from 'react-router-dom';
import { useFirebase } from '../../Utils/Firebase';

//Rows styling template: https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/dashboard/Orders.js

function GradesSummary(props) {
    let user = JSON.parse(localStorage.getItem("user"));
    let { courseId, assId } = useParams();
    let { url } = useRouteMatch();
    let firebase = useFirebase();
    let db = firebase.firestore();
    const [ass, l, e] = useDocumentDataOnce(db.doc(`assignments/${assId}`));
    const [values, loading, error] = useCollectionDataOnce(db.collection("submissions").where('assignId', '==', assId));

    let [userValues, setUserValues] = useState([]);
    let [stats, setStats] = useState({});

    useEffect(() => {
        if (values && values.length > 0) {
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

    useEffect(() => {
        if (values && values.length > 0) {
            
            let a = values.reduce((acc, cur) => cur.grade ? {grade: parseInt(acc.grade) + parseInt(cur.grade), total: (acc.total || 1) + 1 } : {grade: acc.grade, total: acc.total })
            let b = values.reduce((acc, cur) => acc[cur.grade] ? {...acc, [cur.grade]: acc[cur.grade] + 1 } : {...acc, [cur.grade]: 1 }, {} )
            let c = Math.max(...Object.values(b));
            let res = {
                average: a.grade/a.total,
                median: parseInt(Object.entries(b).find(([key, val]) => val === c)[0]),
                total: values.length,
                graded_total: values.filter(e => e.grade).length
            };
            setStats(res);
        }
    }, [values])


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    if (l) return <p>Loading...</p>;
    if (e) return <p>Error :(</p>;

    function generateInsMarkup() {
        return (
            <div className="column is-full">
                <table class="table is-fullwidth is-hoverable">
                    <thead>
                        <tr>
                            <th>Student Username</th>
                            <th>submission time</th>
                            <th>Grade</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {values.map((sub) => {
                            if (userValues.length > 0) {
                                return (
                                    <tr key={sub.submissionId}>
                                        <td>{userValues.find(e => e.uid === sub.userId).username}</td>
                                        <td>{sub.createdAt}</td>
                                        <td>{sub.grade}</td>
                                        <td><Link className="navbar-item button is-primary is-small" to={`${url.replace('gradessummary', 'gradesubmission')}/${sub.submissionId}`}>Update Grade</Link></td>
                                    </tr>
                                )
                            }
                        })}
                    </tbody>
                </table>
            </div>
        )
    }

    

    return (
        <div className="column is-10 ">
                <h1 className="is-size-4 has-text-left has-text-weight-medium">Grades Summary for {ass.title}</h1>
                <div class="field is-horizontal has-text-left">
                    <div class="field-body">
                        <div class="field box">
                            <label class="label">Average Grade</label>
                            <div class="control">
                                <input class="input is-static" type="text" value={stats.average} />
                            </div>
                        </div>

                        <div class="field box">
                            <label class="label">Median Grade</label>
                            <div class="control">
                                <input class="input is-static" type="text" value={stats.median} />
                            </div>
                        </div>
                        <div class="field box">
                            <label class="label">Total Submitted</label>
                            <div class="control">
                                <input class="input is-static" type="text" value={stats.total} />
                            </div>
                        </div>
                        <div class="field box">
                            <label class="label">Total Graded</label>
                            <div class="control">
                                <input class="input is-static" type="text" value={stats.graded_total} />
                            </div>
                        </div>
                    </div>
                </div>
            {user.role === 'instructor' ?
                generateInsMarkup() : <div>this poage is not for you</div>
            }
        </div>
    )

}

export default GradesSummary;
