import React, { Component } from 'react';
import logo from './logo.svg'
import './App.less';

import { Button } from 'antd';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="logo">

          </div>
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <Button type="primary">Antd Button!</Button>
        </header>
      </div>
    );
  }
}

export default App;
