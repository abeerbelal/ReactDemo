import { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import UserProfile from './components/Profile/UserProfile';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import AuthContext from './store/auth-context';

function App() {
  const authCtx = useContext(AuthContext);
  return (
    <Layout>
      <Switch>
        <Route path='/' exact>
          <HomePage />
        </Route>
       {!authCtx.isLoggedIn && 
       (<Route path='/auth'>
          <AuthPage />
        </Route>
        )}

        <Route path='/profile'>
        {authCtx.isLoggedIn && (<UserProfile />)}
        {!authCtx.isLoggedIn &&  <Redirect to='/auth' />}
        </Route>

        <Route path='*'>
          <Redirect to='/' />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
//  <Route path='*'> when the user enter somthing invalid 
//or is the user tapp /profile whitout logged in 

//        {!authCtx.isLoggedIn &&  <Redirect to='/auth' />}
 //here if we not logged in and entered /profile in url this will open /auth page 
