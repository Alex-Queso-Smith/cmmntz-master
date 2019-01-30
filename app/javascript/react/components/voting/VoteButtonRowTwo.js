import React from 'react';

class VoteButtonRowTwo extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      shownNumber: this.props.percentage
    }

    this._onMouseEnter = this._onMouseEnter.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);
  }

  componentDidUpdate(prevProps, prevState){
    if (prevProps.percentage != this.props.percentage) {
      this.setState({ shownNumber: this.props.percentage })
    }
  }

  _onMouseEnter(){
    this.setState({ shownNumber: this.props.voteFraction })
  }

  _onMouseLeave(){
    this.setState({ shownNumber: this.props.percentage })
  }

  render(){
    var { shownNumber } = this.state;

    return(
      <div className={`col-1 col-sm-1 col-md-1 justify-content-center ${this.props.className} cf-vote-button-box`}>
        <img className={`cf-vote-btn cf-cursor-pointer vote-${this.props.name} ${this.props.visibility} ${this.props.opacity}`} onClick={this.props.onClick} name={this.props.name} src={this.props.image} />
        <div onMouseEnter={this._onMouseEnter} onMouseLeave={this._onMouseLeave} className="cf-cursor-pointer cf-text-center cf-vote-ratio">{shownNumber}</div>
      </div>
    )
  }
};

export default VoteButtonRowTwo;
