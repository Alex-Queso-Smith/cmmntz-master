import React from 'react'

const Modal = props => {

  return (
    <div className="cf-modal">
      <section className="cf-modal-main">
        <div className="cf-modal-close cf-sans-serif" onClick={props.handleClose} >&times;</div>
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
