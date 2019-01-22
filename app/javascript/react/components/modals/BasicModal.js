import React from 'react';
import Modal from './Modal'

class BasicModal extends React.Component {
  state = { show: false }

  showModal = this.showModal.bind(this);
  hideModal = this.hideModal.bind(this)

  showModal(event){
    event.preventDefault();

    this.setState({ show: true });
    document.body.classList.add("cf-modal-locked");
  }

  hideModal(event){
    event.preventDefault();

    this.setState({ show: false });
    document.body.classList.remove("cf-modal-locked");
  }

  render() {
    var modalWindow;
    if (this.state.show) {
      modalWindow =
      <Modal
        show={this.state.show}
        handleClose={this.hideModal}
        modalTitle={this.props.modalTitle}
        className={this.props.className}
      >
        {this.props.children}
      </Modal>
    }

    return(
      <div className="row">
        <div className="col-12">
          {modalWindow}
          <button id={this.props.modalButtonId} onClick={this.showModal} className={`btn btn-sm ${this.props.modalButtonClass}`}>
            {this.props.modalButtonText}
          </button>
        </div>
      </div>
    );
  }
}

export default BasicModal;
