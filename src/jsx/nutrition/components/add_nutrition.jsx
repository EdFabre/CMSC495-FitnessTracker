/**
 * @Author: Fabre Ed
 * @Date:   2017-12-14T10:13:54-05:00
 * @Email:  edwidgefabre@gmail.com
 * @Filename: add_nutrition.jsx
 * @Last modified by:   Fabre Ed
 * @Last modified time: 2017-12-14T11:52:21-05:00
 */


/* eslint-env browser */
/* eslint max-len: ["error", { "code": 500 }] */

import React from 'react';
// import DayPickerInput from 'react-day-picker/DayPickerInput';
import DayPickerInput from 'react-datetime';
import { Modal, Button, Panel } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import { ipcRenderer } from 'electron';
import { RIENumber, RIESelect } from 'riek';
import Fader from 'react-fader';
import CalendarScreen from '../../calendar/screens/screen_calendar';

// Class logger, managed by loggingManager.js
const logger = require('rekuire')('loggingManager.js').logger;
const THISFILE = require('path').basename(__filename).toUpperCase();

function caloriesGainedPerServing(excercise) {
  switch (excercise) {
    case 'Ceasar Salad':
      return 340;
    case 'Burger':
      return 520;
    case 'Tbone Steak':
      return 600;
    case 'Rice':
      return 150;
    case 'Chicken(Grilled)':
      return 200;
    case 'Fish':
      return 150;
    default:
      return 1;
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

export default class NutritionScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      foods: [],
      servings: 1,
      foodsCGPS: 340,
      showModal: true,
      nutritionName: {
        id: '2',
        text: 'Ceasar Salad',
      },
      selectOptions: [{
        id: '1',
        text: 'Burger',
      },
      {
        id: '2',
        text: 'Ceasar Salad',
      },
      {
        id: '3',
        text: 'Tbone Steak',
      },
      {
        id: '4',
        text: 'Rice',
      },
      {
        id: '5',
        text: 'Chicken(Grilled)',
      },
      {
        id: '6',
        text: 'Fish',
      },
      ],
      selectedDay: new Date(),
    };
    this.cancel = this.cancel.bind(this);
    this.close = this.close.bind(this);
    this.addFood = this.addFood.bind(this);
    this.handleDayChange = this.handleDayChange.bind(this);
  }

  componentDidMount() {
    ipcRenderer.send('get-profile-info');
    ipcRenderer.on('profile-info-result', (event, data) => {
      if (data.profileExists) {
        logger.log('silly', 'Setting Nutrition Info', {
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
      foods: JSON.parse(updates.foods, dateReviver),
    });
  }

  cancel() {
    this.setState({
      showModal: false,
    });
    ReactDOM.render(<Fader><Panel><CalendarScreen /></Panel></Fader>,
      document.getElementById(
        'secondpanelcontent'));
  }

  close() {
    this.setState({
      showModal: false,
    });
    const nutritionObj = {
      name: this.state.nutritionName.text,
      date: this.state.selectedDay,
      servings: this.state.servings,
      cgps: this.state.foodsCGPS,
    };

    const eventObj = {
      title: this.state.nutritionName.text,
      start: this.state.selectedDay,
      end: this.state.selectedDay,
    };

    this.state.foods.push(nutritionObj);
    this.state.events.push(eventObj);

    logger.log('silly', 'Sending Food', {
      file: THISFILE,
      data: {
        foods: this.state.foods,
        events: this.state.events,
      },
    });

    ipcRenderer.send('update-profile-info', {
      data: {
        foods: JSON.stringify(this.state.foods),
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

  addFood(data) {
    console.log(data);
    logger.log('debug', 'Adding Food', {
      file: THISFILE,
      data: {
        data,
      },
    });

    if (data.nutritionName !== undefined) {
      this.setState({
        nutritionName: data.nutritionName || this.state.nutritionName,
        servings: data.servings || this.state.servings,
        foodsCGPS: caloriesGainedPerServing(data.nutritionName.text),
      });
    } else {
      this.setState({
        servings: data.servings || this.state.servings,
      });
    }
  }

  render() {
    return (
      <div>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Add Nutrition</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <span>Nutrition: </span>
              <RIESelect
                classEditing="editing"
                highlight
                value={this.state.nutritionName}
                options={this.state.selectOptions}
                change={this.addFood}
                classLoading="loading"
                propName="nutritionName"
              />
            </div>
            <div>
              <span>Date: </span>
              <span><DayPickerInput
                value={this.state.selectedDay}
                onChange={this.handleDayChange}
              /></span>
            </div>
            <div>
              <span>Servings: </span>
              <RIENumber
                classEditing="editing"
                highlight
                value={this.state.servings}
                propName="servings"
                change={this.addFood}
              />
            </div>
            <div>
              <span>Calories Per Serving: {this.state.foodsCGPS}/serving</span>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="primary" bsSize="large" block onClick={this.close}>Enter Nutrition</Button>
            <Button bsSize="large" block onClick={this.cancel}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
