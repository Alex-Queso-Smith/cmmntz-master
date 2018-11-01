import React from 'react';

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
    }

    hideModal(){
      this.setState({ show: false });
    }

    render() {

      return(
        <div>
          <button onClick={this.showModal} className="btn btn-light">
            {this.props.modalButtonText}
          </button>
        </div>
      );
    }
}

export default BasicModal;
