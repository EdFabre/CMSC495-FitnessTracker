/**
 * @Author: Fabre Ed
 * @Date:   2017-11-14T12:26:53-05:00
 * @Email:  edwidgefabre@gmail.com
 * @Filename: view_tabs_login_signup.jsx
 * @Last modified by:   Fabre Ed
 * @Last modified time: 2017-12-15T19:08:57-05:00
 */

import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';

// Sub Modules
import LoginPanel from './panel_login';
import SignupPanel from './panel_signup';

// Class logger, managed by loggingManager.js
const logger = require('rekuire')('loggingManager.js').logger;
const THISFILE = require('path').basename(__filename).toUpperCase();

export default class LoginSignupView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 2,
    };
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(key) {
    logger.log('silly', 'Selected Key', {
      file: THISFILE,
      data: {
        key,
      },
    });
    this.setState({
      key,
    });
  }

  render() {
    return (
      <div>
        <Tabs
          bsStyle="pills"
          justified
          activeKey={this.state.key}
          onSelect={i => this.handleSelect(i)}
          id="controlled-tab-example"
        >
          <Tab eventKey={1} title="Signup"><SignupPanel /></Tab>
          <Tab eventKey={2} title="Login"><LoginPanel /></Tab>
        </Tabs>
      </div>
    );
  }
}
