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
  Image,
} from 'react-native';

import MapView, { Region } from 'react-native-maps';
import ChargerMarker from '../components/ChargerInfo';
import { ConfigData } from '../data/config';
import NavBar from '../components/Navbar';
import SearchModal from '../components/SearchModal';
import MapViewDirections from 'react-native-maps-directions';
import GetLocation from 'react-native-get-location';
import Geolocation from '@react-native-community/geolocation';

const config = ConfigData();


//set the mode of the application to either dev or prod
const mode = config.mode;
//set the backend URL based on the mode of the application
let url2 = config.backendURL(mode) + `/api/altChargers/nearby`


console.log("Mode: ", mode, ", URL: ", url2);

const MapPage = () => {
  const mapRef = useRef<MapView>(null); // ✅ map reference for centering
  const [region, setRegion] = useState<Region | null>(null);
  const [error, setError] = useState<boolean | null>(null);
  const [chargers, setChargers] = useState<Object | null>(null);
  const [searchWindow, setSearchWindow] = useState<Boolean | false>(false);
  const { user, setUser } = useContext(UserContext);
  const [selectedCharger, setSelectedCharger] = useState<{ latitude: number; longitude: number } | null>(null);

  const navigation = useNavigation()<any>;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={{ color: 'white', marginRight: 15 }} onPress={() => Alert.alert("User Information", `User: ${user?.fullName}\nEmail: ${user?.email}\nRole: ${user?.role}`)}>
          {user.fullName}
        </Text>
      ),
    });
  }, [navigation]);

  const searchFunction = () => setSearchWindow(true);
  const settingsFunction = () => console.log('Settings Function Called');


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


  //Sends request to backend to get chargers - function to work with the new backend endpoint
  const searchChargers = async (data) => {
    try {
      setSearchWindow(false);
      const response = await fetch(url2, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token.accessToken}`
        }
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("🔋 Charging Stations", `Found ${result.count} chargers`, [{ text: 'Ok', }]);
        setChargers(result.chargers);
        setSearchWindow(false);
      } else { console.log("Response not ok") }
    } catch (error) {
      console.log("Error with search chargers", error);
    }
  }

  const locateUser = async () => {
    try {
      const location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 60000,
      });

      const { latitude, longitude } = location;

      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (error) {
      console.log("Error locating user:", error);
    }
  };


  if (!region) {
    console.log("Region Null");
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image source={require('../data/loading-img.png')} style={styles.loadingImage} />
        <Text style={styles.loadingText}>Waiting for user location</Text>
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <SearchModal dataIn={region} onResults={searchChargers} visible={searchWindow} onClose={() => setSearchWindow(false)} />
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
            goToPressed={(location) => setSelectedCharger(location)}
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
              Alert.alert("Error", "Unable to find directions. Please try again later.");
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
  loadingImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
    // position: 'absolute',
    // top: Dimensions.get('window').height / 2 - 150,
  },
  loadingText: {
    backgroundColor: '#ffffff55',
    fontSize: 25,
  }



});

export default MapPage;
