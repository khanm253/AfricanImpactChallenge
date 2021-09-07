import React from "react";
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
import { Switch, Route, useRouteMatch, Link } from 'react-router-dom';

import { useFirebase } from '../Utils/Firebase';
import Course from './Course';
import CreateCourse from './CreateCourse';
import Card from '../Utils/Card';

function Elearning() {
  let user = JSON.parse(localStorage.getItem("user"));
  let { path } = useRouteMatch();

  let firebase = useFirebase();
  let db = firebase.firestore();

  const [data, loading, error] = useCollectionDataOnce(
    user.role === 'instructor' ? db.collection("courses") :
      db.collection("courses").where('students', 'array-contains', `${user.userID}`)
  );

  return (
    <Switch>
      <Route exact path={path}>
        <div className="home__page">
          {user.role === 'instructor' ? <Link to={`${path}/create-course`}>creates new course</Link> : <></>}

          {loading ? <p>Loading...</p> : (
            error ? <p>{console.log(error)}Error...</p> :
              <div>
                {data.length < 1 ? <h1>You are not enrolled in any courses</h1> :
                  <div className="selectionPage">
                    {data.map(course => {
                      return (
                        <Card
                          imgSrc="https://www.elegantthemes.com/blog/wp-content/uploads/2020/06/Divi-Community-Update-May-2020-scaled.jpg"
                          key={course.courseId}
                          title={course.title}
                          description={course.description}
                          linkPath={`${path}/${course.courseId}`}
                          buttonText="Go to course"
                        />
                      )
                    })
                    }
                  </div>
                }
              </div>
          )}
        </div>
      </Route>
      <Route path={`${path}/create-course`}>
        <CreateCourse />
      </Route>
      <Route path={`${path}/:courseId`}>
        <Course />
      </Route>
    </Switch>
  )
}

export default Elearning
