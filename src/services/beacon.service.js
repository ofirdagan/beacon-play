import Beacons from 'react-native-beacons-manager';
import {DeviceEventEmitter} from 'react-native';
import NotificationService from './notifications.service';

class BeaconService {

  stop() {
    console.log('BEACONPLAY: BeaconService stop');
    Beacons.stopMonitoringForRegion();
    Beacons.stopRangingBeaconsInRegion();
    // Beacons.stopUpdatingLocation();
    DeviceEventEmitter.removeListener('regionDidEnter');
    DeviceEventEmitter.removeListener('regionDidExit');
  }


  start(onBeaconDataChanged) {
    console.log('BEACONPLAY: BeaconService start');
    this.onBeaconDataChanged = onBeaconDataChanged;
    const region1 = {
      identifier: 'JellyBeacon',
      uuid: 'ea435f59-57ca-539c-8ced-c026087857b1'
    };

    const region2 = {
      identifier: 'PBBeacon',
      uuid: 'b79cba56-8660-562b-84cd-c43c7bbaf261'
    };

    // Request for authorization
    Beacons.requestAlwaysAuthorization();
    Beacons.startMonitoringForRegion(region1);
    Beacons.startMonitoringForRegion(region2);
    Beacons.startRangingBeaconsInRegion(region1);
    Beacons.startRangingBeaconsInRegion(region2);
    Beacons.shouldDropEmptyRanges(true);
    // Beacons.startUpdatingLocation();

    // Listen for beacon changes
    const subscription = DeviceEventEmitter.addListener(
      'beaconsDidRange',
      (data) => {
        if (data.beacons.length > 0) {
          this.onBeaconDataChanged(data.beacons[0]);
        }
        // data.region - The current region
        // data.region.identifier
        // data.region.uuid

        // data.beacons - Array of all beacons inside a region
        //	in the following structure:
        //	  .uuid
        //	  .major - The major version of a beacon
        //	  .minor - The minor version of a beacon
        //	  .rssi - Signal strength: RSSI value (between -100 and 0)
        // 	  .proximity - Proximity value, can either be "unknown", "far", "near" or "immediate"
        //	  .accuracy - The accuracy of a beacon
      }
    );


    // monitoring:
    DeviceEventEmitter.addListener(
      'regionDidEnter',
      (data) => {
        console.log('BEACONPLAY: monitoring - regionDidEnter data: ', data);
        NotificationService.pushLocalNotification(`Beacon ${data.region} is near by.`);
      }
    );

    DeviceEventEmitter.addListener(
      'regionDidExit',
      ({ identifier, uuid, minor, major }) => {
        console.log('BEACONPLAY: monitoring - regionDidExit data: ', { identifier, uuid, minor, major });
        this.onBeaconDataChanged(null);
        NotificationService.pushLocalNotification(`Beacon ${uuid} is no longer near by.`);
      }
    );
  }

}

export default new BeaconService();
