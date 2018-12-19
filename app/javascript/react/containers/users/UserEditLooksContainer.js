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

      if (this._isMounted) {
        this.setState({
          font: user.font,
          colorTheme: user.color_theme
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
      <div id="user-edit-looks-container">
        <form className="form" id="user-edit-looks-form" onSubmit={this.handleSubmit}>
          <UserThemeSelector
            onChange={this.handleChange}
            font={font}
            colorTheme={colorTheme}
            />

          <div className="form-group actions margin-top-10px">
            <button id="user-edit-looks-button" type="submit" className="btn btn-block btn-large btn-dark" value="Submit">
              <span className="text-medium">Update</span>
            </button>
          </div>
        </form>
      </div>
    )
  }
}

export default UserEditLooksContainer;
