/**
 * @Author: Fabre Ed
 * @Date:   2017-12-10T19:49:52-05:00
 * @Email:  edwidgefabre@gmail.com
 * @Filename: tester.js
 * @Last modified by:   Fabre Ed
 * @Last modified time: 2017-12-16T16:13:32-05:00
 */


const moment = require('moment');

function addDuration(day, duration, type) {
  return moment(day).add(duration, type).toDate();
}
const day = new Date();
console.log(addDuration(day, 30, 'm'));
