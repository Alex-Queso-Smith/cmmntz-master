import React from 'react'

const Modal = props => {

  return (
    <div className="cf-modal">
      <section className={`cf-modal-main cf-modal-main-${props.className}`}>
        <div className="cf-modal-close" onClick={props.handleClose} >&times;</div>
          <h3>{props.modalTitle}</h3>
        <div className="cf-modal-contents">
          {props.children}
        </div>
      </section>
    </div>
  );
};

export default Modal
