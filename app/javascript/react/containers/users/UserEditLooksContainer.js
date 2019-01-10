import React from 'react';

import UserThemeSelector from '../../components/form/UserThemeSelector';
import { FetchDidMount, FetchWithPush } from '../../util/CoreUtil';

class UserEditLooksContainer extends React.Component {
  state = {
    font: '',
    colorTheme: '',
    saveErrors: {}
  }

  _isMounted = false;
  handleChange = this.handleChange.bind(this);
  handleSubmit = this.handleSubmit.bind(this);

  componentDidMount(){
    this._isMounted = true;

    FetchDidMount(this, `/api/v1/users/${this.props.userId}.json`)
    .then(body => {

      var user = body.user

      var userFont = user.font.replace("cf-", '')
      var userTheme = user.color_theme.replace("cf-", '')
      if (this._isMounted) {
        this.setState({
          font: userFont,
          colorTheme: userTheme
        })
      }
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  handleChange(event){
    event.preventDefault();
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({ [name]: value })
  }

  handleSubmit(event){
    event.preventDefault();

    var { font, colorTheme } = this.state;

    var user = new FormData();
    user.append("user[font]", font);
    user.append("user[color_theme]", colorTheme);

    FetchWithPush(this, `/api/v1/users/${this.props.userId}.json`, '', 'PATCH', 'saveErrors', user)
    .then(body => {
      if (!body.errors) {
        this.setState({ saveErrors: {} })
        alert(`${body.message}`)
      }
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));

  }

  render(){
    var { font, colorTheme } = this.state;

    return(
      <div id="cf-user-edit-looks-container">
        <form className="form" id="cf-user-edit-looks-form" onSubmit={this.handleSubmit}>
          <UserThemeSelector
            onChange={this.handleChange}
            font={font}
            colorTheme={colorTheme}
            />

          <div className="form-group actions">
            <button id="cf-user-edit-looks-button" type="submit" className="btn btn-sm btn-dark cf-float-right cf-margin-top-10px" value="Submit">
              Update
            </button>
            <button className="btn btn-sm btn-dark cf-float-left cf-margin-top-10px" onClick={ this.props.updateDisplay }>
              Back
            </button>
          </div>
        </form>
      </div>
    )
  }
}

export default UserEditLooksContainer;
