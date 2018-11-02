import React from 'react';
import Modal from './Modal'

class BasicModal extends React.Component {
  constructor(props){
    super(props);
      this.state = {
        show: false
      }

      this.showModal = this.showModal.bind(this);
      this.hideModal = this.hideModal.bind(this)
    }

    showModal(){
      this.setState({ show: true });
      document.body.classList.add("cf-modal-locked");
    }

    hideModal(){
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
        >
          {this.props.children}
        </Modal>
      }

      return(
        <div>
          {modalWindow}
          <button onClick={this.showModal} className="btn btn-light">
            {this.props.modalButtonText}
          </button>
        </div>
      );
    }
}

export default BasicModal;
