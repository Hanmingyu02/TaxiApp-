import {JSX} from 'react';
import {StyleSheet, Text, SafeAreaView, TouchableOpacity} from 'react-native';
import {useNavigation, ParamListBase} from '@react-navigation/native';
import {
  HeaderStyleInterpolators,
  StackNavigationProp,
} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useFocusEffect} from '@react-navigation/native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Intro(): JSX.Element {
  console.log('--Into()');

  useFocusEffect(
    React.useCallback(() => {
      setTimeout( async () => {

        let userId = await AsyncStorage.getItem('userId');
        let isAutoLogin = userId ? true : false;

        if (isAutoLogin) {
          navigation.push('Main');
        } else {
          navigation.push('Login');
        }
      }, 2000);
    }, []),
  );

  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  const gotoLogin = () => {
    navigation.push('Login');
  };
  return (
    <SafeAreaView style={styles.container}>
      <Icon name="taxi" size={100} color={'#3498db'} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Intro;
