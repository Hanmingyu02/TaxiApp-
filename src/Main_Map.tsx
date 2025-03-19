import React, { useState, useRef, useEffect } from 'react'; // 🔄 `Component, JSX` 제거, `useEffect` 추가
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import api from './API';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, ParamListBase } from '@react-navigation/native';

function Main_Map() {
  console.log('--Main_Map()');

  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  const callTaxi = async () => {
    const userId = (await AsyncStorage.getItem('userId')) || '';
    const startAddr = autoComplete1.current?.getAddressText() || '';
    const endAddr = autoComplete2.current?.getAddressText() || '';

    const startLat = `${marker1?.latitude || 0}`;
    const startLng = `${marker1?.longitude || 0}`;
    const endLat = `${marker2?.latitude || 0}`;
    const endLng = `${marker2?.longitude || 0}`;

    if (!startAddr || !endAddr) {
      Alert.alert('알림', '출발지/도착지가 모두 입력되어야 합니다', [
        { text: '확인', style: 'cancel' },
      ]);
      return;
    }

    try {
      const response = await api.call(userId, startLat, startLng, startAddr, endLat, endLng, endAddr);
      const { code, message } = response.data[0];
      const title = code === 0 ? '알림' : '오류';
      if (code === 0) {
        navigation.navigate('Main_List');
      }
      Alert.alert(title, message, [{ text: '확인', style: 'cancel' }]);
    } catch (err) {
      console.log('API call error:', JSON.stringify(err));
    }
  };

  const [loading, setLoading] = useState(false);
  const [selectedLatLng, setSelectedLatLng] = useState(null); // 🔄 초기값 `null`로 변경
  const [selectedAddress, setSelectedAddress] = useState('');

  const mapRef = useRef(null);
  const autoComplete1 = useRef(null);
  const autoComplete2 = useRef(null);

  const [initialRegion, setInitialRegion] = useState({
    latitude: 37.5666612,
    longitude: 126.9783785,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [showBtn, setShowBtn] = useState(false);

  const handleLongPress = async (event: any) => {
    const { coordinate } = event.nativeEvent;
    console.log('Long press coordinate:', coordinate); // 🔄 디버깅 로그

    setSelectedLatLng(coordinate); // 클릭한 위치 저장
    setLoading(true);

    try {
      const response = await api.geoCoding(coordinate, query.key);
      console.log('Geocoding response:', response.data); // 🔄 디버깅 로그

      // 응답 검증
      if (response.data.status !== 'OK' || !response.data.results || response.data.results.length === 0) {
        throw new Error('Geocoding failed: ' + (response.data.status || 'No results'));
      }

      const address = response.data.results[0].formatted_address;
      setSelectedAddress(address);
      setShowBtn(true);
    } catch (err) {
      console.log('Geocoding error:', err.message); // 🔄 에러 로그 개선
      if (err.response) {
        console.log('Error response:', err.response.data);
        console.log('Status:', err.response.status);
      } else if (err.request) {
        console.log('Error request:', err.request);
      }
      // API 호출 실패 시에도 버튼 표시 (주소는 "알 수 없음"으로 설정)
      setSelectedAddress('알 수 없는 위치');
      setShowBtn(true);
      Alert.alert('오류', '주소를 가져오는데 실패했습니다. 위치를 수동으로 설정해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMarker = (title: string) => {
    if (selectedLatLng) { // 🔄 `selectedAddress` 대신 `selectedLatLng` 확인
      if (title === '출발지') {
        setMarker1(selectedLatLng);
        if (autoComplete1.current) {
          autoComplete1.current.setAddressText(selectedAddress || '알 수 없는 위치');
        }
      } else if (title === '도착지') {
        setMarker2(selectedLatLng);
        if (autoComplete2.current) {
          autoComplete2.current.setAddressText(selectedAddress || '알 수 없는 위치');
        }
      }
      setShowBtn(false);
      setSelectedLatLng(null); // 🔄 임시 마커 제거
    }
  };

  const query = { // 🔄 `let` → `const`
    key: 'AIzaSyD1wDTxRSQK2lkPbH9fVcrAdGGK5f8Eq8I', // 실제 API 키로 확인 필요
    language: 'ko',
    components: 'country:kr',
  };

  const [marker1, setMarker1] = useState(null); // 🔄 초기값 `null`로 변경
  const [marker2, setMarker2] = useState(null); // 🔄 초기값 `null`로 변경

  const onSelectAddr = (data: any, details: any, type: string) => {
    if (details) {
      const lat = details.geometry.location.lat;
      const lng = details.geometry.location.lng;
      console.log(`Selected ${type}:`, lat, lng); // 🔄 디버깅 로그 추가

      if (type === 'start') {
        setMarker1({ latitude: lat, longitude: lng });
        if (!marker2) {
          setInitialRegion({
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.0073,
            longitudeDelta: 0.0064,
          });
        }
      } else {
        setMarker2({ latitude: lat, longitude: lng });
        if (!marker1) {
          setInitialRegion({
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.0073,
            longitudeDelta: 0.0064,
          });
        }
      }
    }
  };

  const fitToMarkers = () => {
    if (mapRef.current && marker1 && marker2) {
      mapRef.current.fitToCoordinates([marker1, marker2], {
        edgePadding: { top: 120, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  };

  const setMyLocation = () => {
    setLoading(true);
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const coords = { latitude, longitude };
        setMarker1(coords);
        setInitialRegion({ // 🔄 불필요한 중간 상태 제거
          latitude,
          longitude,
          latitudeDelta: 0.0073,
          longitudeDelta: 0.0064,
        });

        api
          .geoCoding(coords, query.key)
          .then(response => {
            if (response.data.status !== 'OK' || !response.data.results || response.data.results.length === 0) {
              throw new Error('Geocoding failed: ' + (response.data.status || 'No results'));
            }
            const addr = response.data.results[0].formatted_address;
            if (autoComplete1.current) {
              autoComplete1.current.setAddressText(addr);
            }
          })
          .catch(err => {
            console.log('Geocoding error:', err.message);
            Alert.alert('오류', '현재 위치의 주소를 가져오는데 실패했습니다.');
          })
          .finally(() => {
            setLoading(false);
          });
      },
      error => {
        setLoading(false);
        console.log('Geolocation error:', JSON.stringify(error));
        Alert.alert('오류', '현재 위치를 가져오는데 실패했습니다.');
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 1000 },
    );
  };

  // 🔄 useEffect로 마커 변경 시 지도 조정
  useEffect(() => {
    if (marker1 && marker2) {
      fitToMarkers();
    }
  }, [marker1, marker2]);

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map} // 🔄 스타일 분리
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion} // 🔄 `region` → `initialRegion`
        onLongPress={handleLongPress}
        onPress={() => {
          setShowBtn(false);
          setSelectedLatLng(null); // 🔄 지도 클릭 시 임시 마커 제거
        }}
      >
        {marker1 && <Marker coordinate={marker1} title="출발 위치" />}
        {marker2 && <Marker coordinate={marker2} title="도착 위치" pinColor="blue" />}
        {selectedLatLng && ( // 🔄 롱프레스 시 임시 마커 표시
          <Marker
            coordinate={selectedLatLng}
            title="선택한 위치"
            pinColor="green"
          />
        )}
        {marker1 && marker2 && (
          <Polyline
            coordinates={[marker1, marker2]}
            strokeColor="blue"
            strokeWidth={3}
          />
        )}
      </MapView>

      <View style={styles.overlay}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInput}>
            <GooglePlacesAutocomplete
              ref={autoComplete1}
              onPress={(data, details) => onSelectAddr(data, details, 'start')}
              minLength={2}
              placeholder="출발지 검색"
              query={query}
              keyboardShouldPersistTaps="handled"
              fetchDetails={true}
              enablePoweredByContainer={false}
              onFail={error => console.log('Autocomplete fail:', error)}
              onNotFound={() => console.log('No result found')}
              styles={autocompleteStyles} // 🔄 `{{autocompleteStyles}}` → `autocompleteStyles`
              predefinedPlaces={[]}
              textInputProps={{
                onFocus: () => console.log('출발지 검색창에 포커스되었습니다.'),
              }}
            />
          </View>
          <View style={styles.searchInput}>
            <GooglePlacesAutocomplete
              ref={autoComplete2}
              onPress={(data, details) => onSelectAddr(data, details, 'end')}
              minLength={2}
              placeholder="도착지 검색"
              query={query}
              keyboardShouldPersistTaps="handled"
              fetchDetails={true}
              enablePoweredByContainer={false}
              onFail={error => console.log('Autocomplete fail:', error)}
              onNotFound={() => console.log('No result found')}
              styles={autocompleteStyles} // 🔄 `{{autocompleteStyles}}` → `autocompleteStyles`
              predefinedPlaces={[]}
              textInputProps={{
                onFocus: () => console.log('도착지 검색창에 포커스되었습니다.'),
              }}
            />
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.callButton}
        onPress={callTaxi}
      >
        <Text style={styles.buttonText}>호출</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.locationButton}
        onPress={setMyLocation}
      >
        <Icon name="crosshairs" size={40} color="#3498db" />
      </TouchableOpacity>

      {showBtn && (
        <View style={styles.markerButtonContainer}>
          <TouchableOpacity
            style={styles.markerButton}
            onPress={() => handleAddMarker('출발지')}
          >
            <Text style={styles.buttonText}>출발지로 등록</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.markerButton}
            onPress={() => handleAddMarker('도착지')}
          >
            <Text style={styles.buttonText}>도착지로 등록</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal transparent={true} visible={loading}>
        <View style={styles.modalContainer}>
          <Icon name="spinner" size={50} color="blue" />
          <Text style={styles.modalText}>Loading...</Text>
        </View>
      </Modal>
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
  },
  map: { // 🔄 새로 추가: `MapView` 전용 스타일
    flex: 1,
  },
  overlay: { // 🔄 새로 추가: 오버레이 뷰 스타일
    position: 'absolute',
    width: '100%',
    height: '100%',
    padding: 10,
  },
  searchContainer: { // 🔄 새로 추가: 검색창 컨테이너 스타일
    position: 'absolute',
    padding: wp(2),
    top:50
  },
  searchInput: { // 🔄 새로 추가: 개별 검색 입력 스타일
    width: wp(75),
    marginBottom: 10,
  },
  callButton: { // 🔄 새로 추가: 호출 버튼 스타일
    position: 'absolute',
    width: wp(18),
    top: 60,
    right: wp(2),
    height: 90,
    justifyContent: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  locationButton: { // 🔄 새로 추가: 위치 버튼 스타일
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  markerButtonContainer: { // 🔄 새로 추가: 마커 버튼 컨테이너 스타일
    position: 'absolute',
    top: hp(50) - 45,
    left: wp(50) - 45,
    height: 90,
    width: 150,
  },
  markerButton: { // 🔄 새로 추가: 마커 버튼 스타일
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 1,
    flex: 1,
    justifyContent: 'center',
  },
  modalContainer: { // 🔄 새로 추가: 모달 스타일
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalText: { // 🔄 새로 추가: 모달 텍스트 스타일
    backgroundColor: 'white',
    color: 'black',
    height: 20,
    textAlign: 'center',
    padding: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Main_Map;