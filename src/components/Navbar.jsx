import React from "react";
import { StyleSheet, Text, View, Button, Dimensions } from "react-native";

function NavBar(props) {


    const { searchFunction, settingsFunction } = props;
    return (
        <View style={styles.navbar}>
            {/* <Text style={styles.title}>EVAT</Text> */}
            <Button style={styles.navbutton} title="Search" onPress={() => { }} ><Text>Search</Text></Button>
            <Button style={styles.navbutton} title="Profile" onPress={() => { }} ><Text>Config</Text></Button>
            <Button style={styles.navbutton} title="Settings" onPress={() => { }} ><Text>Search</Text></Button>
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
        backgroundColor: 'white',
        position: 'absolute',
        flexDirection: 'row',
        bottom: 0,
        textAlign: 'center',
        margin: 0,
        padding: 0,
        // justifyContent: 'space-between',
      },
      navbutton: {
        width: Dimensions.get('window').width/3,
        height: 50,
        backgroundColor: '#555555',
        display: 'inline',
        justifyContent: 'center',
        textAlign: 'center',
      },
})

export default NavBar;