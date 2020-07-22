import React, { Component } from 'react';
import './HistoryCard.css';

class HistoryCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      componentHeight: 0,
      componentSpaceHeight: 0,
      scrollTop: 0
    }
  }

  generateHistory(data) {
    return (
      <div className="HistoryColumn" key={data[3]}>
        <div className="HistoryDate">
          {data[0]}
        </div>
        <div className="HistoryBt-data">
          {data[1]}
        </div>
        <div className="HistoryCondition">
          {data[2]}
        </div>
        <div className="HistoryTime">
          {data[3]}
        </div>
      </div>
    )
  }

  generateSpace() {
    let computedStyle = {};
    if (this.state.componentHeight !== 0) {
      if (this.state.componentHeight - this.state.componentSpaceHeight * this.props.historyArray.length + 3 > 0) {
        computedStyle = { height: this.state.componentHeight - this.state.componentSpaceHeight * this.props.historyArray.length + 3 };
      } else {
        computedStyle = { height: 0 };
      }
    }
    return (
      <div className="space" style={computedStyle} ref={(divElement) => this.spaceElement = divElement}></div>
    )
  }

  componentDidMount() {
    this.setState({
      componentHeight: this.divElement.clientHeight,
      componentSpaceHeight: this.spaceElement.clientHeight
    })
  }

  render() {
    return (
      <div className="HistoryCard" ref={(divElement) => this.divElement = divElement}>
        {this.props.historyArray.reverse().map(data => this.generateHistory(data))}
        {this.generateSpace()}
      </div>
    )
  }
}

export default HistoryCard;