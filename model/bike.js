const AVLeanCloud = require('../utils/av-live-query-weapp-min-leancloud');

class Bike extends AVLeanCloud.Object {
  get plateNumber() {
    return this.get('plateNumber');
  }
  set plateNumber(value) {
    this.set('plateNumber', value);
  }

  get passcode() {
    return this.get('passcode');
  }
  set passcode(value) {
    this.set('passcode', value);
  }
  get coordinate() {
    return this.get('coordinate');
  }
  set coordinate(value) {
    this.set('coordinate', value);
  }
}

AVLeanCloud.Object.register(Bike, 'Washroom');
module.exports = Bike;