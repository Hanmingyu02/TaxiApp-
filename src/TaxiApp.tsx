import React, { JSX } from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';

function TaxiApp(): JSX.Element {
  console.log('--TaxiApp()');
  return (
    <SafeAreaView>
      <Text style={style.textBlack}>Hello React Native</Text>
      <Text style={style.textBlue}>Hello React Native</Text>
      <Text>start</Text>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  textBlack: {
    fontSize: 18,
    color: 'black',
  },
  textBlue: {
    fontSize: 18,
    color: 'blue',
  },
});

export default TaxiApp;
