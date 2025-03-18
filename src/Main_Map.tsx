import React, {Component, JSX} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useState} from 'react';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

function Main_Map(): JSX.Element {
  console.log('--Main_Map()');

  const [initalRegion, setInitialRegion] = useState({
    latitude: 37.5666612,
    longitude: 126.9783785,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [showBtn, setShowBtn] = useState(false);

  const handleLongPress = async (event: any) => {
    setShowBtn(true);
  };
  const handleAddMarker = (title: string) => {
    setShowBtn(false);
  };

  let query = {
    key: 'AIzaSyD1wDTxRSQK2lkPbH9fVcrAdGGK5f8Eq8I',
    language: 'ko',
    components: 'country:kr',
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 지도 */}
      <MapView
        style={styles.container}
        provider={PROVIDER_GOOGLE}
        region={initalRegion}></MapView>

      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          padding: 10,
        }}>
        <View style={{position: 'absolute', padding: wp(2)}}>
          {/* <View style={{width: wp(75)}}>
            <GooglePlacesAutocomplete
              minLength={2}
              placeholder="출발지 검색"
              query={query}
              keyboardShouldPersistTaps={'handled'}
              fetchDetails={true}
              enablePoweredByContainer={false}
              onFail={error => console.log(error)}
              onNotFound={() => console.log('no result')}
              styles={autocompleteStyles}
            />
          </View>
          <View style={{width: wp(75)}}>
            <GooglePlacesAutocomplete
              minLength={2}
              placeholder="도착지 검색"
              query={query}
              keyboardShouldPersistTaps={'handled'}
              fetchDetails={true}
              enablePoweredByContainer={false}
              onFail={error => console.log(error)}
              onNotFound={() => console.log('no result')}
              styles={autocompleteStyles}
            />
          </View> */}
        </View>
      </View>
      <TouchableOpacity
        style={[
          styles.button,
          {
            position: 'absolute',
            width: wp(18),
            top: wp(2),
            right: wp(2),
            height: 90,
            justifyContent: 'center',
          },
        ]}>
          <Text style={styles.buttonText}>호출</Text>
        </TouchableOpacity>
      {/* 내 위치 */}
      <TouchableOpacity style={[{position: 'absolute', bottom: 20, right: 20}]}>
        <Icon name="crosshairs" size={40} color={'#3498db'} />
      </TouchableOpacity>

      {showBtn && (
        <View
          style={{
            position: 'absolute',
            top: hp(50) - 45,
            left: wp(50) - 45,
            height: 90,
            width: 150,
          }}>
          <TouchableOpacity
            style={[styles.button, {flex: 1, marginVertical: 1}]}
            onPress={() => handleAddMarker('출발지')}>
            <Text style={styles.buttonText}>출발지로 등록</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, {flex: 1, marginVertical: 1}]}
            onPress={() => handleAddMarker('도착지')}>
            <Text style={styles.buttonText}>도착지로 등록</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const autocompleteStyles = StyleSheet.create({
  textInputContainer: {
    width: '100%',
    backgroundColor: '#e9e9e9',
    borderRadius: 8,
    height: 40,
  },
  textInput: {
    height: 40,
    color: '#5d5d5d',
    fontSize: 16,
  },
  predefinedPlacesDescription: {
    color: '#1faadb',
    zIndex: 1,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonDisable: {
    backgroundColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderWidth: 2,
    borderColor: 'gray',
    marginVertical: 1,
    padding: 10,
  },
});

export default Main_Map;
