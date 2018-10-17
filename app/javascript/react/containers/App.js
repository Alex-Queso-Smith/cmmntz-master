import React from 'react';

import { Route, BrowserRouter as Router, Link } from 'react-router-dom';

import UserNewFormContainer from './users/UserNewFormContainer';
import UserEditFormContainer from './users/UserEditFormContainer';
import SessionLoginContainer from './sessions/SessionLoginContainer';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }
  render(){
    return (
      <Router history={history}>
        <div>
          <Route path='/register' component={UserNewFormContainer} />
          <Route path='/users/:id/edit' component={UserEditFormContainer} />
          <Route path='/login' component={SessionLoginContainer} />
        </div>
      </Router>
    )
  }
}

export default App
