import React from 'react';

export const ConfirmCancelModal = (props) => {

  return(
    <div className="cf-modal">
      <section className={`cf-modal-main cf-modal-main-${props.className}`}>
        <div className="cf-modal-close" onClick={props.closeAction} >&times;</div>
        <div className="cf-modal-contents">
          <h3>{props.modalTitle}</h3>
          {props.children}
          <div className="cf-margin-top-10px">
            <button className="cf-float-right btn btn-dark btn-sm cf-margin-right-10px" name={props.name} onClick={props.confirmAction}>
              {props.confirmText}
            </button>
            <button className="cf-float-left btn btn-dark btn-sm cf-margin-right-10px" onClick={props.closeAction}>
              Cancel
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
