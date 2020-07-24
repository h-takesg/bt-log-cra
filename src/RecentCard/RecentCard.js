import React, { Component } from 'react';
import './RecentCard.css';
import Moment from 'moment';
import * as localforage from 'localforage';

class RecentCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [["-/-", "-"], ["-/-", "-"], ["-/-", "-"], ["-/-", "-"], ["-/-", "-"], ["-/-", "-"]],
      loading: false,
    }
    console.log(props);
  }

  updateHandler() {
    var sendData = {};
    sendData["key"] = this.props.apiKey;
    sendData["name"] = this.props.userName;
    sendData["affiliation"] = this.props.userAffiliation;
    sendData["grade"] = this.props.userGrade;
    sendData["method"] = "update";
    this.setState({
      loading: true,
    })
    console.log("fetch start");
    this.postData("https://script.google.com/macros/s/AKfycbzCrDvj9iLbnFXbES5MXAQ5KH3w_LROAbUYtZNJEm1ZugpALQSd/exec", sendData);
  }

  postData(url = ``, data = {}) {
    return fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("generate data");
        console.log(responseJson);
        var responseArray = responseJson["data"];
        var newData = [];
        var now = Moment().add(-6, 'days');
        for (let i = 0; i < 6; i++) {
          newData.push([now.add(1, 'days').format("M/DD"), (responseArray[i] ? "O" : "X")]);
        }
        this.setState({
          loading: false,
          data: newData,
        });
        console.log("fetch done");
        localforage.setItem("recent", newData);

      })
      .catch((error) => {
        console.error(error);
        this.setState({
          loading: false
        });
        alert("取得失敗\n設定項目を正しく入力しているか確認してください");
      });
  }

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
          <button className="updateButton" onClick={() => this.updateHandler()}>
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
    var coverStyle;
    if (this.state.loading) {
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
        {this.generateTodayInfo(this.state.data[this.state.data.length - 1])}
        <div className="lastdays">
          {this.state.data.slice(0, this.state.data.length - 1).map((value, index) => this.generateLastdayColumn(value, index))}
        </div>
        <div className="UpdatingCover" style={coverStyle}><div className="UpdatingCoverText">更新中...</div></div>
      </div>
    )
  }
}

export default RecentCard;