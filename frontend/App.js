import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen'; 
import HomeScreen from './src/screens/HomeScreen'; 
import FriendsScreen from './src/screens/FriendsScreen';
import AccountScreen from './src/screens/AccountScreen';
import MysteryPick from './src/screens/MysteryPick';
import ReviewsScreen from './src/screens/ReviewsScreen'; 
import DefaultHeader from './src/components/DefaultHeader';
import AccountHeader from './src/components/AccountHeader'; 
import SettingsScreen from './src/screens/SettingsScreen'; 
import TermsScreen from './src/screens/TermsScreen'; 
import RecommendScreen from './src/screens/RecommendScreen'; 


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = ({ route }) => {
  const { email } = route.params || {};

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{ tabBarStyle: { display: 'flex' }, tabBarLabelStyle: { color: 'black' }, headerShown: true }}
    >
      <Tab.Screen
        name="MysteryPick"
        component={MysteryPick}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused
                ? require('./assets/images/wheel_icon_pressed.png')
                : require('./assets/images/wheel_icon.png')}
              style={{ width: 24, height: 24, tintColor: focused ? '#ff6f00' : '#ffaa00' }}
            />
          ),
          tabBarLabel: 'Mystery Pick',
          header: () => <DefaultHeader />
        }}
      />
      <Tab.Screen
        name="Reviews"
        component={ReviewsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused
                ? require('./assets/images/reviews_icon_pressed.png')
                : require('./assets/images/reviews_icon.png')}
              style={{ width: 24, height: 24, tintColor: focused ? '#ff6f00' : '#ffaa00' }}
            />
          ),
          tabBarLabel: 'Reviews',
          header: () => <DefaultHeader />
        }}
      />
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        initialParams={{ email }} 
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require('./assets/images/home_icon_pressed.png') : require('./assets/images/home_icon.png')}
              style={{ width: 24, height: 24, tintColor: focused ? '#ff6f00' : '#ffaa00' }}
            />
          ),
          tabBarLabel: 'Home',
          header: () => <DefaultHeader />
        }}
      />
      <Tab.Screen
        name="Friends"
        component={FriendsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused
                ? require('./assets/images/friends_icon_pressed.png')
                : require('./assets/images/friends_icon.png')}
              style={{ width: 24, height: 24, tintColor: focused ? '#ff6f00' : '#ffaa00' }}
            />
          ),
          tabBarLabel: 'Friends',
          header: () => <DefaultHeader />
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused
                ? require('./assets/images/account_icon_pressed.png')
                : require('./assets/images/account_icon.png')}
              style={{ width: 24, height: 24, tintColor: focused ? '#ff6f00' : '#ffaa00' }}
            />
          ),
          tabBarLabel: 'Account',
          header: ({ navigation }) => <AccountHeader navigation={navigation} />
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isAuthenticated ? 'Tabs' : 'Login'}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="Tabs"
          component={TabNavigator}
          options={{ headerShown: false }}
          initialParams={{setIsAuthenticated }}
        />
        <Stack.Screen
          name="Recommend"
          component={RecommendScreen}
          options={{
            title: 'Recommendations',
            headerBackTitle: 'Home',
            headerBackTitleStyle: {
              color: 'black',
              fontWeight: 'bold',
            },
            headerBackImage: () => (
              <Image
                source={require('./assets/images/back_icon.png')}
                style={{ width: 24, height: 24, tintColor: '#ffaa00' }}
              />
            ),
          }}
        />
        <Stack.Screen
          name="Settings"
          options={{
            title: 'Settings',
            headerBackTitle: 'Account', 
            headerBackTitleStyle: {
              color: 'black',
              fontWeight: 'bold',
            },
            headerBackImage: () => (
              <Image
                source={require('./assets/images/back_icon.png')} // Your back arrow image
                style={{ width: 24, height: 24, tintColor: '#ffaa00' }} // Set the back arrow color to #ffaa00
              />
            ),
          }}
        >
          {(props) => <SettingsScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
        </Stack.Screen>
        <Stack.Screen
          name="Terms"
          component={TermsScreen}
          options={{
            title: 'Terms and Conditions',
            headerBackTitle: 'Register',  // Set back button title to "Register"
            headerBackTitleStyle: {
              color: 'black',
              fontWeight: 'bold',
            },
            headerBackImage: () => (
              <Image
                source={require('./assets/images/back_icon.png')}
                style={{ width: 24, height: 24, tintColor: '#ffaa00' }}
              />
            ),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
