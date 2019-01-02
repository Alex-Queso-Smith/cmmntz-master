import React from 'react';

const LineItem = (props) => {
  var active;
  if (props.value === props.display) { active = "active" }

  return(
    <li className="nav-item cursor-pointer">
      <a data-value={props.value} className={`nav-link ${active}`} onClick={props.onClick}>{props.title}</a>
    </li>
  )
}

const Tabs = (props) => {
  const types = [
    ["Account", ""],
    ["Looks", "looks"],
    ["Demographics", "demographics"],
    ["Search Settings", "settings"]
  ]

  var links = types.map(type => {
    return(
      <LineItem
        key={type[1]}
        value={type[1]}
        title={type[0]}
        display={props.display}
        onClick={props.onClick}
      />
    )
  })

  return(
    <div className="cf-manage-comments-tabs">
      <ul className="nav nav-tabs">
        {links}
      </ul>
    </div>
  )
}


export default Tabs;