import React from 'react'

const Modal = props => {

  var button = <button onClick={props.handleClose} className="btn btn-dark btn-sm cf-float-right cf-modal-ok-button">Ok</button>

  if (props.hideButton) {
    button = <div />;
  }

  return (
    <div className="cf-modal">
      <section className={`cf-modal-main cf-modal-${props.className}`}>
        <div className="cf-modal-close" onClick={props.handleClose} >&times;</div>
          <h3>{props.modalTitle}</h3>
        <div className="cf-modal-contents cf-text-center">
          {props.children}
        </div>
        {button}
      </section>
    </div>
  );
};

export default Modal
