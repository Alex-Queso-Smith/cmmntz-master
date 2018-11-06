import React from 'react';

const UserThemeSelector = props => {
  return(
    <div className="user-theme-selector">
      <label className="text-large">Theme</label>
      <br />

      <div id="theme-selector-options-wrapper">
        <div id="theme-selector-options-left">
          <label className="text-medium">
          Select Color:
          <br />
          <br />
          <select name="colorTheme" value={props.colorTheme} onChange={props.onChange}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        </div>

        <div id="theme-selector-options-right">
          <label className="text-medium">
          Select Font:
          <br />
          <br />
          <select name="font" value={props.font} onChange={props.onChange}>
            <option value="serif" className="serif">Serif</option>
            <option value="sans-serif" className="sand-serif">Sans-Serif</option>
          </select>
          </label>
        </div>
      </div>

      <br />
      <div id="theme-selector-demo-wrapper" className={`bordered ${props.colorTheme} ${props.font}`}>
        <div className="bordered">
          AaBbCc
        </div>
      </div>
    </div>
  );
};

export default UserThemeSelector;