import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';

import UserNewContainer from './containers/users/UserNewContainer';
import UserPasswordFormContainer from './containers/users/UserPasswordFormContainer';
import SessionLoginContainer from './containers/sessions/SessionLoginContainer';
import UserEditContainer from './containers/users/UserEditContainer';

class App extends React.Component {

  render(){

    return (
      <Router>
        <div>
          <Route path='/register' component={UserNewContainer} />
          <Route path='/users/:id/edit_password' component={UserPasswordFormContainer} />
          <Route path='/users/:id/edit_settings' component={UserEditContainer} />
          <Route path='/login' component={SessionLoginContainer} />
        </div>
      </Router>
    )
  }
}

export default App
