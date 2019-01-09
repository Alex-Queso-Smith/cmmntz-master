import React from 'react';

import { FetchBasic } from '../../util/CoreUtil';

class TutorialVideo extends React.Component {
  state = {
    tutorialState: 0
  }

  recordTutorialClick = this.recordTutorialClick.bind(this);
  nextState = this.nextState.bind(this);
  cancel = this.cancel.bind(this);
  handleShowVideo = this.handleShowVideo.bind(this);

  recordTutorialClick(){

    var videoType = new FormData();

    videoType.append("user_video_click[video_title]", "tutorial")

    FetchBasic(this, `/api/v1/user_video_clicks.json`, videoType, 'POST')
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  }

  nextState(){
    var page = this.state.tutorialState;
    page++

    this.setState({ tutorialState: page })
  }

  cancel(){
    this.setState({ tutorialState: 0 })
  }

  handleShowVideo(){
    this.nextState();
    this.recordTutorialClick();
  }

  render(){

    var shown =
    <div className="row justify-content-center margin-top-10px">
      <button onClick={ this.nextState } className="btn btn-md btn-dark margin-top-bottom-10px">
        Stumped?
      </button>
    </div>

    switch (this.state.tutorialState) {
      case 1:
        shown =
        <div className="cf-tutorial-options">
          <p>Struggling to figure out how to use the widget after watching the videos?</p>

          <button className="float-left btn btn-sm btn-dark" onClick={this.nextState} >Yes</button>
          <button className="float-right btn btn-sm btn-dark" onClick={this.cancel} >No</button>
        </div>
        break;
      case 2:
        shown =
          <div className="cf-tutorial-options">
            <p>Need to see a detailed tutorial video as well?</p>

            <button className="float-left btn btn-sm btn-dark" onClick={this.handleShowVideo}>Yes</button>
            <button className="float-right btn btn-sm btn-dark" onClick={this.cancel}>No</button>
          </div>
        break;
      case 3:
        shown =
          <div className="cf-tutorial-video">
            <div className="vid-box">
              <iframe src="https://www.youtube.com/embed/zGGJfR3FHKs" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="video"></iframe>
            </div>
          </div>
        break;
      default:
        shown =
        <div className="row justify-content-center margin-top-10px">
          <button onClick={this.nextState} className="btn btn-md btn-dark margin-top-bottom-10px">
            Stumped?
          </button>
        </div>
    }

    return(
      <div className="cf-tutorial-video margin-top-bottom-10px">

        <div className="row justify-content-center margin-top-10px">
          <div className="vid-box">
            <iframe src="https://www.youtube.com/embed/zyh2_kwDaqU" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="video"></iframe>
          </div>
        </div>

        <div className="row justify-content-center cf-tutorial-video-container">
          {shown}
        </div>
        <hr />
      </div>
    )
  }
}

export default TutorialVideo;
