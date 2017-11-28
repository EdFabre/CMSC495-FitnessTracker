/**
 * @Author: Fabre Ed
 * @Date:   2017-11-14T12:26:53-05:00
 * @Email:  edwidgefabre@gmail.com
 * @Filename: panel_signup.jsx
 * @Last modified by:   Fabre Ed
 * @Last modified time: 2017-11-22T13:52:26-05:00
 */

/* global document */
import React from 'react';
import ReactDOM from 'react-dom';
import Fader from 'react-fader';
import { Alert, Button, Form, FormControl, FormGroup, Col, Panel } from 'react-bootstrap';
import { ipcRenderer } from 'electron';
import MainScreen from '../../main';

// Class logger, managed by loggingManager.js
const logger = require('rekuire')('loggingManager.js').logger;
const THISFILE = require('path').basename(__filename).toUpperCase();

// Used to update this components alerts
function alertMessage(alertObj) {
  ReactDOM.render(
    <Fader>
      <div id="signupAlert" className="panel-footer">
        <Alert bsStyle={alertObj.style}>
          <p>{alertObj.message}</p>
        </Alert>
      </div>
    </Fader>,
    document.getElementById('signupAlert'));

  // After set time, the alert will close
  setTimeout(() => {
    ReactDOM.render(
      <Fader>
        <div id="signupAlert" />
      </Fader>,
      document.getElementById('signupAlert'));
    if (alertObj.isSuccess) {
      setTimeout(() => {
        ReactDOM.render(
          <Fader><MainScreen /></Fader>, document.getElementById(
            'container'));
      }, 500);
    }
  }, (alertObj.time * 1000));
}

export default class SignupForm extends React.Component {
  submit(e) {
    e.preventDefault();
    const formData = {
      firstname: document.getElementById('signupFormFirstName').value,
      lastname: document.getElementById('signupFormLastName').value,
      email: document.getElementById('signupFormEmail').value,
      password: document.getElementById('signupFormPassword').value,
    };

    logger.log('debug', 'Submitting Signup Form', {
      file: THISFILE,
      data: {
        formData,
      },
    });

    ipcRenderer.send('form-signup-submission', formData);
    ipcRenderer.on('signup-result', (event, data) => {
      if (data.successfulSignup) {
        logger.log('debug', 'Signup Successful', {
          file: THISFILE,
          data: {
            data: data.results,
            extra: this,
          },
        });
        alertMessage({
          message: 'Success! Logging in..',
          style: 'info',
          time: 2,
          isSuccess: true,
        });
      } else {
        logger.log('warn', 'Signup Failed', {
          file: THISFILE,
          data: {
            data: data.results,
          },
        });
        alertMessage({
          message: data.results.message,
          style: 'danger',
          time: 2,
          isSuccess: false,
        });
      }
    });
  }

  render() {
    return (
      <Panel>
        <div className="panel-header">
          <h1>Sign Up Now!</h1>
        </div>
        <div className="panel-body">
          <Form onSubmit={this.submit}>
            <FormGroup controlId="signupFormFirstName">
              <FormControl type="text" placeholder="First Name" />
            </FormGroup>
            <FormGroup controlId="signupFormLastName">
              <FormControl type="text" placeholder="Last Name" />
            </FormGroup>
            <FormGroup controlId="signupFormEmail">
              <FormControl type="email" placeholder="Set Email" />
            </FormGroup>
            <FormGroup controlId="signupFormPassword">
              <FormControl type="password" placeholder="Set a Password" />
            </FormGroup>
            <FormGroup>
              <Col smOffset={2} sm={10}>
                <Button bsStyle="success" type="submit">Sign Up</Button>
              </Col>
            </FormGroup>
          </Form>
        </div>
        <div id="signupAlert" />
      </Panel>
    );
  }
}
