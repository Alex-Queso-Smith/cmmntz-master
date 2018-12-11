import React from 'react';

class VoteButtonRowTwo extends React.Component {
  state = {
    shownNumber: this.props.percentage
  }

  _onMouseEnter = this._onMouseEnter.bind(this);
  _onMouseLeave = this._onMouseLeave.bind(this);

  _onMouseEnter(){
    this.setState({ shownNumber: this.props.voteFraction })
  }

  _onMouseLeave(){
    this.setState({ shownNumber: this.props.percentage })
  }

  render(){
    var { shownNumber } = this.state;

    return(
      <div className={`col-1 col-sm-1 col-md-1 justify-content-center ${this.props.className} vote-button-box`}>
        <img className={`vote-btn cursor-pointer vote-${this.props.name} ${this.props.visibility} ${this.props.opacity}`} onClick={this.props.onClick} name={this.props.name} src={this.props.image} />
        <div onMouseEnter={this._onMouseEnter} onMouseLeave={this._onMouseLeave} className="cursor-pointer text-center">{shownNumber}</div>
      </div>
    )
  }
};

export default VoteButtonRowTwo;
