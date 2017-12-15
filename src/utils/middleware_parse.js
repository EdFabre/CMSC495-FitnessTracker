/**
 * @Author: Fabre Ed
 * @Date:   2017-11-20T09:51:33-05:00
 * @Email:  edwidgefabre@gmail.com
 * @Filename: parse.js
 * @Last modified by:   Fabre Ed
 * @Last modified time: 2017-12-14T20:47:37-05:00
 */

// Class logger, managed by loggingManager.js
const logger = require('rekuire')('loggingManager.js').logger;
const THISFILE = require('path').basename(__filename).toUpperCase();

// NPM Packages from www.npmjs.com
const Parse = require('parse/node');

// Config
const config = require('rekuire')('parse-server-config.json');

// Initialize and connect to parse server
Parse.initialize(config.appId);
Parse.serverURL = config.serverURL;
Parse.User.enableUnsafeCurrentUser();

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

class User {
  constructor(userInfo) {
    console.log(userInfo);
    this.initUserInfo(userInfo);
    logger.log('debug', 'New Parse User Object has been initialized.', {
      file: THISFILE,
      data: {
        userInfo: this.userInfo,
      },
    });
    this.user = new Parse.User();
    this.updateSessionToken(null);
    this.placeholder = null;
  }

  updateSessionToken(session) {
    this.sessionToken = session;
    // TODO: Should remove when done testing
    logger.log('debug', 'User Session has been updated.', {
      file: THISFILE,
      data: {
        session,
      },
    });
  }

  /**
   * This initializes the userInfo object for us. Also helps in setting up the
   * parse server's schema.
   *
   * @param  {[type]} userInfo [description]
   * @return {[type]}          [description]
   */
  initUserInfo(userInfo) {
    this.userInfo = {};
    this.userInfo.firstname = userInfo.firstname;
    this.userInfo.lastname = userInfo.lastname;
    this.userInfo.email = userInfo.email;
    this.userInfo.password = userInfo.password;
    this.userInfo.age = 18;
    this.userInfo.weight = 120;
    this.userInfo.height = 60;
    this.userInfo.gender = 'male';
    this.userInfo.phone = '555-555-5555';
    this.userInfo.image = 'http://res.cloudinary.com/cmsc495/image/upload/v1511299071/fittrac/profile_images/profile_default.png';
    this.userInfo.bmi = 23.4;
    this.userInfo.calgoal = 0;
    this.userInfo.events = '[]';
    this.userInfo.exercise = '[]';
    this.userInfo.foods = '[]';
  }

  updateUserInfo(userInfo) {
    console.log(userInfo);
    this.updateUserDoc('firstname', userInfo.data.firstname);
    this.updateUserDoc('lastname', userInfo.data.lastname);
    this.updateUserDoc('email', userInfo.data.email);
    this.updateUserDoc('password', userInfo.data.password);
    this.updateUserDoc('age', userInfo.data.age);
    this.updateUserDoc('weight', userInfo.data.weight);
    this.updateUserDoc('height', userInfo.data.height);
    this.updateUserDoc('gender', userInfo.data.gender);
    this.updateUserDoc('phone', userInfo.data.phone);
    this.updateUserDoc('image', userInfo.data.image);
    this.updateUserDoc('bmi', userInfo.data.bmi);
    this.updateUserDoc('calgoal', userInfo.data.calgoal);
    this.updateUserDoc('events', userInfo.data.events);
    this.updateUserDoc('exercise', userInfo.data.exercise);
    this.updateUserDoc('foods', userInfo.data.foods);
  }

  updateUserDoc(doc, newVal) {
    console.log(doc);
    console.log(newVal);
    if (newVal !== undefined) {
      logger.log('silly', 'Starting Parse Push', {
        file: THISFILE,
        data: {
          doc,
          newVal,
        },
      });
      this.userInfo[doc] = newVal;
      Parse.User.current().set(doc, newVal);
      Parse.User.current().save();
      logger.log('silly', 'Finished Parse Push', {
        file: THISFILE,
        data: {
          doc,
          newVal,
        },
      });
    }
  }

  signUp() {
    logger.log('debug', 'Signing up a new user', {
      file: THISFILE,
      data: {
        data: this.userInfo,
      },
    });
    return new Promise((resolve, reject) => {
      // Basic Info
      this.user.set('username', this.userInfo.email);
      this.user.set('password', this.userInfo.password);
      this.user.set('email', this.userInfo.email);

      // other fields can be set just like with Parse.Object
      this.user.set('firstname', capitalizeFirstLetter(this.userInfo
        .firstname));
      this.user.set('lastname', capitalizeFirstLetter(this.userInfo
        .lastname));

      // Defaults
      this.user.set('age', this.userInfo.age);
      this.user.set('weight', this.userInfo.weight);
      this.user.set('height', this.userInfo.height);
      this.user.set('gender', this.userInfo.gender);
      this.user.set('phone', this.userInfo.phone);
      this.user.set('image', this.userInfo.image);
      this.user.set('bmi', this.userInfo.bmi);
      this.user.set('calgoal', this.userInfo.calgoal);
      this.user.set('events', this.userInfo.events);
      this.user.set('exercise', this.userInfo.exercise);
      this.user.set('foods', this.userInfo.foods);

      // TODO: Add more fields to signup?
      this.user.signUp().then((results) => {
        this.updateSessionToken(this.user.getSessionToken());
        resolve({
          successfulSignup: true,
          results,
        });
      }, errors => reject({
        successfulSignup: false,
        results: errors,
      }));
    });
  }

  login() {
    logger.log('debug', 'Logging user into parse', {
      file: THISFILE,
      data: {
        data: this.userInfo,
      },
    });
    return new Promise((resolve, reject) => {
      Parse.User.logIn(this.userInfo.email, this.userInfo
        .password).then(
        (results) => {
          this.updateSessionToken(Parse.User.current()
            .getSessionToken());
          resolve({
            successfulLogin: true,
            results,
          });
        },
        errors => reject({
          successfulLogin: false,
          results: errors,
        }),
      );
    });
  }

  resetPassword() {
    return new Promise((resolve, reject) => {
      Parse.User.requestPasswordReset(this.userInfo.email).then(
        results => resolve(results),
        errors => reject(errors),
      );
    });
  }

  logout() {
    return new Promise((resolve, reject) => {
      logger.log('debug',
        `User with session ${this.sessionToken} logged out.`, {
          file: THISFILE,
        });
      Parse.User.logOut().then(
        resolve({
          successfulLogout: true,
        }),
        reject({
          successfulLogout: false,
        }),
      );
    });
  }

  getUserInfo() {
    return new Promise((resolve, reject) => {
      const session = this.sessionToken;
      const username = Parse.User.current().getUsername();
      const firstname = Parse.User.current().get('firstname');
      const lastname = Parse.User.current().get('lastname');
      const email = Parse.User.current().get('email');
      const phone = Parse.User.current().get('phone');
      const age = Parse.User.current().get('age');
      const gender = Parse.User.current().get('gender');
      const height = Parse.User.current().get('height');
      const weight = Parse.User.current().get('weight');
      const image = Parse.User.current().get('image');
      const bmi = Parse.User.current().get('bmi');
      const calgoal = Parse.User.current().get('calgoal');
      const events = Parse.User.current().get('events');
      const exercise = Parse.User.current().get('exercise');
      const foods = Parse.User.current().get('foods');

      logger.log('debug', 'Retrieving User Info', {
        file: THISFILE,
        data: {
          data: {
            session,
            username,
            firstname,
            lastname,
            email,
            phone,
            age,
            gender,
            height,
            weight,
            image,
            bmi,
            calgoal,
            events,
            exercise,
            foods,
          },
        },
      });
      resolve({
        session,
        username,
        firstname,
        lastname,
        email,
        phone,
        age,
        gender,
        height,
        weight,
        image,
        bmi,
        calgoal,
        events,
        exercise,
        foods,
      });
      if (session == null) {
        reject(false);
      }
    });
  }
}

module.exports = {
  User,
};
