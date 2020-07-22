import React, { Component } from 'react';
import './SettingPopup.css';

class SettingPopup extends Component {
  constructor(props) {
    super(props);

    this.inputNameHandler = this.inputNameHandler.bind(this);
    this.inputAffiliationHandler = this.inputAffiliationHandler.bind(this);
    this.inputGradeHandler = this.inputGradeHandler.bind(this);
    this.inputKeyHandler = this.inputKeyHandler.bind(this);

    this.state = {
      inputName: this.props.userName,
      inputAffiliation: this.props.userAffiliation,
      inputGrade: this.props.userGrade,
      inputKey: this.props.apiKey
    }
  }

  inputNameHandler(e) {
    this.setState({
      inputName: e.target.value,
    })
  }

  inputAffiliationHandler(e) {
    this.setState({
      inputAffiliation: e.target.value,
    })
  }

  inputGradeHandler(e) {
    this.setState({
      inputGrade: e.target.value,
    })
  }

  inputKeyHandler(e) {
    this.setState({
      inputKey: e.target.value,
    })
  }

  closeHandler() {
    let data = {}
    data["name"] = String(this.state.inputName).replace(" ", "").replace("　", "");
    data["affiliation"] = this.state.inputAffiliation;
    data["grade"] = this.state.inputGrade;
    data["key"] = this.state.inputKey;
    console.log(data);
    this.props.closeHandler(data);
    this.setState({
      inputName: data["name"],
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
        opacity: 0,
      }
    }

    return (
      <div className="SettingPopup" style={popupStyle}>
        <div className="SettingPopupInner">
          <div className="SettingPopupTitle">
            設定
          </div>
          <div className="SettingItems">
            <div className="SettingName">
              <div className="SettingItemText">
                氏名:
              </div>
              <input className="SettingInput" value={this.state.inputName} onChange={this.inputNameHandler}>
              </input>
            </div>
            <div className="SettingAffiliation">
              <div className="SettingItemText">
                所属:
              </div>
              <select className="SettingMenu" value={this.state.inputAffiliation} onChange={this.inputAffiliationHandler}>
                <option disabled>選択</option>
                <option>阪大OLC</option>
                <option>神大OLK</option>
                <option>奈良女OLC</option>
              </select>
            </div>
            <div className="SettingGrade">
              <div className="SettingItemText">
                学年:
              </div>
              <select className="SettingMenu" value={this.state.inputGrade} onChange={this.inputGradeHandler}>
                <option disabled>選択</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5+</option>
              </select>
            </div>
            <div className="SettingKey">
              <div className="SettingItemText">
                APIKey:
              </div>
              <input className="SettingInput" value={this.state.inputKey} onChange={this.inputKeyHandler}>
              </input>
            </div>
          </div>
          <button className="SettingPopupCloseButton" onClick={() => this.closeHandler()}>
            閉じる
          </button>
        </div>
      </div >
    )
  }
}

export default SettingPopup