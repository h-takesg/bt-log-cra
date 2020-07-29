import React, { Component } from 'react';
import './RecentCard.css';

class RecentCard extends Component {

  generateTodayInfo(data) {/*dataの想定は0番が日付テキスト、1番がステータス文字(O-)*/
    return (
      <div className="today">
        <div className="todayStatusMark" style={{ color: (data[1] === 'O' ? "#00cc00" : "#000000") }}>
          {(data[1] === "O" ? "O" : "-")}
        </div>
        <div className="todayStatusInfoArea">
          <div className="todaysDate">
            {data[0]}
          </div>
          <div className="todayStatusText">
            {data[1] === 'O' ? "送信済み" : "未送信"}
          </div>
          <button className="updateButton" onClick={() => this.props.updateHandler()}>
            更新
          </button>
        </div>
      </div >
    )
  }

  generateLastdayColumn(data, index) {/*dataの想定は0番に日付テキスト、1番にステータス文字(OX)*/
    return (
      <div className="lastdayColumn" key={index}>
        <div>
          {data[0]}
        </div>
        <div style={{ color: (data[1] === 'O' ? "#00cc00" : "#ee0000"), fontSize: "1.5em" }}>
          {data[1]}
        </div>
      </div>
    )
  }

  render() {
    let coverStyle;
    if (this.props.recentLoading) {
      coverStyle = {
        visibility: "visible",
        opacity: 1
      };
    } else {
      coverStyle = {
        visibility: "hidden",
        opacity: 0
      }
    }
    return (
      <div className="RecentCard">
        {this.generateTodayInfo(this.props.recentArray[this.props.recentArray.length - 1])}
        <div className="lastdays">
          {this.props.recentArray.slice(0, this.props.recentArray.length - 1).map((value, index) => this.generateLastdayColumn(value, index))}
        </div>
        <div className="UpdatingCover" style={coverStyle}><div className="UpdatingCoverText">更新中...</div></div>
      </div>
    )
  }
}

export default RecentCard;