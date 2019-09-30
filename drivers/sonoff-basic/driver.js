"use strict";

const Homey = require("homey");
const model = "Sonoff";

class SonoffBasic extends Homey.Driver {
  onInit() {
    this.log("SonoffBasic has been inited");
  }

  onPairListDevices(data, callback) {
    Homey.app.ewelinkApi
      .getDevices(model)
      .then(devices => callback(null, this.deviceList(devices)))
      .catch(() => callback(Homey.__("pair.no_devices_found")));
  }

  deviceList(devices) {
    let sortDevices = [];
    console.log(JSON.stringify(devices));
    for (var device of devices) {
      let deviceList = {
        name: device.productModel + " " + device.name,
        data: {
          deviceid: device.deviceid,
          apikey: device.apikey,
          extra: device.extra.extra
        }
      };
      sortDevices.push(deviceList);
    }
    return sortDevices;
  }
}

module.exports = SonoffBasic;