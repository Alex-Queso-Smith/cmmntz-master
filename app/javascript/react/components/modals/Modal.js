import React from 'react'

const Modal = props => {
  var actionButton;

  if (props.actionButton) {
    actionButton =
    <div className="">
      <button className="btn btn-med btn-primary" name="warn" onClick={props.actionButton}>
        Flag Comment
      </button>
    </div>
  }

  return (
    <div className="cf-modal">
      <section className="cf-modal-main">
        <img src="/assets/interface/modal/modal-close.png" onClick={props.handleClose} className="cf-modal-close" />
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
