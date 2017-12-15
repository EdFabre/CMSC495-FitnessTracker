/**
 * @Author: Fabre Ed
 * @Date:   2017-11-20T14:56:42-05:00
 * @Email:  edwidgefabre@gmail.com
 * @Filename: main.jsx
 * @Last modified by:   Fabre Ed
 * @Last modified time: 2017-12-14T19:43:30-05:00
 */

/* global document */
import React from 'react';
import ReactDOM from 'react-dom';
import Fader from 'react-fader';
import { PanelGroup, Panel, Tabs, Tab } from 'react-bootstrap';
import { ipcRenderer } from 'electron';

// These are the other screens used in the app.
import ProfileScreen from './profile/screens/screen_profile';
import CalendarScreen from './calendar/screens/screen_calendar';
import DashScreen from './dashboard/screens/screen_dash';
import ExcerciseScreen from './excercise/components/add_excercise';
import NutritionScreen from './nutrition/components/add_nutrition';
import LoginScreen from './authentication/screens/screen_auth';

// Class logger, managed by loggingManager.js
const logger = require('rekuire')('loggingManager.js').logger;
const THISFILE = require('path').basename(__filename).toUpperCase();

export default class PanelMain extends React.Component {
  constructor() {
    super();
    this.state = {
      key: 2,
    };
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {
    logger.log('silly', 'Mounting secondary panel', {
      file: THISFILE,
    });
    ReactDOM.render(
      <Fader><Panel style={{
        height: '500px',
      }}
      ><ProfileScreen /></Panel></Fader>,
      document.getElementById('secondpanelcontent'));
  }

  handleSelect(key) {
    this.setState({
      key,
    });

    switch (key) {
      case 1:
        ReactDOM.render(
          <Fader><Panel style={{
            height: '500px',
          }}
          ><DashScreen /></Panel></Fader>,
          document.getElementById('secondpanelcontent'));
        break;
      case 2:
        ReactDOM.render(
          <Fader><Panel style={{
            height: '500px',
          }}
          ><ProfileScreen /></Panel></Fader>,
          document.getElementById('secondpanelcontent'));
        break;
      case 3:
        ReactDOM.render(<Fader><Panel><CalendarScreen /></Panel></Fader>,
          document.getElementById(
            'secondpanelcontent'));
        break;
      case 4:
        this.setState({
          key: 3,
        });
        ReactDOM.render(<Fader><Panel><ExcerciseScreen /></Panel></Fader>,
          document.getElementById(
            'secondpanelcontent'));
        break;
      case 5:
        this.setState({
          key: 3,
        });
        ReactDOM.render(<Fader><Panel><NutritionScreen /></Panel></Fader>,
          document.getElementById(
            'secondpanelcontent'));
        break;
      case 6:
        ipcRenderer.send('logout-request', true);
        ipcRenderer.on('logout-result', (event, data) => {
          if (data.successfulLogout) {
            logger.log('silly', 'Logout Successful', {
              file: THISFILE,
              data: {
                data: data.results,
              },
            });
            ReactDOM.render(
              <Fader>
                <LoginScreen />
              </Fader>,
              document.getElementById('container'),
            );
          } else {
            logger.log('silly', 'Logout Failed', {
              file: THISFILE,
              data: {
                data: data.results,
              },
            });
          }
        });
        break;
      default:
    }
  }

  render() {
    return (
      <PanelGroup>
        <Panel>
          <Tabs
            bsStyle="pills"
            activeKey={this.state.key}
            onSelect={i => this.handleSelect(i)}
            id="main-nav"
            justified
          >
            <Tab eventKey={1} title="Dashboard" />
            <Tab eventKey={2} title="Profile" />
            <Tab eventKey={3} title="Schedule" />
            <Tab eventKey={4} title="Exercise" />
            <Tab eventKey={5} title="Nutrition" />
            <Tab eventKey={6} title="Logout" />
          </Tabs>
        </Panel>
        <Panel>
          <div id="secondpanelcontent" />
        </Panel>
      </PanelGroup>
    );
  }
}
