import { Switch, Route, Link, useHistory, useRouteMatch } from 'react-router-dom';

import { useAuth } from '../Utils/Auth';
import Community from '../Community/Community';
import Elearning from '../ELearning/ELearning';
import Admin from '../Admin/Admin';
import UserPreferences from '../UserPreferences';
import Card from '../Utils/Card';
import Navbar from '../Utils/Navbar';
import '../../Styles/Home.css';


function Home() {
  let user = JSON.parse(localStorage.user);
  let auth = useAuth();
  let history = useHistory();
  let { path } = useRouteMatch();

  return (
    <>
    <Navbar />
    <Switch>
      <Route exact path={path}>
      <div className="home__page">
          <div className="selectionPage">
            <Card
              imgSrc="https://www.elegantthemes.com/blog/wp-content/uploads/2020/06/Divi-Community-Update-May-2020-scaled.jpg"
              title="Community"
              description="Interact with other rising entrepreneurs"
              linkPath={`${path}/community`}
              buttonText="Go to Community"
            />
            <Card
              imgSrc="https://themefisher.com/wp-content/uploads/2019/05/E-learning.jpg"
              title="E-Learning"
              description="Learn to expand your businesses"
              linkPath={`${path}/e-learning`}
              buttonText="Go to E-Learning"
            />
            {
              // Render Admin setting only for admins.
              user.role === "admin" ?
                <Card
                  imgSrc="https://bryanu.edu/wp-content/uploads/2019/08/Multitasking.jpg"
                  title="Admin Settings"
                  description="Adjust privileges for your users."
                  linkPath={`${path}/admin`}
                  buttonText="Go to Admin Settings"
                />
                :
                <></>
            }
          </div>
          
        </div>
      </Route>

      <Route path={`${path}/community`}>
        <Community />
      </Route>

      <Route path={`${path}/e-learning`}>
        <Elearning />
      </Route>

      <Route path={`${path}/admin`}>
        <Admin />
      </Route>

      <Route path={`${path}/user-preferences`}>
        <UserPreferences />
      </Route>

    </Switch>
    </>
  );
}
export default Home;
