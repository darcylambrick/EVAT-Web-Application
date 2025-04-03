import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

function NavBar(props) {


    const { searchFunction, settingsFunction } = props;
    return (
        <View style={styles.navbar}>
            <TouchableOpacity style={styles.navbutton}>
                {/* <Icon size={30} name="search"/> */}
                <Text style={styles.navbuttonText}>Search</Text>
            </TouchableOpacity>
            <View style={styles.verticleLine}></View>
            <TouchableOpacity style={styles.navbutton}>
                <Text style={styles.navbuttonText}>Settings</Text>
            </TouchableOpacity>
            <View style={styles.verticleLine}></View>
            <TouchableOpacity style={styles.navbutton}>
                <Text style={styles.navbuttonText}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
    },
    navbar: {
        width: Dimensions.get('window').width,
        height: 50,
        backgroundColor: '#2e9963',
        position: 'absolute',
        flexDirection: 'row',
        bottom: 0,
        color: 'white',
        textAlign: 'center',
        alignItems: 'center',
        margin: 0,
        padding: 0,
        // justifyContent: 'space-between',
    },
    navbutton: {
        width: Dimensions.get('window').width / 3,
        height: 50,
        // backgroundColor: '#66aa66',
        color: 'red',
        justifyContent: 'center',
        textAlign: 'center',
    },
    verticleLine:{
        height: '60%',
        width: 2,
        backgroundColor: '#DDD',
      },
    navbuttonText: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',
        justifyContent: 'center',
    }
})

export default NavBar;