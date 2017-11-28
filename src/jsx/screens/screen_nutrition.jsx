/**
 * @Author: Fabre Ed
 * @Date:   2017-11-20T14:56:42-05:00
 * @Email:  edwidgefabre@gmail.com
 * @Filename: screen_nutrition.jsx
 * @Last modified by:   Fabre Ed
 * @Last modified time: 2017-11-21T17:27:36-05:00
 */

/* eslint-env browser */
import React from 'react';

// Class logger, managed by loggingManager.js
const logger = require('rekuire')('loggingManager.js').logger;
const THISFILE = require('path').basename(__filename).toUpperCase();

// TODO: Add some logging

export default class NutritionScreen extends React.Component {
  render() {
    return (<h1>Nutrition Screen</h1>);
  }
}
