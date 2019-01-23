import React from 'react'

class Modal extends React.Component {
  state = {}

  render(){
    var button = <button onClick={this.props.handleClose} className="btn btn-dark btn-sm cf-float-right cf-modal-ok-button">Ok</button>

    if (this.props.hideButton) {
      button = <div />;
    }

    return (
      <div className="cf-modal-container">
        <section className={`cf-modal-main cf-modal-${this.props.className}`}>
          <div className="cf-modal-close" onClick={this.props.handleClose} >&times;</div>
          <h3>{this.props.modalTitle}</h3>
          <div className="cf-modal-contents cf-text-center">
            {this.props.children}
          </div>
          {button}
        </section>
      </div>
    )
  }
};

export default Modal
