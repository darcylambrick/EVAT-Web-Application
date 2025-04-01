declare const navigator: any;
import GetLocation from 'react-native-get-location'

console.log(GetLocation);

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

import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, PermissionsAndroid, Platform, Modal, Dimensions } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { ChargerInfo } from "../components/ChargerInfo"

const MapPage = () => {
  const [region, setRegion] = useState<Region | null>(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          locateUser();
        }
      } else {
        locateUser();
      }
    };


    const getChargers = async () => {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fullName, password, email }),
        });

        const data = await response.json();
        if (response.ok) {
          // Handle successful sign-up
          console.log('Sign-up successful', data);
          navigation.navigate('SignIn')
        } else {
          // Handle sign-up error
          console.log('Sign-up failed', data.message);
        }
      } catch (error) {
        console.error('Error signing up:', error);
      }
    };


    const locateUser = () => {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 60000,
      })
        .then(location => {
          console.log(location);
          const { latitude, longitude } = location;
          setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        })
        .catch(error => {
          const { code, message } = error;
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
        region={region}
        showsUserLocation={true} >
        <Marker
          key={1}
          coordinate={region}
          title="Test"
          description="This is a thing"
        />
      </MapView>

      <Modal animationType="slide" style={{
        width: '90%',
        height: '90%' }}>
        <ChargerInfo options={chargerOptions} />
      </Modal>

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
