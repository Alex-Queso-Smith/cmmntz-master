import React from 'react';

import { Route, BrowserRouter as Router } from 'react-router-dom';

import UserNewFormContainer from './UserNewFormContainer';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }
  render(){
    return (
      <Router >
        <Route path='/users/new' component={UserNewFormContainer} />
      </Router>
    )
  }
}

export default App
