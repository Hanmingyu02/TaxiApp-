import React, { JSX } from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';

function Resister(): JSX.Element {
  console.log('--TaxiApp()');
  return (
    <SafeAreaView>
      <Text style={style.textBlack}>Hello React Native</Text>
      <Text style={style.textBlue}>Resister</Text>
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

export default Resister;
