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
import { RIENumber } from 'riek';

// Class logger, managed by loggingManager.js
const logger = require('rekuire')('loggingManager.js').logger;
const THISFILE = require('path').basename(__filename).toUpperCase();
const { Calories } = require('rekuire')('fittrac_logic');

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      message: '',
      calOut: 0,
      calIn: 0,
      calgoal: 0,
      balance: 0,
    };
    this.calculateProgress = this.calculateProgress.bind(this);
    this.dataChanged = this.dataChanged.bind(this);
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
      gender: updates.gender,
    });
    const stats = calories.getDaysStats(new Date());

    logger.log('silly', 'Stats', {
      file: THISFILE,
      data: stats,
    });

    logger.log('silly', 'Calories', {
      file: THISFILE,
      data: calories,
    });

    this.setState({
      calOut: stats.calsOut,
      calIn: stats.calsIn,
      balance: stats.calories,
      calgoal: updates.calgoal,
    });
    this.calculateProgress(updates.calgoal);
  }

  dataChanged(data) {
    logger.log('debug', 'Updating Caloric Value', {
      file: THISFILE,
      data: {
        data,
      },
    });

    ipcRenderer.send('update-profile-info', {
      data: {
        calgoal: parseInt(data.calgoal, 10),
      },
    });

    this.setState({
      calgoal: data.calgoal,
    });

    this.calculateProgress(data.calgoal);
  }

  calculateProgress(goal) {
    if (this.state.balance < goal) {
      this.state.message = 'You are below target caloric level!';
    } else if (this.state.balance > goal) {
      this.state.message = 'You are above target caloric level!';
    } else {
      this.state.message = 'You are at target caloric level!';
    }
  }

  render() {
    return (
      <Panel>
        <Jumbotron>
          <h1>{"Today's Progress"}</h1>
          <Row>
            <Col xs={4} md={4}>
              <RIENumber
                classEditing="editing"
                value={this.state.calgoal}
                propName="calgoal"
                change={this.dataChanged}
              />
            </Col>
            <Col xs={4} md={4}>{this.state.calIn}</Col>
            <Col xs={4} md={4}>{this.state.calOut}</Col>
            <Col xs={4} md={4}>{this.state.balance}</Col>
          </Row>
          <Row>
            <Col xs={4} md={4}>{'Goal'}</Col>
            <Col xs={4} md={4}>{'Calories In'}</Col>
            <Col xs={4} md={4}>{'Calories Out'}</Col>
            <Col xs={4} md={4}>{'Balance'}</Col>
          </Row>
          <Row>
            <h3>{this.state.message}</h3>
          </Row>
        </Jumbotron>
      </Panel>
    );
  }
}
