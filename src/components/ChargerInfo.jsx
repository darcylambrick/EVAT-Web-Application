import { set } from 'mongoose';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, Alert } from 'react-native'
import { Marker } from 'react-native-maps';


// import component 👇


function ChargerMarker(props) {
  const { charger, goToPressed } = props;

  const title = charger.operator == "Unknown" ? "Charger" :  charger.operator;
  const location = { latitude: charger.latitude, longitude: charger.longitude }
  const description = `Chargers: ${charger.charging_points}`
  const rating = charger.rating ? charger.rating : "No rating"

  const createRatingStars = () => {
    if (rating == "No rating" || rating === 0) return "☆☆☆☆☆";
    if (rating >= 5) return "★★★★★";
    let floorRating = Math.floor(rating);
    let halfRatingTrue = (rating - floorRating) > 0.5 ? true : false;
    let stars = "★".repeat(Math.floor(rating)) + (halfRatingTrue ? "★" : "☆") + "☆".repeat(4 - Math.floor(rating));
    return stars;
  }

  const createChargerAlert = () => {
    const info = `Charger Name: ${charger.name}\nCharging Points: ${charger.charging_points}\nCharger Type: ${charger.type}\nCharger Status: ${charger.status}\nRating: ${createRatingStars()} ${charger.rating}\nLocation: ${charger.latitude}, ${charger.longitude}\n` 

    Alert.alert(title, info, [
      {
        text: 'Go To Charger',
        onPress: () => {
          // Update the selected charger location in the parent MapPage component
          const chargerLocation = {
            latitude: charger.latitude,
            longitude: charger.longitude
          };
          goToPressed(chargerLocation); // Pass the location to the parent MapPage component
          console.log('Route will be calculated to this charger.');
          Alert.alert("Route will be calculated to this charger.", "Please wait...", [
            { text: 'OK', onPress: () => console.log('OK Pressed') }
          ]);
        }
      },
      {
        text: 'Exit',
        onPress: () => console.log('Exit Pressed')
      }
    ]);
  }


  return (
    <Marker
      key={`${charger.id}`}
      identifier={`${charger.id}`}
      // onPress={() => setChargerInfo(chargerOptions)}
      coordinate={location}
      title={title}
      description={description+" (" + createRatingStars()+")"}
      onCalloutPress={() => createChargerAlert()}>
      <Image source={require('../data/ev_charger_symbol.webp')} style={styles.marker} />
    </Marker>
  );
}

export default ChargerMarker;


const styles = StyleSheet.create({
  marker: {
    width: 40,
    height: 40,
    resizeMode: 'contain'
}});
