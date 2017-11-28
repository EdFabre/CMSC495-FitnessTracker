/**
 * @Author: Fabre Ed
 * @Date:   2017-11-20T14:56:42-05:00
 * @Email:  edwidgefabre@gmail.com
 * @Filename: screen_calendar.jsx
 * @Last modified by:   Fabre Ed
 * @Last modified time: 2017-11-21T17:23:41-05:00
 */

/* eslint-env browser */
import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import events from '../data/events';

// Class logger, managed by loggingManager.js
const logger = require('rekuire')('loggingManager.js').logger;
const THISFILE = require('path').basename(__filename).toUpperCase();

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
BigCalendar.momentLocalizer(moment);
const allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k]);

export default class ImageProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      events,
    };
  }
  //
  // onChange(date) {
  //   this.setState({
  //     date,
  //   });
  // }
  render() {
    return (<BigCalendar
      {...this.props}
      events={this.state.events}
      views={allViews}
      step={60}
      style={{
        height: '500px',
      }}
      defaultDate={this.state.date}
    />);
  }
}
