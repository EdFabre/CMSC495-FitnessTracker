/**
 * @Author: Fabre Ed
 * @Date:   2017-11-28T20:35:54-05:00
 * @Email:  edwidgefabre@gmail.com
 * @Filename: screen_dash.jsx
 * @Last modified by:   Fabre Ed
 * @Last modified time: 2017-12-16T23:38:22-05:00
 */


/* eslint-env browser */
/* eslint max-len: ["error", { "code": 500 }] */
/* eslint class-methods-use-this: ["error", { "exceptMethods": [ "addNutrition", "addExcercise"] }] */

import React from 'react';
import ReactDOM from 'react-dom';
import { Row, Col, Panel, Button } from 'react-bootstrap';
import { ipcRenderer } from 'electron';
import InputNumber from 'rc-input-number';
import styled from 'styled-components';
import nl2br from 'react-newline-to-break';

import ExcerciseModal from '../../excercise/components/add_excercise';
import NutritionModal from '../../nutrition/components/add_nutrition';

// Class logger, managed by loggingManager.js
const logger = require('rekuire')('loggingManager.js').logger;
const THISFILE = require('path').basename(__filename).toUpperCase();
const { Calories } = require('rekuire')('fittrac_logic');


export default class DashScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      disabled: false,
      readOnly: false,
      message: '',
      messagecolor: 'black',
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
      name: updates.firstname,
    });
    this.calculateProgress(updates.calgoal);
  }

  addExcercise() {
    ReactDOM.render(<Panel><ExcerciseModal /></Panel>,
      document.getElementById(
        'secondpanelcontent'));
  }

  addNutrition() {
    ReactDOM.render(<Panel><NutritionModal /></Panel>,
      document.getElementById(
        'secondpanelcontent'));
  }

  dataChanged(calgoal) {
    logger.log('debug', 'Updating Caloric Value', {
      file: THISFILE,
      data: {
        calgoal,
      },
    });

    ipcRenderer.send('update-profile-info', {
      data: {
        calgoal,
      },
    });

    this.setState({
      calgoal,
    });

    this.calculateProgress(calgoal);
  }

  calculateProgress(goal) {
    logger.log('silly', 'Calculating Progress', {
      file: THISFILE,
      data: {
        goal,
      },
    });
    if (this.state.balance < goal) {
      this.setState({
        messagecolor: 'green',
        message: 'You are below target caloric level!',
      });
    } else if (this.state.balance > goal) {
      this.setState({
        messagecolor: 'red',
        message: 'You are above target caloric level!',
      });
    } else {
      this.setState({
        messagecolor: 'yellow',
        message: 'You are at target caloric level!',
      });
    }
  }

  render() {
    // Create a Title component that'll render an <h1> tag with some styles
    const Title = styled.h1 `font-size: 2.5em; text-align: center; color: blue;`;
    const CaloricValue = styled.p `font-size: 1em; text-align: center; color: black;`;

    const Message = styled.h2 `
    font-size: 2em;
    text-align: center;
    color: black;
    &.black{
    color: black;
    }
    &.green{
    color: green;
    }
    &.red{
    color: red;
    }
    &.yellow{
    color: yellow;
    }
    `;
    const myString = '\nHere is your daily progress!';
    const newLine = '\n';

    // Create a Wrapper component that'll render a <section> tag with some styles
    return (
      <Panel>
        <Title>
        Hello {this.state.name},
        {nl2br(myString)}
          {nl2br(newLine)}
        </Title>
        <Row>
          <Col xs={3}>
            <InputNumber
              min={-5000}
              max={5000}
              value={this.state.calgoal}
              style={{
                width: 100,
              }}
              step={100}
              onChange={this.dataChanged}
              disabled={this.state.disabled}
              readOnly={this.state.readOnly}
            />
          </Col>
          <Col xs={1}><CaloricValue>{'|'}</CaloricValue></Col>
          <Col xs={2}><CaloricValue>{this.state.calIn}</CaloricValue></Col>
          <Col xs={1}><CaloricValue>{'-'}</CaloricValue></Col>
          <Col xs={2}><CaloricValue>{this.state.calOut}</CaloricValue></Col>
          <Col xs={1}><CaloricValue>{'='}</CaloricValue></Col>
          <Col xs={2}><CaloricValue>{this.state.balance}</CaloricValue></Col>
        </Row>
        <Row>
          <Col xs={3}><CaloricValue>{'Goal'}</CaloricValue></Col>
          <Col xs={1}><CaloricValue>{' '}</CaloricValue></Col>
          <Col xs={2}><CaloricValue>{'Nutrition'}</CaloricValue></Col>
          <Col xs={1}><CaloricValue>{' '}</CaloricValue></Col>
          <Col xs={2}><CaloricValue>{'Excercise'}</CaloricValue></Col>
          <Col xs={1}><CaloricValue>{' '}</CaloricValue></Col>
          <Col xs={2}><CaloricValue>{'Net'}</CaloricValue></Col>
        </Row>
        <Row>
          <Col xs={6} xsOffset={3}>
            <Message className={this.state.messagecolor}>
              {this.state.message}
            </Message>
          </Col>
        </Row>
        <Button bsStyle="primary" bsSize="large" block onClick={this.addExcercise}>Add Excercise</Button>
        <Button bsStyle="success" bsSize="large" block onClick={this.addNutrition}>Add Nutrition</Button>
      </Panel>
    );
  }
}
