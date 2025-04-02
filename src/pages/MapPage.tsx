// declare const navigator: any;
import GetLocation from 'react-native-get-location'
import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Modal,
  Alert,
  Dimensions,
  Image
} from 'react-native';

import MapView, {Marker, Region} from 'react-native-maps';
import {ChargerInfo} from '../components/ChargerInfo';
import {ConfigData} from '../data/config';

const config = ConfigData();
const url = `${config.backend.ipAddress}:${config.backend.port}/api/station`

type GeolocationPosition = {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude?: number | null;
    altitudeAccuracy?: number | null;
    heading?: number | null;
    speed?: number | null;
  };
  timestamp: number;
};

type GeolocationPositionError = {
  code: number;
  message: string;
};

//dummy data
const chargerOptions = {
  charger: {
    title: "Charger 1",
    location: {
      latitude: -22.22222,
      longitude: 111.11111
    },
    details: "This is a dummy charger"
  }
}


const MapPage = () => {
  const [region, setRegion] = useState<Region | null>(null);
  const [error, setError] = useState<boolean | null>(null);
  const [chargers, setChargers] = useState<Object | null>(null);

  const getChargers = async (location: {}, distance: number) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({location, distance}),
      });

      const data = await response.json();
      if (response.ok) {
        // Handle successful get of chargers
        setChargers(data.chargers);
        //populate map with icons
      } else {
        // Handle get chargers error
        //alert user to error
        Alert.alert('Getting Chargers', 'Problem', [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
      }
    } catch (error) {
      Alert.alert('Getting Chargers', 'Problem', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
    }
  };



  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          locateUser();
          getChargers();
        }
      } else {
        locateUser();
        getChargers();
      }
    };


    const locateUser = () => {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 60000,
      })
        .then(location => {
          console.log(location);
          const {latitude, longitude} = location;
          setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        })
        .catch(error => {
          const { code, message } = error;
          console.log("Error with locate user")
          console.warn(code, message);
        })
    };

    requestLocationPermission();
  }, []);

  if (!region) {
    console.log("Region Null")
    return null;
  }

  return (
    <View style={styles.container}>
      <MapView
      style={styles.map}
        region={region}
        showsUserLocation={true} >
        <Marker
          key={1}
          coordinate={region}
          title="Test"
          description="This is a thing"
          image={require('../data/ev_charger_symbol.svg')}
        >
        </Marker>
      </MapView>

      {/* <Modal animationType="slide" style={{
        width: '90%',
        height: '90%' }}>
        <ChargerInfo options={chargerOptions} />
      </Modal> */}

    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   map: {
//     ...StyleSheet.absoluteFillObject,
//   },
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default MapPage;
