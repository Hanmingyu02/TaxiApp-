import React, { JSX } from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';

function Main_List(): JSX.Element {
  console.log('--Main_List()');
  return (
    <SafeAreaView>
      <Text style={styles.textBlack}>Hello React Native</Text>
      <Text style={styles.textBlue}>Resister</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textBlack: {
    fontSize: 18,
    color: 'black',
  },
  textBlue: {
    fontSize: 18,
    color: 'blue',
  },
});

export default Main_List;
