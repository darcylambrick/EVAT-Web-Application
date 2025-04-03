// declare const navigator: any;
import GetLocation from 'react-native-get-location'
import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Modal,
  Alert,
  Dimensions,
  Image,
  Button
} from 'react-native';

import MapView, { Marker, Region } from 'react-native-maps';
import { ChargerInfo } from '../components/ChargerInfo';
import { ConfigData } from '../data/config';
import NavBar from '../components/Navbar';

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

const dummyChargerLocations = [
  { latitude: -37.792024, longitude: 145.061820, title: "One", identifier: "1", description: "Paid charger: Tesla" },
  { latitude: -37.795098, longitude: 145.071813, title: "Two", identifier: "2", description: "Free charger: Type 2" },
  { latitude: -37.790100, longitude: 145.073513, title: "Three", identifier: "3", description: "Paid charger: Tesla" }
]


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
        body: JSON.stringify({ location, distance }),
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
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);
      }
    } catch (error) {
      Alert.alert('Getting Chargers', 'Problem', [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
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
        // locateUser();
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
          showsUserLocation={true}>
          {dummyChargerLocations.map((loc, i) => 
          <Marker
            key={i}
            identifier={loc.identifier}
            // onPress={() => setChargerInfo(chargerOptions)}
            coordinate={{latitude: loc.latitude, longitude: loc.longitude }}
            title={loc.title}
            description={loc.description}
            onPress={() => Alert.alert("Charger Info", loc.description)} >
          <Image source={require('../data/ev_charger_symbol.png')} style={styles.marker} />
        </Marker>)}
      </MapView>
      {/* <View style={styles.navbar}>
      </View> */}
      <NavBar/>
    </View >
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
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  marker: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  navbar: {
    width: Dimensions.get('window').width,
    height: 40,
    backgroundColor: 'red',
    position: 'absolute',
    bottom: 0,
  },
  // chargerButton: {
  //   width: 100,
  //   height: 50,
  //   borderRadius: 5,
  //   backgroundColor: 'red',
  // },
});

export default MapPage;
