import React from 'react';

const AgeRangeSelector = props => {

  const ageRanges =[["", "None of your business!"], [15, "15-19"], [20, "20-24"], [25, "25-29"], [30, "30-34"], [35, "35-39"], [40, "40-44"], [45, "45-49"], [50, "50-54"], [55, "55-59"], [60, "60+"]]

  var ages = ageRanges.map((age) => {
    return(
      <option key={age[0]} value={`${age[0]}`}>{age[1]}</option>
    )
  })

  return(
    <div className="form-group">
      <label className="text-medium" htmlFor={props.name}>
        Select Age Range:
        <br />
        <br />
        <select name={props.name} value={props.content} onChange={props.onChange}>
          {ages}
        </select>
      </label>
    </div>
  );
};

export default AgeRangeSelector;
