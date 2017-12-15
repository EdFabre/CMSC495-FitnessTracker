/**
 * @Author: Fabre Ed
 * @Date:   2017-12-10T19:49:52-05:00
 * @Email:  edwidgefabre@gmail.com
 * @Filename: tester.js
 * @Last modified by:   Fabre Ed
 * @Last modified time: 2017-12-14T20:45:03-05:00
 */


/* eslint class-methods-use-this: ["error", { "exceptMethods": ["compareDates", "generateDailyCalsArray", "dateReviver", "isInArray", "getCalsGained", "getCalsBurned"] }] */
/* eslint max-len: ["error", { "code": 500 }] */

const { Calories } = require('rekuire')('fittrac_logic');


const exercises = '[{"name":"Running","date":"2017-12-16T17:07:00.000Z","duration":"60","cbpm":{"male":12,"female":14}},{"name":"Swimming","date":"2017-12-09T17:00:00.000Z","duration":"60","cbpm":{"male":9,"female":10}},{"name":"Running","date":"2017-12-09T23:34:08.000Z","duration":0,"cbpm":{"male":12,"female":14}},{"name":"Weight Lifting","date":"2017-12-09T17:00:00.000Z","duration":"30","cbpm":{"male":9,"female":10}},{"name":"Walking","date":"2017-12-10T00:08:42.000Z","duration":"60","cbpm":{"male":4,"female":5}},{"name":"Swimming","date":"2017-12-10T00:09:08.000Z","duration":"45","cbpm":{"male":9,"female":10}},{"name":"Running","date":"2017-12-10T03:53:11.000Z","duration":0,"cbpm":{"male":12,"female":14}},{"name":"Running","date":"2017-12-10T04:08:14.000Z","duration":0,"cbpm":{"male":12,"female":14}},{"name":"Running","date":"2017-12-10T04:09:11.000Z","duration":0,"cbpm":{"male":12,"female":14}},{"name":"Swimming","date":"2017-12-10T04:12:24.000Z","duration":0,"cbpm":{"male":9,"female":10}},{"name":"Running","date":"2017-12-10T04:12:46.000Z","duration":0,"cbpm":{"male":12,"female":14}},{"name":"Running","date":"2017-12-10T04:14:31.000Z","duration":0,"cbpm":{"male":12,"female":14}},{"name":"Running","date":"2017-12-09T17:00:00.000Z","duration":60,"cbpm":{"male":12,"female":14}},{"name":"Running","date":"2017-12-10T16:54:56.000Z","duration":60,"cbpm":{"male":12,"female":14}},{"name":"Running","date":"2017-12-10T16:55:03.000Z","duration":60,"cbpm":{"male":12,"female":14}},{"name":"Running","date":"2017-12-10T19:57:43.000Z","duration":60,"cbpm":{"male":12,"female":14}},{"name":"Running","date":"2017-12-10T20:29:32.000Z","duration":60,"cbpm":{"male":12,"female":14}},{"name":"Running","date":"2017-12-10T20:31:12.000Z","duration":60,"cbpm":{"male":12,"female":14}},{"name":"Running","date":"2017-12-10T20:33:49.812Z","duration":60,"cbpm":{"male":12,"female":14}}]';

const foods = '[{"name":"Tbone Steak","date":"2017-12-14T16:27:32.000Z","servings":1,"cgps":600},{"name":"Ceasar Salad","date":"2017-12-14T16:34:23.000Z","servings":1,"cgps":340},{"name":"Chicken(Grilled)","date":"2017-12-14T16:34:28.000Z","servings":"3","cgps":200},{"name":"Ceasar Salad","date":"2017-12-15T16:34:44.000Z","servings":1,"cgps":340},{"name":"Ceasar Salad","date":"2017-12-16T16:34:52.161Z","servings":1,"cgps":340}]';


const calories = new Calories({
  exercises,
  foods,
  gender: 'female',
});

console.log(calories.getDaysStats(new Date()));
