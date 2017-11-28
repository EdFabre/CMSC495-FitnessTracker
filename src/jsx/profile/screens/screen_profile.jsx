/**
 * @Author: Fabre Ed
 * @Date:   2017-11-20T14:56:42-05:00
 * @Email:  edwidgefabre@gmail.com
 * @Filename: screen_profile.jsx
 * @Last modified by:   Fabre Ed
 * @Last modified time: 2017-11-21T17:30:17-05:00
 */

/* eslint-env browser */
import React from 'react';
import { ProgressBar } from 'react-bootstrap';
import { ipcRenderer } from 'electron';
import { RIEToggle, RIEInput, RIETextArea, RIENumber, RIETags, RIESelect } from 'riek';
import _ from 'lodash';

import ProfileImage from '../components/image_profile';

// Class logger, managed by loggingManager.js
const logger = require('rekuire')('loggingManager.js').logger;
const THISFILE = require('path').basename(__filename).toUpperCase();

const { Fittrac } = require('rekuire')('fittrac_logic');

export default class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.dataChanged = this.dataChanged.bind(this);
    this.state = {
      name: '',
      age: 0,
      weight: 0,
      height: 0,
      gender: '',
      phone: '',
      bmi: '',
      bmicolor: 'info',
    };
  }

  componentDidMount() {
    ipcRenderer.send('get-profile-info');
    ipcRenderer.on('profile-info-result', (event, data) => {
      if (data.profileExists) {
        logger.log('silly', 'Updating User Profile Info', {
          file: THISFILE,
          data: {
            data,
            props: this.props,
          },
        });
        this.initProfile(data.results);
      }
    });
  }

  initProfile(updates) {
    this.setState({
      name: `${updates.firstname} ${updates.lastname}`,
      age: updates.age,
      weight: updates.weight,
      height: updates.height,
      gender: updates.gender,
      phone: updates.phone,
    });
    this.calculateBMI(updates.weight, updates.height);
  }

  dataChanged(data) {
    logger.log('debug', 'User Updating Info', {
      file: THISFILE,
      data: {
        data,
      },
    });

    if (data.name === undefined) {
      ipcRenderer.send('update-profile-info', {
        data,
      });
    } else {
      const res = data.name.split(' ');
      ipcRenderer.send('update-profile-info', {
        firstname: res[0],
        lastname: res[1],
      });
    }

    this.setState({
      name: data.name || this.state.name,
      age: data.age || this.state.age,
      weight: data.weight || this.state.weight,
      height: data.height || this.state.height,
      gender: data.gender || this.state.gender,
      phone: data.phone || this.state.phone,
    });
    if (data.weight !== undefined) {
      this.calculateBMI(data.weight, this.state.height);
    }
    if (data.height !== undefined) {
      this.calculateBMI(this.state.weight, data.height);
    }
  }

  calculateBMI(inWeight, inHeight) {
    const x = new Fittrac();
    logger.log('info', 'Calculating BMI', {
      file: THISFILE,
      data: {
        weight: inWeight,
        height: inHeight,
      },
    });
    const data = x.calcBmi(inWeight, inHeight);
    switch (true) {
      case (data.value < 18.5):
        this.setState({
          bmi: data.value,
          bmicolor: 'warning',
        });
        break;
      case (data.value >= 18.5 && data.value < 25):
        this.setState({
          bmi: data.value,
          bmicolor: 'success',
        });
        break;
      case (data.value >= 25):
        this.setState({
          bmi: data.value,
          bmicolor: 'danger',
        });
        break;
      default:

    }
  }

  customValidateText(text) {
    return true;
  }

  render() {
    return (
      <div className="row">
        <div className="col-lg-6 col-sm-12">
          <div className="card hovercard">
            <div className="cardheader" />
            <div className="avatar">
              <ProfileImage />
            </div>
            <div className="info">
              <div className="title">
                <RIEInput
                  validate={this.customValidateText}
                  classEditing="editing"
                  value={this.state.name}
                  propName="name"
                  change={this.dataChanged}
                />
              </div>
              <div className="vitals">
                <div>
                  <span>Age: </span>
                  <RIENumber
                    classEditing="editing"
                    value={this.state.age}
                    propName="age"
                    change={this.dataChanged}
                  />
                </div>
                <div>
                  <span>Height: </span>
                  <RIENumber
                    validate={this.customValidateText}
                    classEditing="editing"
                    value={this.state.height}
                    propName="height"
                    change={this.dataChanged}
                  />
                </div>
                <div>
                  <span>Weight: </span>
                  <RIENumber
                    validate={this.customValidateText}
                    classEditing="editing"
                    value={this.state.weight}
                    propName="weight"
                    change={this.dataChanged}
                  />
                </div>
                <div>
                  <span>Gender: </span>
                  <RIEInput
                    validate={this.customValidateText}
                    classEditing="editing"
                    value={this.state.gender}
                    propName="gender"
                    change={this.dataChanged}
                  />
                </div>
                <div>
                  <span>Phone: </span>
                  <RIEInput
                    validate={this.customValidateText}
                    classEditing="editing"
                    value={this.state.phone}
                    propName="phone"
                    change={this.dataChanged}
                  />
                </div>
                <div>
                  <span>BMI</span>
                  <ProgressBar
                    active
                    bsStyle={this.state.bmicolor}
                    label={_.toString(this.state.bmi)}
                    now={_.toNumber(this.state.bmi)}
                  />
                </div>
              </div>
            </div>
            <div className="bottom" />
          </div>
        </div>
      </div>
    );
  }
}
