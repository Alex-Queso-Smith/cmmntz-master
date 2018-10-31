import React from 'react';

const UserThemeSelector = props => {
  return(
    <div className="user-theme-selector">
      <label className="text-medium">
        Select Theme:
        <br />
        <br />
        <select name={props.name} value={props.colorTheme} onChange={props.onChange}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>

      <label className="text-medium">
        Select Font:
        <br />
        <br />
        <select name={props.name} value={props.font} onChange={props.onChange}>
          <option value="serif">Serif</option>
          <option value="sans-serif">Sans-Serif</option>
        </select>
      </label>

      <div id="theme-selector-demo" className={`${props.colorTheme} ${props.font}`}>
        {props.font}||{props.colorTheme}
      </div>
    </div>
  );
};

export default UserThemeSelector;
