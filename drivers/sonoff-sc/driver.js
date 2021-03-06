"use strict";

const Homey = require("homey");
const models = ["Sonoff SC"];

class SonoffSC extends Homey.Driver {
  async onPairListDevices(data, callback) {
    await Homey.app.ewelinkApi
      .getDevices()
      .then(devices => {
        callback(null, this.deviceList(devices.devicelist.filter(device => models.includes(device.productModel))));
      })
      .catch(error => callback(new Error(error)));
  }

  deviceList(devices) {
    let sortDevices = [];

    for (var device of devices) {
      let deviceList = {
        name: device.productModel + " " + device.name,
        data: {
          deviceid: device.deviceid,
          apikey: device.apikey,
          extra: device.extra.extra
        },
        settings: {
          brandName: device.brandName,
          model: device.productModel,
          ip: device.ip,
          mac: device.params.staMac,
          fwVersion: device.params.fwVersion,
          powerResponse: device.params.startup,
          networkLed: device.params.sledOnline,
          duration: device.params.pulse,
          durationLimit: parseFloat(device.params.pulseWidth / 1000)
        }
      };
      sortDevices.push(deviceList);
    }
    return sortDevices;
  }
}

module.exports = SonoffSC;
