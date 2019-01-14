import React from 'react';

export const ConfirmCancelModal = (props) => {

  return(
    <div className="cf-modal">
      <section className="cf-modal-main">
        <div className="cf-modal-close sans-serif" onClick={props.closeAction} >&times;</div>
          <h3>{props.modalTitle}</h3>
          <hr />
        <div className="cf-modal-contents">
          {props.children}
          <div className="margin-top-10px">
            <button className="float-right btn btn-dark btn-sm margin-right-10px" name={props.name} onClick={props.confirmAction}>
              Ok
            </button>
            <button className="float-right btn btn-dark btn-sm margin-right-10px" onClick={props.closeAction}>
              Cancel
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
