"use strict";

const Homey = require("homey");

class SonoffPow extends Homey.Device {
  onInit() {
    this.log("Sonoff Pow has been inited");
    this.handleStateChange = this.handleStateChange.bind(this);
    this.driver = this.getDriver();
    this.data = this.getData();
    this.registerStateChangeListener();
    this.registerCapabilities();
  }

  registerCapabilities() {
    const { triggers } = this.driver;
    this.registerToggle("onoff");
  }

  handleStateChange(device) {
    if (device.params) {
      if (device.params.switch == "on") this.updateCapabilityValue("onoff", true);
      if (device.params.switch == "off") this.updateCapabilityValue("onoff", false);
      if (device.params.power) this.updateCapabilityValue("measure_power", parseFloat(device.params.power));
      if (device.params.voltage) this.updateCapabilityValue("measure_voltage", parseFloat(device.params.voltage));
      if (device.params.current) this.updateCapabilityValue("meter_power", parseFloat(device.params.current));
    }
  }

  updateCapabilityValue(name, value, trigger) {
    if (this.getCapabilityValue(name) != value) {
      this.setCapabilityValue(name, value)
        .then(() => {
          this.log("[" + this.data.deviceid + "]" + " [" + name + "] [" + value + "] Capability successfully updated");
        })
        .catch(error => {
          this.log("[" + this.data.deviceid + "]" + " [" + name + "] [" + value + "] Capability not updated because there are errors: " + error.message);
        });
    }
  }

  registerToggle(name, trigger) {
    let data = {
      deviceid: this.data.deviceid,
      apikey: this.data.apikey
    };
    this.registerCapabilityListener(name, async value => {
      Homey.app.ewelinkApi.setPowerState(data, value);
    });
  }

  registerStateChangeListener() {
    Homey.app.ewelinkApi.on(this.data.deviceid, this.handleStateChange);
  }

  unregisterStateChangeListener() {
    Homey.app.ewelinkApi.removeListener(this.data.deviceid, this.handleStateChange);
  }

  onDeleted() {
    this.unregisterStateChangeListener();
    this.log("Device deleted");
  }
}

module.exports = SonoffPow;
