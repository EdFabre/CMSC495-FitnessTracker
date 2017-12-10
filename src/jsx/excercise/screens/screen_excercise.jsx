/**
 * @Author: Fabre Ed
 * @Date:   2017-11-20T14:56:42-05:00
 * @Email:  edwidgefabre@gmail.com
 * @Filename: screen_excercise.jsx
 * @Last modified by:   Fabre Ed
 * @Last modified time: 2017-12-10T15:36:56-05:00
 */

/* eslint-env browser */
/* eslint max-len: ["error", { "code": 500 }] */

import React from 'react';
// import DayPickerInput from 'react-day-picker/DayPickerInput';
import DayPickerInput from 'react-datetime';
import { Modal, Button, Panel } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import { ipcRenderer } from 'electron';
import { RIEInput, RIENumber, RIESelect } from 'riek';
import Fader from 'react-fader';
import CalendarScreen from '../../calendar/screens/screen_calendar';

// Class logger, managed by loggingManager.js
const logger = require('rekuire')('loggingManager.js').logger;
const THISFILE = require('path').basename(__filename).toUpperCase();

// TODO: Add some logging
function caloriesBurnedPerMinute(excercise) {
  switch (excercise) {
    case 'Walking':
      return {
        male: 4,
        female: 5,
      };
    case 'Running':
      return {
        male: 12,
        female: 14,
      };
    case 'Swimming':
      return {
        male: 9,
        female: 10,
      };
    case 'Weight Lifting':
      return {
        male: 9,
        female: 10,
      };
    default:
      return {
        male: 1,
        female: 1,
      };
  }
}

function dateReviver(key, value) {
  if (typeof value === 'string') {
    const a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(
      value);
    if (a) {
      return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
    }
  }
  return value;
}

export default class ExcerciseScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      exercise: [],
      excerciseDuration: 60,
      excerciseCBPM: {
        male: 12,
        female: 14,
      },
      showModal: true,
      excerciseName: {
        id: '2',
        text: 'Running',
      },
      selectOptions: [{
        id: '1',
        text: 'Walking',
      },
      {
        id: '2',
        text: 'Running',
      },
      {
        id: '3',
        text: 'Swimming',
      },
      {
        id: '4',
        text: 'Weight Lifting',
      },
      ],
      selectedDay: new Date(),
    };
    this.close = this.close.bind(this);
    this.addExcercise = this.addExcercise.bind(this);
    this.handleDayChange = this.handleDayChange.bind(this);
  }

  componentDidMount() {
    ipcRenderer.send('get-profile-info');
    ipcRenderer.on('profile-info-result', (event, data) => {
      if (data.profileExists) {
        logger.log('silly', 'Setting Excercise Info', {
          file: THISFILE,
          data: {
            data,
            props: this.props,
          },
        });
        this.init(data.results);
      }
    });
  }

  init(updates) {
    this.setState({
      events: JSON.parse(updates.events, dateReviver),
      exercise: JSON.parse(updates.exercise, dateReviver),
    });
  }

  close() {
    this.setState({
      showModal: false,
    });
    const exerciseObj = {
      name: this.state.excerciseName.text,
      date: this.state.selectedDay,
      duration: this.state.excerciseDuration,
      cbpm: this.state.excerciseCBPM,
    };

    const eventObj = {
      title: this.state.excerciseName.text,
      start: this.state.selectedDay,
      end: this.state.selectedDay,
    };

    this.state.exercise.push(exerciseObj);
    this.state.events.push(eventObj);

    logger.log('silly', 'Sending Excercise', {
      file: THISFILE,
      data: {
        exercise: this.state.exercise,
        events: this.state.events,
      },
    });

    ipcRenderer.send('update-profile-info', {
      data: {
        exercise: JSON.stringify(this.state.exercise),
        events: JSON.stringify(this.state.events),
      },
    });
    ReactDOM.render(<Fader><Panel><CalendarScreen /></Panel></Fader>,
      document.getElementById(
        'secondpanelcontent'));
  }

  handleDayChange(selectedDay) {
    this.setState({
      selectedDay,
    });
  }

  addExcercise(data) {
    console.log(data);
    logger.log('debug', 'Adding Excercise', {
      file: THISFILE,
      data: {
        data,
      },
    });

    if (data.excerciseName !== undefined) {
      this.setState({
        excerciseName: data.excerciseName || this.state.excerciseName,
        excerciseDuration: data.excerciseDuration || this.state.excerciseDuration,
        excerciseCBPM: caloriesBurnedPerMinute(data.excerciseName.text),
      });
    } else {
      this.setState({
        excerciseDuration: data.excerciseDuration || this.state.excerciseDuration,
      });
    }
  }

  render() {
    return (
      <div>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Add Exercise</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <span>Exercise: </span>
              <RIESelect
                classEditing="editing"
                highlight
                value={this.state.excerciseName}
                options={this.state.selectOptions}
                change={this.addExcercise}
                classLoading="loading"
                propName="excerciseName"
              />
            </div>
            <div>
              <span>Date: </span>
              <DayPickerInput
                value={this.state.selectedDay}
                onChange={this.handleDayChange}
              />
            </div>
            <div>
              <span>Duration(minutes): </span>
              <RIENumber
                classEditing="editing"
                highlight
                value={this.state.excerciseDuration}
                propName="excerciseDuration"
                change={this.addExcercise}
              />
            </div>
            <div>
              <span>Calorie Burn: Male - {this.state.excerciseCBPM.male}/minute | Female - {this.state.excerciseCBPM.female}/minute</span>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
