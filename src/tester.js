/**
 * @Author: Fabre Ed
 * @Date:   2017-12-10T19:49:52-05:00
 * @Email:  edwidgefabre@gmail.com
 * @Filename: tester.js
 * @Last modified by:   Fabre Ed
 * @Last modified time: 2017-12-10T20:33:33-05:00
 */

const excercises = '[{"name":"Running","date":"2017-12-16T17:07:00.000Z","duration":"60","cbpm":{"male":12,"female":14}},{"name":"Swimming","date":"2017-12-09T17:00:00.000Z","duration":"60","cbpm":{"male":9,"female":10}},{"name":"Running","date":"2017-12-09T23:34:08.000Z","duration":0,"cbpm":{"male":12,"female":14}},{"name":"Weight Lifting","date":"2017-12-09T17:00:00.000Z","duration":"30","cbpm":{"male":9,"female":10}},{"name":"Walking","date":"2017-12-10T00:08:42.000Z","duration":"60","cbpm":{"male":4,"female":5}},{"name":"Swimming","date":"2017-12-10T00:09:08.000Z","duration":"45","cbpm":{"male":9,"female":10}},{"name":"Running","date":"2017-12-10T03:53:11.000Z","duration":0,"cbpm":{"male":12,"female":14}},{"name":"Running","date":"2017-12-10T04:08:14.000Z","duration":0,"cbpm":{"male":12,"female":14}},{"name":"Running","date":"2017-12-10T04:09:11.000Z","duration":0,"cbpm":{"male":12,"female":14}},{"name":"Swimming","date":"2017-12-10T04:12:24.000Z","duration":0,"cbpm":{"male":9,"female":10}},{"name":"Running","date":"2017-12-10T04:12:46.000Z","duration":0,"cbpm":{"male":12,"female":14}},{"name":"Running","date":"2017-12-10T04:14:31.000Z","duration":0,"cbpm":{"male":12,"female":14}},{"name":"Running","date":"2017-12-09T17:00:00.000Z","duration":60,"cbpm":{"male":12,"female":14}},{"name":"Running","date":"2017-12-10T16:54:56.000Z","duration":60,"cbpm":{"male":12,"female":14}},{"name":"Running","date":"2017-12-10T16:55:03.000Z","duration":60,"cbpm":{"male":12,"female":14}},{"name":"Running","date":"2017-12-10T19:57:43.000Z","duration":60,"cbpm":{"male":12,"female":14}},{"name":"Running","date":"2017-12-10T20:29:32.000Z","duration":60,"cbpm":{"male":12,"female":14}},{"name":"Running","date":"2017-12-10T20:31:12.000Z","duration":60,"cbpm":{"male":12,"female":14}},{"name":"Running","date":"2017-12-10T20:33:49.812Z","duration":60,"cbpm":{"male":12,"female":14}}]';

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

function isInArray(array, value) {
  return !!array.find(item => item.getTime() == value.getTime());
}

function generateDailyCalories(opts) {
  const temp = JSON.parse(opts.excercises, dateReviver);
  console.log(temp);
  const dailyCalorie = [];
  const existingDates = [];

  const initDate = temp[0].date;
  initDate.setHours(0, 0, 0, 0);

  existingDates.push(initDate);
  dailyCalorie.push({
    date: initDate,
    calToDate: [],
  });

  for (let i = 0; i < temp.length; i++) {
    const tempDate = temp[i].date;
    tempDate.setHours(0, 0, 0, 0);

    if (!isInArray(existingDates, tempDate)) {
      existingDates.push(tempDate);
      dailyCalorie.push({
        date: tempDate,
        calToDate: [],
      });
    }

    for (let j = 0; j < dailyCalorie.length; j++) {
      if (tempDate.getTime() === dailyCalorie[j].date.getTime()) {
        dailyCalorie[j].calToDate.push();
      }
    }
  }
  return dailyCalorie;
}

console.log(generateDailyCalories({
  excercises,
}));
