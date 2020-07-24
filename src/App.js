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

    this.recentCardRef = React.createRef();
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
    }
    localforage.config();
  }

  submitPopupHandler() {
    this.setState({
      submitPopup: !this.state.submitPopup,
      submitData: Moment(),
    })
  }

  settingBtnHandler(data) {
    if (this.state.settingPopup) {
      let newName = data["name"];
      let newAffiliation = data["affiliation"];
      let newGrade = data["grade"];
      let newKey = data["key"];

      let errorText = "";
      if (newName === "") errorText += "名前を入力してください\n";
      if (newAffiliation === "選択") errorText += "所属を選択してください\n";
      if (newGrade === "選択") errorText += "学年を選択してください\n";
      if (newKey === "") errorText += "APIKeyを入力してください"
      if (errorText !== "") {
        alert(errorText);
        return;
      }

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
    var submitData = {
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
    this.postData("https://script.google.com/macros/s/AKfycbzCrDvj9iLbnFXbES5MXAQ5KH3w_LROAbUYtZNJEm1ZugpALQSd/exec", submitData);
    this.recentCardRef.current.setState({
      loading: true,
    });

    var newHistoryArray = this.state.historyArray.slice();
    newHistoryArray.push([Moment(data["data"]).format("M/D"), data["temperature"], data["condition"], Moment().format("YYYY/MM/DD HH:mm:ss")]);
    this.setState({
      submitPopup: false,
      historyArray: newHistoryArray,
    });
    localforage.setItem("history", newHistoryArray);
  }

  postData(url = ``, data = {}) {
    return fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("generate data");
        var responseArray = responseJson["data"];
        var newData = [];
        var now = Moment().add(-6, 'days');
        for (let i = 0; i < 6; i++) {
          newData.push([now.add(1, 'days').format("M/DD"), (responseArray[i] ? "O" : "X")]);
        }
        this.recentCardRef.current.setState({
          loading: false,
          data: newData,
        });
        localforage.setItem("recent", newData);
        console.log("fetch done");
      })
      .catch((error) => {
        console.error(error);
        this.recentCardRef.current.setState({
          loading: false
        });
        alert("取得失敗\n設定項目を正しく入力しているか確認してください");
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
          this.recentCardRef.current.setState({
            data: value
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
          ref={this.recentCardRef} />
        <HistoryCard historyArray={this.state.historyArray} />
        <button className="submitPopupButton" onClick={this.submitPopupHandler}>新規回答を送信</button>
        <SettingPopup displayState={this.state.settingPopup}
          closeHandler={this.settingBtnHandler}
          userName={this.state.userName}
          userAffiliation={this.state.userAffiliation}
          userGrade={this.state.userGrade}
          apiKey={this.state.apiKey} ref={this.settingPopupRef} />
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
