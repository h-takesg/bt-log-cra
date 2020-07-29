import React, { Component } from 'react';
import './Intro.css';

class Intro extends Component {
  render() {
    return (
      <div className="intro">
        <div className="introText">
          <div className="introTitle">
            bt-log インストール
          </div>
          <ul>
            <li><b>iOS</b>は下部の共有ボタン(四角から矢印が出ているボタン)をタップし、ホーム画面に追加を選択</li>
            <li><b>Android</b>は下部のバナーか、右上の...からホーム画面に追加を選択</li>
          </ul>
        </div>
      </div>
    )
  }
}

export default Intro;