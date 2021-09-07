import React, { useState, useEffect } from "react";
import { useFirebase } from '../Utils/Firebase';
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import { Switch, Route, useRouteMatch, Link, useParams, useLocation } from 'react-router-dom';

import Modules from './CoursePages/Modules';
import Assignments from './CoursePages/Assignments';
import People from './CoursePages/People';
import CreateAssignment from './CoursePages/CreateAssignment';
import Submissions from './CoursePages/Submissions';
import GradeSubmission from './CoursePages/GradeSubmission';
import CreateLesson from './CoursePages/CreateLesson';
import CreateModule from './CoursePages/CreateModule';
import GradesSummary from './CoursePages/GradesSummary';

function Course(props) {
    //https://material-ui.com/components/drawers/ Template for drawer component
    let { courseId } = useParams();
    let { path, url } = useRouteMatch();
    const drawerWidth = 240;

    let user = JSON.parse(localStorage.getItem("user"));

    let firebase = useFirebase();
    let db = firebase.firestore();
    const [values, loading, error] = useCollectionDataOnce(db.collection("courses").where('courseId', '==', courseId));

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <div className="container">
            <div className="columns">
                <div className="column is-2 has-text-left">
                    <aside className="menu is-hidden-mobile">
                        <ul className="menu-list">

                            <li><a><Link to={`${url}/modules`}>Modules</Link></a></li>
                            <li><a><Link to={`${url}/assignments`}>Assignments</Link></a></li>
                            <li><a><Link to={`${url}/people`}>People</Link></a></li>
                        </ul>
                        {user.role === 'instructor' ?
                            <>
                                <p className="menu-label">Instructor</p>
                                <ul className="menu-list">
                                    <li><a><Link to={`${url}/create-assignment`}>Create New Assignment</Link></a></li>
                                    <li><a><Link to={`${url}/create-lesson`}>Create New Lesson</Link></a></li>
                                    <li><a><Link to={`${url}/create-module`}>Create Module</Link></a></li>
                                </ul>
                            </>
                            : true
                        }

                    </aside>
                </div>

                <Switch>
                    <Route exact path={path}>
                        <div className="column is-10 has-text-centered">
                            <p>Welcome to {values[0].title}</p>
                        </div>
                    </Route>
                    <Route path={`${path}/modules`}>
                        <Modules />
                    </Route>
                    <Route path={`${path}/people`}>
                        <People />
                    </Route>
                    <Route path={`${path}/assignments/:assId/gradesubmission/:subId`}>
                        <GradeSubmission />
                    </Route>
                    <Route path={`${path}/assignments/:assId/submissions`}>
                        <Submissions />
                    </Route>
                    <Route path={`${path}/assignments/:assId/gradessummary`}>
                        <GradesSummary />
                    </Route>
                    <Route path={`${path}/assignments`}>
                        <Assignments />
                    </Route>
                    <Route path={`${path}/create-assignment`}>
                        <CreateAssignment />
                    </Route>
                    <Route path={`${path}/create-lesson`}>
                        <CreateLesson />
                    </Route>
                    <Route path={`${path}/create-module`}>
                        <CreateModule />
                    </Route>
                </Switch>
            </div>
        </div>

    )
}

export default Course;
