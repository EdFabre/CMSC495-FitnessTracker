/**
 * @Author: Fabre Ed
 * @Date:   2017-11-20T14:56:42-05:00
 * @Email:  edwidgefabre@gmail.com
 * @Filename: screen_calendar.jsx
 * @Last modified by:   Fabre Ed
 * @Last modified time: 2017-12-10T15:29:03-05:00
 */

/* eslint-env browser */
import React from 'react';
import BigCalendar from 'react-big-calendar';
import { ipcRenderer } from 'electron';
import moment from 'moment';
// import events from '../data/events';

// Class logger, managed by loggingManager.js
const logger = require('rekuire')('loggingManager.js').logger;
const THISFILE = require('path').basename(__filename).toUpperCase();

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
BigCalendar.momentLocalizer(moment);

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


export default class CalendarScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      events: [],
    };
  }

  componentDidMount() {
    ipcRenderer.send('get-profile-info');
    ipcRenderer.on('profile-info-result', (event, data) => {
      if (data.profileExists) {
        logger.log('silly', 'Updating User Calendar Info', {
          file: THISFILE,
          data: {
            data,
            props: this.props,
          },
        });
        this.initCalendar(data.results);
      }
    });
  }

  initCalendar(updates) {
    this.setState({
      events: JSON.parse(updates.events, dateReviver),
    });
  }
  //
  // onChange(date) {
  //   this.setState({
  //     date,
  //   });
  // }
  render() {
    return (
      <BigCalendar
        {...this.props}
        popup
        events={this.state.events}
        step={60}
        style={{
          height: '500px',
        }}
        defaultDate={this.state.date}
      />
    );
  }
}
