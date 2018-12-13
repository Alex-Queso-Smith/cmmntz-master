import React from 'react';
import BasicModal from './BasicModal';

export const BanUser = props => {
  return (
    <BasicModal
      modalButtonText="Ban User"
      modalTitle={"Ban this User?"}
      modalButtonClass={"red-outline-button margin-all-5px"}
    >
    If you wish to Ban this User please click Ban User button !
    <div className="">
      <button className="btn btn-sm red-outline-button margin-all-5px" onClick={props.banAction}>
        Ban User
      </button>
    </div>
    </BasicModal>
  )

}

export default BanUser
