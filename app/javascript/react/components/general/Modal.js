import React from 'react'

const Modal = props => {
  var showHideClassName = props.show ? "cf-modal cf-display-block" : "cf-modal cf-display-none";

  return (
    <div className={showHideClassName}>
      <section className="cf-modal-main">
        <img src="/assets/interface/modal/modal-close.png" onClick={props.handleClose} className="cf-modal-close" />
        <h3>{props.modalTitle}</h3>
        <hr />
        <div className="cf-modal-contents">
          {props.children}
        </div>
      </section>
    </div>
  );
};

export default Modal
