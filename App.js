import React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {enableScreens} from 'react-native-screens';
import SigninPage from './src/screens/SigninPage';
import SignupPage from './src/screens/SignupPage';
import MapPage from './src/pages/MapPage';

enableScreens();

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Signin" component={SigninPage} options={{title: "EVAT Sign In"}}/>
        <Stack.Screen name="Signup" component={SignupPage} options={{title: "EVAT Sign Up"}}/>
        <Stack.Screen name="MapPage" component={MapPage}  options={{title: "EVAT"}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
