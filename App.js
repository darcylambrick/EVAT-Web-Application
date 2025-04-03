import React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {enableScreens, ScreenStackHeaderBackButtonImage} from 'react-native-screens';
import SigninPage from './src/screens/SigninPage';
import SignupPage from './src/screens/SignupPage';
import MapPage from './src/screens/MapPage';

enableScreens();
const options = {
  headerStyle: {
    backgroundColor: '#29754f',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  headerTitleAlign: 'center',
  headerBackTitleVisible: false,
}

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Signin" component={SigninPage} options={{...options, title: "EVAT Sign In"}}/>
        <Stack.Screen name="Signup" component={SignupPage} options={{...options, title: "EVAT Sign Up"}}/>
        <Stack.Screen name="MapPage"  component={MapPage}  options={{...options, title: "EVAT", headerBackTitleVisible: false,}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};



export default App;
