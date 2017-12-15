/**
 * @Author: Fabre Ed
 * @Date:   2017-11-28T20:35:54-05:00
 * @Email:  edwidgefabre@gmail.com
 * @Filename: fittrac_logic.js
 * @Last modified by:   Fabre Ed
 * @Last modified time: 2017-12-14T21:46:19-05:00
 */


/* eslint class-methods-use-this: ["error", { "exceptMethods": ["compareDates", "generateDailyCalsArray", "dateReviver", "isInArray", "getCalsGained", "getCalsBurned"] }] */
/* eslint max-len: ["error", { "code": 500 }] */

const bmiCalc = require('bmi-calc');
const moment = require('moment');
const _ = require('lodash');

class Fittrac {
  constructor(useImperial) {
    if (useImperial !== undefined) {
      this.useImperial = useImperial;
    } else {
      this.useImperial = true;
    }
  }

  calcBmi(mass, heightInInches) {
    const result = bmiCalc(mass, heightInInches, this.useImperial);
    return {
      value: result.value.toFixed(2),
      message: result.name,
    };
  }
}

class Calories {
  constructor(opts) {
    this.dailyCalories = [];
    this.caloriesIn = [];
    this.caloriesOut = [];
    this.gender = opts.gender;
    this.exercises = JSON.parse(opts.exercises, this.dateReviver);
    this.foods = JSON.parse(opts.foods, this.dateReviver);
    this.initDailyCals();
  }

  getDaysStats(day) {
    for (let i = 0; i < this.dailyCalories.length; i += 1) {
      if (this.compareDates(this.dailyCalories[i].date, day)) {
        return this.dailyCalories[i];
      }
    }
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

    startDate.setDate(startDate.getDate() - 30);
    endDate.setDate(endDate.getDate() + 30);

    this.generateDailyCalsArray(startDate, endDate);
    this.generateCalsBurned();
    this.generateCalsGained();
    this.updateCals();
  }

  isInArray(array, value) {
    return !!array.find(item => item.getTime() === value.getTime());
  }

  getCalsBurned(opts) {
    return {
      male: _.parseInt(opts.duration) * _.parseInt(opts.cbpm.male),
      female: _.parseInt(opts.duration) * _.parseInt(opts.cbpm.female),
    };
  }

  getCalsGained(opts) {
    return _.parseInt(opts.servings) * _.parseInt(opts.cgps);
  }

  update(opts) {
    this.gender = opts.gender || this.gender;
    this.exercises = opts.exercises || this.exercises;
    this.foods = opts.foods || this.foods;
  }

  updateCals() {
    for (let i = 0; i < this.dailyCalories.length; i += 1) {
      for (let j = 0; j < this.caloriesIn.length; j += 1) {
        if (this.compareDates(this.dailyCalories[i].date, this.caloriesIn[
            j].date)) {
          this.dailyCalories[i].calories += this.caloriesIn[j].calsGained;
          this.dailyCalories[i].calsIn = this.caloriesIn[j].calsGained;
        }
      }
      for (let k = 0; k < this.caloriesOut.length; k += 1) {
        if (this.compareDates(this.dailyCalories[i].date, this.caloriesOut[
            k].date)) {
          this.dailyCalories[i].calories -= this.caloriesOut[k].calsBurned;
          this.dailyCalories[i].calsOut = this.caloriesOut[k].calsBurned;
        }
      }
    }
  }

  compareDates(date1, date2) {
    return moment(date1).isSame(date2, 'day');
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
    console.log(temp);
    const initDate = temp[0].date;
    initDate.setHours(0, 0, 0, 0);

    existingDates.push(initDate);
    this.caloriesIn.push({
      date: initDate,
      calsGained: 0,
    });

    for (let i = 0; i < temp.length; i += 1) {
      const tempDate = temp[i].date;
      tempDate.setHours(0, 0, 0, 0);

      if (!this.isInArray(existingDates, tempDate)) {
        existingDates.push(tempDate);
        this.caloriesIn.push({
          date: tempDate,
          calsGained: 0,
        });
      }

      for (let j = 0; j < this.caloriesIn.length; j += 1) {
        if (tempDate.getTime() === this.caloriesIn[j].date.getTime()) {
          const calories = this.getCalsGained(temp[i]);
          this.caloriesIn[j].calsGained += calories;
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
      const theDate = new Date(dt);
      theDate.setHours(0, 0, 0, 0);
      this.dailyCalories.push({
        date: theDate,
        calories: 0,
        calsIn: 0,
        calsOut: 0,
      });
      dt.setDate(dt.getDate() + 1);
    }
  }
}

module.exports = {
  Fittrac,
  Calories,
};
