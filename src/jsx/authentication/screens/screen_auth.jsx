/**
 * @Author: Fabre Ed
 * @Date:   2017-11-20T14:56:42-05:00
 * @Email:  edwidgefabre@gmail.com
 * @Filename: screen_auth.jsx
 * @Last modified by:   Fabre Ed
 * @Last modified time: 2017-11-21T17:21:49-05:00
 */

import React from 'react';
import { Modal } from 'react-bootstrap';
import LoginView from '../components/view_tabs_login_signup';

// Class logger, managed by loggingManager.js
const logger = require('rekuire')('loggingManager.js').logger;
const THISFILE = require('path').basename(__filename).toUpperCase();

// TODO: Add some logging

export default class ModalView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: true,
    };
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
  }

  close() {
    this.setState({
      showModal: false,
    });
  }

  open() {
    this.setState({
      showModal: true,
    });
  }

  render() {
    logger.log('silly', 'Displaying Authentication Screen/Modal', {
      file: THISFILE,
    });
    return (
      <Modal show={this.state.showModal}>
        <Modal.Body>
          <LoginView />
        </Modal.Body>
      </Modal>
    );
  }
}
