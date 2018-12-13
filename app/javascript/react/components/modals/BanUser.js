import React from 'react';
import BasicModal from './BasicModal';

export const BanUser = props => {
  return (
    <BasicModal
      modalButtonText="Ban User"
      modalTitle={"Ban this User?"}
      modalButtonClass={"red-outline-button margin-all-5px"}
    >
    Ban This User &nbsp;&nbsp;&nbsp;
    <select>
      <option value="">Forever</option>
      <option value="day">For 1 day</option>
      <option value="week">For 1 Week</option>
      <option value="month">For 1 Month</option>
      <option value="year">For 1 Year</option>
    </select>
    &nbsp;&nbsp;&nbsp;
    <button className="btn btn-sm red-outline-button margin-all-5px" onClick={props.banAction}>
      Ban User
    </button>
    </BasicModal>
  )

}

export default BanUser
