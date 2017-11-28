/**
 * @Author: Fabre Ed
 * @Date:   2017-11-14T12:26:53-05:00
 * @Email:  edwidgefabre@gmail.com
 * @Filename: panel_login.jsx
 * @Last modified by:   Fabre Ed
 * @Last modified time: 2017-11-22T13:51:45-05:00
 */

/* global document */
import React from 'react';
import ReactDOM from 'react-dom';
import Fader from 'react-fader';
import { Alert, Form, Button, FormControl, FormGroup, Checkbox, Col, Panel } from 'react-bootstrap';
import { ipcRenderer } from 'electron';
import MainScreen from '../../main';

// Class logger, managed by loggingManager.js
const logger = require('rekuire')('loggingManager.js').logger;
const THISFILE = require('path').basename(__filename).toUpperCase();

// Used to update this components alerts
function alertMessage(alertObj) {
  ReactDOM.render(
    <Fader>
      <div id="loginAlert" className="panel-footer">
        <Alert bsStyle={alertObj.style}>
          <p>{alertObj.message}</p>
        </Alert>
      </div>
    </Fader>,
    document.getElementById('loginAlert'));

  // After set time, the alert will close
  setTimeout(() => {
    ReactDOM.render(
      <Fader>
        <div id="loginAlert" />
      </Fader>,
      document.getElementById('loginAlert'));
    if (alertObj.isSuccess) {
      setTimeout(() => {
        ReactDOM.render(
          <Fader><MainScreen /></Fader>, document.getElementById(
            'container'));
      }, 500);
    }
  }, (alertObj.time * 1000));
}

export default class LoginForm extends React.Component {
  submit(e) {
    e.preventDefault();
    const formData = {
      email: document.getElementById('loginFormEmail').value,
      password: document.getElementById('loginFormPassword').value,
    };

    logger.log('debug', 'Submitting Login Form', {
      file: THISFILE,
      data: {
        formData,
      },
    });

    ipcRenderer.send('form-login-submission', formData);
    ipcRenderer.on('login-result', (event, data) => {
      if (data.successfulLogin) {
        alertMessage({
          message: 'Success! Logging in..',
          style: 'success',
          time: 2,
          isSuccess: true,
        });
        logger.log('debug', 'Login Successful', {
          file: THISFILE,
          data: {
            data: data.results,
            extra: this,
          },
        });
      } else {
        alertMessage({
          message: data.results.message,
          style: 'danger',
          time: 2,
          isSuccess: false,
        });
        logger.log('warn', 'Login Failed', {
          file: THISFILE,
          data: {
            data: data.results,
          },
        });
      }
    });
  }

  render() {
    return (
      <Panel>
        <div className="panel-header">
          <h1>Welcome Back!</h1>
        </div>
        <div className="panel-body">
          <Form onSubmit={this.submit}>
            <FormGroup controlId="loginFormEmail">
              <FormControl type="email" placeholder="Email" />
            </FormGroup>
            <FormGroup controlId="loginFormPassword">
              <FormControl type="password" placeholder="Password" />
            </FormGroup>
            <FormGroup controlId="loginFormReset">
              <Button bsStyle="link">Forgot Password?</Button>
            </FormGroup>
            <FormGroup>
              <Col smOffset={2} sm={10}>
                <Checkbox>Remember me</Checkbox>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col smOffset={2} sm={10}>
                <Button bsStyle="success" type="submit">Log in</Button>
              </Col>
            </FormGroup>
          </Form>
        </div>
        <div id="loginAlert" />
      </Panel>
    );
  }
}
