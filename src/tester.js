/**
 * @Author: Fabre Ed
 * @Date:   2017-12-10T19:49:52-05:00
 * @Email:  edwidgefabre@gmail.com
 * @Filename: tester.js
 * @Last modified by:   Fabre Ed
 * @Last modified time: 2017-12-14T13:32:26-05:00
 */


/* eslint class-methods-use-this: ["error", { "exceptMethods": ["generateDailyCalsArray", "dateReviver", "isInArray", "getCalsGained", "getCalsBurned"] }] */
/* eslint max-len: ["error", { "code": 500 }] */

const exercises = '[{"name":"Running","date":"2017-12-16T17:07:00.000Z","duration":"60","cbpm":{"male":12,"female":14}},{"name":"Swimming","date":"2017-12-09T17:00:00.000Z","duration":"60","cbpm":{"male":9,"female":10}},{"name":"Running","date":"2017-12-09T23:34:08.000Z","duration":0,"cbpm":{"male":12,"female":14}},{"name":"Weight Lifting","date":"2017-12-09T17:00:00.000Z","duration":"30","cbpm":{"male":9,"female":10}},{"name":"Walking","date":"2017-12-10T00:08:42.000Z","duration":"60","cbpm":{"male":4,"female":5}},{"name":"Swimming","date":"2017-12-10T00:09:08.000Z","duration":"45","cbpm":{"male":9,"female":10}},{"name":"Running","date":"2017-12-10T03:53:11.000Z","duration":0,"cbpm":{"male":12,"female":14}},{"name":"Running","date":"2017-12-10T04:08:14.000Z","duration":0,"cbpm":{"male":12,"female":14}},{"name":"Running","date":"2017-12-10T04:09:11.000Z","duration":0,"cbpm":{"male":12,"female":14}},{"name":"Swimming","date":"2017-12-10T04:12:24.000Z","duration":0,"cbpm":{"male":9,"female":10}},{"name":"Running","date":"2017-12-10T04:12:46.000Z","duration":0,"cbpm":{"male":12,"female":14}},{"name":"Running","date":"2017-12-10T04:14:31.000Z","duration":0,"cbpm":{"male":12,"female":14}},{"name":"Running","date":"2017-12-09T17:00:00.000Z","duration":60,"cbpm":{"male":12,"female":14}},{"name":"Running","date":"2017-12-10T16:54:56.000Z","duration":60,"cbpm":{"male":12,"female":14}},{"name":"Running","date":"2017-12-10T16:55:03.000Z","duration":60,"cbpm":{"male":12,"female":14}},{"name":"Running","date":"2017-12-10T19:57:43.000Z","duration":60,"cbpm":{"male":12,"female":14}},{"name":"Running","date":"2017-12-10T20:29:32.000Z","duration":60,"cbpm":{"male":12,"female":14}},{"name":"Running","date":"2017-12-10T20:31:12.000Z","duration":60,"cbpm":{"male":12,"female":14}},{"name":"Running","date":"2017-12-10T20:33:49.812Z","duration":60,"cbpm":{"male":12,"female":14}}]';

const foods = '[{"name":"Tbone Steak","date":"2017-12-14T16:27:32.000Z","servings":1,"cgps":600},{"name":"Ceasar Salad","date":"2017-12-14T16:34:23.000Z","servings":1,"cgps":340},{"name":"Chicken(Grilled)","date":"2017-12-14T16:34:28.000Z","servings":"3","cgps":200},{"name":"Ceasar Salad","date":"2017-12-15T16:34:44.000Z","servings":1,"cgps":340},{"name":"Ceasar Salad","date":"2017-12-16T16:34:52.161Z","servings":1,"cgps":340}]';


class Calories {
  constructor(opts) {
    this.dailyCalories = [];
    this.caloriesIn = [];
    this.caloriesOut = [];
    this.gender = opts.gender;
    this.exercises = JSON.parse(opts.exercises, this.dateReviver);
    this.foods = JSON.parse(opts.foods, this.dateReviver);
    this.initDailyCals();
    this.generateCalsBurned();
    this.generateCalsGained();
  }

  dateReviver(key, value) {
    if (typeof value === 'string') {
      const a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(
        value);
      if (a) {
        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[
            5], +a[6]));
      }
    }
    return value;
  }

  initDailyCals() {
    const startDate = new Date();
    const endDate = new Date();

    startDate.setDate(startDate.getDate() - 90);
    endDate.setDate(endDate.getDate() + 90);

    this.generateDailyCalsArray(startDate, endDate);
    this.generateCalsBurned();
    this.generateCalsGained();
  }

  isInArray(array, value) {
    return !!array.find(item => item.getTime() === value.getTime());
  }

  getCalsBurned(opts) {
    return {
      male: opts.duration * opts.cbpm.male,
      female: opts.duration * opts.cbpm.female,
    };
  }

  getCalsGained(opts) {
    return opts.servings * opts.cgps;
  }

  update(opts) {
    this.gender = opts.gender || this.gender;
    this.exercises = opts.exercises || this.exercises;
    this.foods = opts.foods || this.foods;
  }

  updateCals() {
    for (let i = 0; i < this.dailyCalories.length; i++) {
      this.dailyCalories[i];
    }
  }

  generateCalsBurned() {
    const temp = this.exercises;
    const existingDates = [];

    const initDate = temp[0].date;
    initDate.setHours(0, 0, 0, 0);

    existingDates.push(initDate);
    this.caloriesOut.push({
      date: initDate,
      calsBurned: 0,
    });

    for (let i = 0; i < temp.length; i += 1) {
      const tempDate = temp[i].date;
      tempDate.setHours(0, 0, 0, 0);

      if (!this.isInArray(existingDates, tempDate)) {
        existingDates.push(tempDate);
        this.caloriesOut.push({
          date: tempDate,
          calsBurned: 0,
        });
      }

      for (let j = 0; j < this.caloriesOut.length; j += 1) {
        if (tempDate.getTime() === this.caloriesOut[j].date.getTime()) {
          const calories = this.getCalsBurned(temp[i]);
          if (this.gender === 'male') {
            this.caloriesOut[j].calsBurned += calories.male;
          } else {
            this.caloriesOut[j].calsBurned += calories.female;
          }
        }
      }
    }
  }

  generateCalsGained() {
    const temp = this.foods;
    const existingDates = [];

    const initDate = temp[0].date;
    initDate.setHours(0, 0, 0, 0);

    existingDates.push(initDate);
    this.caloriesOut.push({
      date: initDate,
      calsGained: 0,
    });

    for (let i = 0; i < temp.length; i += 1) {
      const tempDate = temp[i].date;
      tempDate.setHours(0, 0, 0, 0);

      if (!this.isInArray(existingDates, tempDate)) {
        existingDates.push(tempDate);
        this.caloriesOut.push({
          date: tempDate,
          calsGained: 0,
        });
      }

      for (let j = 0; j < this.caloriesOut.length; j += 1) {
        if (tempDate.getTime() === this.caloriesOut[j].date.getTime()) {
          const calories = this.getCalsGained(temp[i]);
          this.caloriesOut[j].calsGained += calories;
        }
      }
    }
  }

  print() {
    console.log({
      exercise: this.exercises.length,
      foods: this.foods.length,
      gender: this.gender,
      dailyCalories: this.dailyCalories,
      caloriesIn: this.caloriesIn,
      caloriesOut: this.caloriesOut,
    });
  }

  generateDailyCalsArray(start, end) {
    const dt = new Date(start);

    while (dt <= end) {
      this.dailyCalories.push({
        date: new Date(dt),
        calories: 0,
      });
      dt.setDate(dt.getDate() + 1);
    }
  }
}

const calories = new Calories({
  exercises,
  foods,
  gender: 'male',
});
calories.print();
//
// calories.update({
//   gender: 'female',
// });
// calories.print();
