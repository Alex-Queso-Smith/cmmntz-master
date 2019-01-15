import React from 'react';

const UserThemeSelector = props => {
  return(
    <div className="user-theme-selector">

      <div id="cf-theme-selector-options-wrapper">
        <div id="cf-theme-selector-options-left">
          <label className="cf-text-medium">
            Select Theme:
            <br />
            <br />
            <select name="colorTheme" value={props.colorTheme} onChange={props.onChange}>
              <option value="cf-light">Light</option>
              <option value="cf-dark">Dark</option>
            </select>
          </label>
        </div>

        <div id="cf-theme-selector-options-right">
          <label className="cf-text-medium">
          Select Font:
          <br />
          <br />
          <select name="font" value={props.font} onChange={props.onChange}>
            <option value="serif" className="cf-serif">Serif</option>
            <option value="sans-serif" className="cf-sans-serif">Sans-Serif</option>
          </select>
          </label>
        </div>
      </div>

      <br />
      <div id="cf-theme-selector-demo-wrapper" className={`cf-bordered ${props.colorTheme} ${props.font}`}>
        <div className="cf-bordered">
          AaBbCc
        </div>
      </div>
    </div>
  );
};

export default UserThemeSelector;
