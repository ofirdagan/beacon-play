import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import beaconService from './services/beacon.service';

export default class App extends Component {


  constructor(props) {
    super(props);
    this.state = {};
  }

  onBeaconDataChanged(beacon) {
    this.setState({beacon})
  }

  componentWillMount() {
    beaconService.start(this.onBeaconDataChanged.bind(this));
  }

  componentWillUnmount() {
    beaconService.stop();
  }

  render() {
    const {beacon} = this.state;
    const body = beacon ? JSON.stringify(beacon) : 'No Beacon Around...';
    return (
      <View style={s.container}>
        <Text>{body}</Text>
      </View>
    );
  }
}

const s = StyleSheet.create({
  container: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
});