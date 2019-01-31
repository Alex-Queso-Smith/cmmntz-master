import React from 'react';
import Modal from './Modal'

class BasicModal extends React.Component {
  state = { show: false }

  showModal = this.showModal.bind(this);
  hideModal = this.hideModal.bind(this)
  handleOutsideClick = this.handleOutsideClick.bind(this);

  showModal(event){
    event.preventDefault();

    document.addEventListener('click', this.handleOutsideClick, false)
    this.setState({ show: true });
    document.body.classList.add("cf-modal-locked");
  }

  hideModal(event){
    event.preventDefault();

    document.removeEventListener('click', this.handleOutsideClick, false)
    this.setState({ show: false });
    document.body.classList.remove("cf-modal-locked");
  }

  handleOutsideClick(event) {
    if (!event.target.classList.value.includes("cf-modal-container")) {
      return;
    } else {
      this.hideModal(event);
    }
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
        hideButton={this.props.hideButton}
      >
        {this.props.children}
      </Modal>
    }

    return(
      <div className="row">
        <div className="">
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
