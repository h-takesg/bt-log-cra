import React, { Component } from 'react';
import * as localforage from 'localforage';
import './App.css';

import RecentCard from "./RecentCard/RecentCard";
import HistoryCard from "./HistoryCard/HistoryCard";
import SettingPopup from "./SettingPopup/SettingPopup";
import SubmitPopup from "./SubmitPopup/SubmitPopup";
import Moment from 'moment';


class App extends Component {
  constructor(props) {
    super(props);

    this.submitPopupHandler = this.submitPopupHandler.bind(this);
    this.settingBtnHandler = this.settingBtnHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.updateHandler = this.updateHandler.bind(this);

    this.settingPopupRef = React.createRef();

    this.state = {
      historyArray: [],
      settingPopup: false,
      submitPopup: false,
      userName: "",
      userAffiliation: "選択",
      userGrade: "選択",
      apiKey: "",
      submitDate: Moment(),
      recentArray: [["-/-", "-"], ["-/-", "-"], ["-/-", "-"], ["-/-", "-"], ["-/-", "-"], ["-/-", "-"]],
      recentLoading: false,
    }
    localforage.config();
  }

  updateHandler() {
    var sendData = {
      key: this.state.apiKey,
      name: this.state.userName,
      affiliation: this.state.userAffiliation,
      grade: this.state.userGrade,
      method: "update",
    };
    this.setState({
      recentLoading: true,
    })
    console.log("fetch start");
    this.postData(sendData)
      .then((response) => response.json())
      .then((responseJson) => {
        this.registerRecentData(responseJson["data"]);
        //エラーハンドリング
      })
      .catch((error) => {
        console.error(error);
        this.setState({
          recentLoading: false
        });
        alert("取得失敗\n設定項目を正しく入力しているか確認してください");
      });
  }

  registerRecentData(responseArray) {
    var newData = [];
    var now = Moment().add(-6, 'days');
    for (let i = 0; i < 6; i++) {
      newData.push([now.add(1, 'days').format("M/DD"), (responseArray[i] ? "O" : "X")]);
    }
    this.setState({
      recentLoading: false,
      recentArray: newData,
    });
    console.log("fetch done");
    localforage.setItem("recent", newData);
  }

  submitPopupHandler() {
    this.setState({
      submitPopup: !this.state.submitPopup,
      submitData: Moment(),
    })
  }

  settingBtnHandler(data) {
    if (this.state.settingPopup) {
      const newName = data["name"];
      const newAffiliation = data["affiliation"];
      const newGrade = data["grade"];
      const newKey = data["key"];

      this.setState({
        userName: newName,
        userAffiliation: newAffiliation,
        userGrade: newGrade,
        apiKey: newKey,
      })
      localforage.setItem("userInfo", {
        name: newName,
        affiliation: newAffiliation,
        grade: newGrade,
        key: newKey,
      })
    }
    this.setState({
      settingPopup: !this.state.settingPopup
    })
  }

  submitHandler(data) {
    const submitData = {
      key: this.state.apiKey,
      method: "submit",
      name: this.state.userName,
      affiliation: this.state.userAffiliation,
      grade: this.state.userGrade,
      date: data["date"],
      temperature: data["temperature"],
      condition: data["condition"],
      other: data["other"],
    };

    this.postData(submitData)
      .then((response) => response.json())
      .then((responseJson) => {
        // TODO: レスポンス対応を書け
      });

    var newHistoryArray = this.state.historyArray.slice();
    newHistoryArray.push([Moment(data["data"]).format("M/D"), data["temperature"], data["condition"], Moment().format("YYYY/MM/DD HH:mm:ss")]);
    this.setState({
      submitPopup: false,
      historyArray: newHistoryArray,
    });
    localforage.setItem("history", newHistoryArray);
  }

  postData(data = {}) {
    return fetch("https://script.google.com/macros/s/AKfycbzCrDvj9iLbnFXbES5MXAQ5KH3w_LROAbUYtZNJEm1ZugpALQSd/exec", {
      method: 'POST',
      mode: "cors",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(data),
    });
  }

  componentDidMount() {
    localforage.getItem("userInfo")
      .then((value) => {
        if (value === null) {
          this.setState({
            settingPopup: true,
          })
        } else {
          console.log(value);
          this.setState({
            userName: value["name"],
            userAffiliation: value["affiliation"],
            userGrade: value["grade"],
            apiKey: value["key"],
          })
          this.settingPopupRef.current.setState({
            inputName: value["name"],
            inputAffiliation: value["affiliation"],
            inputGrade: value["grade"],
            inputKey: value["key"],
          })
        }
      })
    localforage.getItem("recent")
      .then((value) => {
        if (value !== null) {
          this.setState({
            recentArray: value
          })
        }
      })
    localforage.getItem("history")
      .then((value) => {
        if (value !== null) {
          this.setState({
            historyArray: value
          })
        }
      })
  }

  render() {
    return (
      <div className="App" onClick={() => null}>
        <div className="AppTitleBanner">
          <div className="AppTitle">
            bt-log
          </div>
          <div className="AppVersion">
            v0.1
          </div>
          <button className="SetttingButton" onClick={this.settingBtnHandler}>
            設定
          </button>
        </div>
        <RecentCard userName={this.state.userName}
          userAffiliation={this.state.userAffiliation}
          userGrade={this.state.userGrade}
          apiKey={this.state.apiKey}
          updateHandler={this.updateHandler}
          recentLoading={this.state.recentLoading}
          recentArray={this.state.recentArray}
        />
        <HistoryCard historyArray={this.state.historyArray} />
        <button className="submitPopupButton" onClick={this.submitPopupHandler}>新規回答を送信</button>
        <SettingPopup displayState={this.state.settingPopup}
          closeHandler={this.settingBtnHandler}
          userName={this.state.userName}
          userAffiliation={this.state.userAffiliation}
          userGrade={this.state.userGrade}
          apiKey={this.state.apiKey}
          ref={this.settingPopupRef} />
        <SubmitPopup displayState={this.state.submitPopup}
          userName={this.state.userName}
          userAffiliation={this.state.userAffiliation}
          userGrade={this.state.userGrade}
          closeHandler={this.submitPopupHandler}
          submitHandler={this.submitHandler}
          submitDate={this.state.submitDate} />
      </div>
    )
  }
}

export default App;
