import React, { Component } from 'react';
import './SubmitPopup.css';
//import Moment from 'moment';

class SubmitPopup extends Component {
  constructor(props) {
    super(props);

    this.submitButtonHandler = this.submitButtonHandler.bind(this);
    this.inputTemperatureHandler = this.inputTemperatureHandler.bind(this);
    this.inputConditionHandler = this.inputConditionHandler.bind(this);
    this.inputOtherHandler = this.inputOtherHandler.bind(this);

    this.state = {
      temperature: "",
      condition: "",
      other: "",
    }
  }

  inputTemperatureHandler(e) {
    this.setState({
      temperature: e.target.value,
    })
  }

  inputConditionHandler(e) {
    this.setState({
      condition: e.target.value,
    })
  }

  inputOtherHandler(e) {
    this.setState({
      other: e.target.value,
    })
  }

  submitButtonHandler() {
    var data = {};
    data["temperature"] = this.state.temperature;
    data["condition"] = this.state.condition;
    data["other"] = this.state.other;
    data["date"] = this.props.submitDate.format("YYYY/MM/DD");
    var errorText = "";
    var temperature = parseFloat(this.state.temperature);
    if (isNaN(temperature) || temperature < 33 || temperature > 43) errorText += "体温が不正な値です\n";
    if (this.state.condition === "") errorText += "体調が入力されていません\n";
    if (errorText !== "") {
      alert(errorText);
      return;
    }
    this.props.submitHandler(data);

    this.setState({
      temperature: "",
      condition: "",
      other: "",
    })
  }

  render() {
    var popupStyle;
    if (this.props.displayState) {
      popupStyle = {
        visibility: "visible",
        opacity: 1
      };
    } else {
      popupStyle = {
        visibility: "hidden",
        opacity: 0
      }
    }

    return (
      <div className="SubmitPopup" style={popupStyle}>
        <div className="SubmitPopupInner">
          <div className="SubmitPopupTitle">
            新規回答
            <button className="SubmitPopupCloseButton" onClick={() => this.props.closeHandler()}>閉じる</button>
          </div>
          <div className="SubmitItems">
            <div className="SubmitItemFix">
              <div className="SubmitItemFixText">
                氏名: {this.props.userName}
              </div>
            </div>
            <div className="SubmitItemFix">
              <div className="SubmitItemFixText">
                所属: {this.props.userAffiliation}
              </div>
            </div>
            <div className="SubmitItemFix">
              <div className="SubmitItemFixText">
                学年: {this.props.userGrade}
              </div>
            </div>
            <div className="SubmitItemFix">
              <div className="SubmitItemFixText">
                記録日: {this.props.submitDate.format("YYYY/MM/DD")}
              </div>
            </div>
            <div className="SubmitItemRow">
              <div className="SubmitItemText">
                体温:
              </div>
              <input className="SubmitInput" value={this.state.temperature} onChange={this.inputTemperatureHandler} type="number" step="0.01">
              </input>
            </div>
            <div className="SubmitItemRow">
              <div className="SubmitItemText">
                症状:
              </div>
              <input className="SubmitInput" value={this.state.condition} onChange={this.inputConditionHandler}>
              </input>
            </div>
            <div className="SubmitItemRow">
              <div className="SubmitItemText">
                その他:
              </div>
              <input className="SubmitInput" value={this.state.other} onChange={this.inputOtherHandler} placeholder="省略可">
              </input>
            </div>
          </div>
          <button className="SubmitButton" onClick={this.submitButtonHandler}>
            送信
          </button>
        </div>
      </div >
    )
  }
}

export default SubmitPopup;