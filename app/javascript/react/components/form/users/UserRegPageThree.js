import React from 'react';

const UserRegPageThree = props => {
  return(
    <div id="reg-optional-2" className="form-group ">
      <h3 className="text-center">Sign-Up Optional Information 2/2 </h3>

      <hr />

      <div className="form-group margin-top-10px">
        <label className="text-large" htmlFor="avatar">Avatar</label>
        <br />
        Coming Soon
      </div>
      <input type="hidden"/>
      <div className="form-group actions margin-top-10px">
        <button id="user-registration-button-back-three" className="btn btn-block btn-large btn-dark" onClick={props.handleBackClick}>
          <span className="text-large">Back</span>
        </button>
      </div>
    </div>
  );
};

export default UserRegPageThree;
