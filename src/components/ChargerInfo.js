import React, {useEffect, useState } from 'react';
import {StyleSheet} from 'react-native'

// import component 👇


function ChargerInfo(options) {

  const title = options.charger.name;
  const location = { ...options.charger.location }
  const details = options.charger.information


  return (
    <div>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subTitle}>Location:</Text>
      <Text>{location}</Text>
    </div>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Inknut Antiqua',
  },
  subTitle: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Inknut Antiqua',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 8,
  },
  clearButton: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 15,
    width: 19,
    height: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  clearButtonText: {
    fontSize: 18,
    color: 'gray',
  },
  subscriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  subscriptionText: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  legalContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20,
  },
  legalText: {
    fontSize: 14,
    color: 'blue',
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  appleButton: {
    backgroundColor: '#4285F4',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
    width: '100%',
  },
  termsButton: {
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    width: '100%',
  },
  emailButtonText: {
    color: '#ffffff',
    fontSize: 14,
  },
});


export default ChargerInfo