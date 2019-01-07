import React from 'react'

const Modal = props => {

  var title;
  if (!props.cancelTitle) {
    title =
    <div>
      <h3>{props.modalTitle}</h3>
      <hr />
    </div>
  }

  return (
    <div className="cf-modal">
      <section className="cf-modal-main">
        <div className="cf-modal-close sans-serif" onClick={props.handleClose} >&times;</div>
        {title}
        <div className="cf-modal-contents">
          {props.children}
        </div>
      </section>
    </div>
  );
};

export default Modal
