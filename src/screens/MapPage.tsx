import React, {
  useEffect,
  useState,
  useContext,
  useLayoutEffect,
  useRef, // ✅ added
} from 'react';
import { UserContext } from '../context/user.context';
import { useNavigation } from '@react-navigation/native';
import {
  Text,
  View,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';

import MapView, { Region } from 'react-native-maps';
import ChargerMarker from '../components/ChargerInfo';
import { ConfigData } from '../data/config';
import NavBar from '../components/Navbar';
import SearchModal from '../components/SearchModal';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';

const config = ConfigData();
const url = `https://evat.vt2.app/api/navigation/getchargersnode`;

const MapPage = () => {
  const mapRef = useRef<MapView>(null); // ✅ map reference for centering
  const [region, setRegion] = useState<Region | null>(null);
  const [error, setError] = useState<boolean | null>(null);
  const [chargers, setChargers] = useState<Object | null>(null);
  const [searchWindow, setSearchWindow] = useState<Boolean | false>(false);
  const { user, setUser } = useContext(UserContext);
  const [selectedCharger, setSelectedCharger] = useState<{ latitude: number; longitude: number } | null>(null);

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={{ color: 'white', marginRight: 15 }} onPress={() =>
          Alert.alert("User Information", `User: ${user?.fullName}\nEmail: ${user?.email}\nRole: ${user?.role}`)
        }>
          {user.fullName}
        </Text>
      ),
    });
  }, [navigation]);

  const searchFunction = () => setSearchWindow(true);
  const settingsFunction = () => console.log('Settings Function Called');

  const getChargers = async (location: {}, distance: number) => {
    try {
      const response = await fetch(`${url}?lat=${location.latitude}&lon=${location.longitude}&distance=10000`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (response.ok) setChargers(data.data);
      else console.log("Response not ok");
    } catch (error) {
      console.log("Error with get chargers");
    }
  };

  useEffect(() => {
    const startWatchingLocation = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          setError(true);
          return;
        }
      }

      const watchId = Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newRegion = {
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          setRegion(newRegion);

          // ✅ Auto-center map
          if (mapRef.current) {
            mapRef.current.animateToRegion(newRegion, 1000);
          }
        },
        (err) => {
          console.log("Location error:", err);
          setError(true);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 10,
          interval: 5000,
          fastestInterval: 2000,
        }
      );

      return () => {
        Geolocation.clearWatch(watchId);
      };
    };

    startWatchingLocation();
  }, []);

  useEffect(() => {
    if (region) getChargers(region, 30000);
  }, [region]);

  if (!region) {
    console.log("Region Null");
    return null;
  }

  return (
    <View style={styles.container}>
      <SearchModal visible={searchWindow} onClose={() => setSearchWindow(false)} />
      <MapView
        ref={mapRef} // ✅ attach ref to MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
      >
        {chargers && chargers.map((charger, idx) => (
          <ChargerMarker
            key={`${idx}`}
            charger={charger}
            onPress={(location) => setSelectedCharger(location)}
          />
        ))}

        {selectedCharger && (
          <MapViewDirections
            origin={{ latitude: region.latitude, longitude: region.longitude }}
            destination={selectedCharger}
            apikey={"AIzaSyDCzcXBa_XmfVjGsapneInLFHruLdEit28"}
            strokeWidth={6}
            strokeColor="blue"
            onReady={result => {
              console.log(`Route found. Distance: ${result.distance} km, Duration: ${result.duration} min`);
            }}
            onError={errorMessage => {
              console.error("Directions error:", errorMessage);
            }}
          />
        )}
      </MapView>

      <NavBar searchFunction={searchFunction} settingsFunction={settingsFunction} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
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
});

export default MapPage;
