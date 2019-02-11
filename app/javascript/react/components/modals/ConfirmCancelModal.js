import React from 'react';

export const ConfirmCancelModal = (props) => {
  var contentStyle = {
    marginTop: "20px"
  }
  return(
    <div className="cf-modal-container">
      <section className={`cf-modal-main cf-modal-${props.className}`}>
        <div className="cf-modal-close" onClick={props.closeAction} >&times;</div>
        <h3 className="cf-text-center cf-margin-bottom-10px">{props.modalTitle}</h3>
        <div style={contentStyle} className="cf-modal-contents">
          {props.children}
          <div className="cf-margin-top-10px">
            <button className="cf-float-right btn cf-dark-button btn-sm cf-margin-right-10px" name={props.name} onClick={props.confirmAction}>
              {props.confirmText}
            </button>
            <button className="cf-float-left btn cf-dark-button btn-sm cf-margin-right-10px" onClick={props.closeAction}>
              Cancel
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
