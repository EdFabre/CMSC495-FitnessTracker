const bmiCalc = require('bmi-calc');

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

module.exports = {
  Fittrac,
};
