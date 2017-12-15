/**
 * @Author: Fabre Ed
 * @Date:   2017-11-28T20:35:54-05:00
 * @Email:  edwidgefabre@gmail.com
 * @Filename: screen_dash.jsx
 * @Last modified by:   Fabre Ed
 * @Last modified time: 2017-12-14T22:09:05-05:00
 */


/* eslint-env browser */
import React from 'react';
import { Jumbotron, Row, Col, Panel } from 'react-bootstrap';
import { ipcRenderer } from 'electron';

// Class logger, managed by loggingManager.js
const logger = require('rekuire')('loggingManager.js').logger;
const THISFILE = require('path').basename(__filename).toUpperCase();
const { Calories } = require('rekuire')('fittrac_logic');

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      calOut: 0,
      calIn: 0,
      balance: 0,
    };
  }

  componentDidMount() {
    ipcRenderer.send('get-profile-info');
    ipcRenderer.on('profile-info-result', (event, data) => {
      if (data.profileExists) {
        logger.log('silly', 'Updating Dash', {
          file: THISFILE,
          data: {
            data,
          },
        });
        this.initDash(data.results);
      }
    });
  }

  initDash(updates) {
    const calories = new Calories({
      exercises: updates.exercise,
      foods: updates.foods,
      gender: 'Male',
    });
    console.log(stats);

    logger.log('silly', '', {
      file: THISFILE,
      data: calories,
    });

    if (!isNaN(stats.calsOut)) {
      this.setState({
        calOut: stats.calsOut,
      });
    }
    if (!isNaN(stats.calsIn)) {
      this.setState({
        calIn: stats.calsIn,
      });
    }
    if (!isNaN(stats.calories)) {
      this.setState({
        balance: stats.calories,
      });
    }
  }

  render() {
    return (
      <Panel>
        <Jumbotron>
          <h1>{"Today's Progress"}</h1>
          <Row>
            <Col xs={4} md={4}>{this.state.calIn}</Col>
            <Col xs={4} md={4}>{this.state.calOut}</Col>
            <Col xs={4} md={4}>{this.state.balance}</Col>
          </Row>
          <Row>
            <Col xs={4} md={4}>{'Calories In'}</Col>
            <Col xs={4} md={4}>{'Calories Out'}</Col>
            <Col xs={4} md={4}>{'Balance'}</Col>
          </Row>
        </Jumbotron>
      </Panel>
    );
  }
}
