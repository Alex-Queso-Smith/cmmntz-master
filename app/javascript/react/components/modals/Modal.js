import React from 'react'

const Modal = props => {
  return (
    <div className="cf-modal">
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
