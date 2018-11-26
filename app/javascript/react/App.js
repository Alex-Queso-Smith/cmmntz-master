import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';

import UserNewFormContainer from './containers/users/UserNewFormContainer';
import UserEditFormContainer from './containers/users/UserEditFormContainer';
import UserPasswordFormContainer from './containers/users/UserPasswordFormContainer';
import SessionLoginContainer from './containers/sessions/SessionLoginContainer';
import UserEditSettingsContainer from './containers/users/UserEditSettingsContainer';

class App extends React.Component {

  render(){

    return (
      <Router>
        <div>
          <Route path='/register' component={UserNewFormContainer} />
          <Route path='/users/:id/edit' component={UserEditFormContainer} />
          <Route path='/users/:id/edit_password' component={UserPasswordFormContainer} />
          <Route path='/users/:id/edit_settings' component={UserEditSettingsContainer} />
          <Route path='/login' component={SessionLoginContainer} />
        </div>
      </Router>
    )
  }
}

export default App
