import React from 'react'

const Modal = props => {
  var actionButton;

  if (props.actionButton) {
    actionButton =
    <div className="">
      <button className="btn btn-med btn-dark" name="warn" onClick={props.actionButton}>
        Flag Comment
      </button>
    </div>
  }

  return (
    <div className="cf-modal">
      <section className="cf-modal-main">
        <div className="cf-modal-close sans-serif" onClick={props.handleClose} >&times;</div>
        <h3>{props.modalTitle}</h3>
        <hr />
        <div className="cf-modal-contents">
          {props.children}
          {actionButton}
        </div>
      </section>
    </div>
  );
};

export default Modal
