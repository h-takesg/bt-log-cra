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

    this.hc = React.createRef();
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

    this.hc = document.getElementsByClassName("HistoryCard")[0];
    this.hc.scrollTop = 1;


    window.addEventListener('touchmove', function (event) {
      this.hc = document.getElementsByClassName("HistoryCard")[0];
      this.hc.scrollTop = 1;
      if (this.hc.scrollTop === 0) this.hc.scrollTop = 1;
      if (event.target.closest(".HistoryCard") !== null && this.hc.scrollTop !== 0 && this.hc.scrollTop + this.hc.clientHeight !== this.hc.scrollHeight) {
        event.stopPropagation();
      }
      else {
        event.preventDefault();
      }
    }, { passive: false });

    this.hc.addEventListener('scroll', function (event) {
      this.hc = document.getElementsByClassName("HistoryCard")[0];
      if (this.hc.scrollTop === 0) {
        this.hc.scrollTop = 1;
      }
      else if (this.hc.scrollTop + this.hc.clientHeight === this.hc.scrollHeight) {
        this.hc.scrollTop = this.hc.scrollTop - 1;
      }
    });
  }

  render() {
    return (
      <div className="HistoryCard" ref={(divElement) => this.divElement = divElement}>
        {this.props.historyArray.slice().reverse().map(data => this.generateHistory(data))}
        {this.generateSpace()}
      </div>
    )
  }
}

export default HistoryCard;