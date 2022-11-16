import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Button } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { ThemeProvider } from '@rneui/themed'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer'

import { AppProvider } from './src/contexts/AppContext'
import SearchScreen from './src/screens/SearchScreen'
import DetailScreen from './src/screens/DetailScreen'

import AccountScreen from './src/screens/AccountScreen'
import SignUpScreen from './src/screens/SignUpScreen'
import SignInScreen from './src/screens/SignInScreen'

const Stack = createNativeStackNavigator()
const Drawer = createDrawerNavigator()

function AuthStack() {
  return (
    <Stack.Navigator initialRouteName='Sign In'>
      <Stack.Screen
        name='Account Screen'
        component={AccountScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name='Sign Up' component={SignUpScreen} />
      <Stack.Screen name='Sign In' component={SignInScreen} />
    </Stack.Navigator>
  )
}

function AuthenticatedStack() {}

function SearchStackNavigator() {
  return (
    <Stack.Navigator initialRouteName='Search'>
      <Stack.Screen
        name='Businesses Search'
        component={SearchScreen}
        options={{
          headerShown: false,
          headerRight: () => (
            <Button
              onPress={() => alert('This is a button!')}
              title='Info'
              color='#fff'
            />
          ),
        }}
      />
      <Stack.Screen
        name='Detail'
        component={DetailScreen}
        options={({ route }) => ({ title: route.params.name })}
      />
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <>
      <AppProvider>
        <ThemeProvider>
          <NavigationContainer>
            <Drawer.Navigator>
              <Drawer.Screen name='Search' component={SearchStackNavigator} />
              <Drawer.Screen name='Account' component={AuthStack} />
            </Drawer.Navigator>
          </NavigationContainer>
        </ThemeProvider>
      </AppProvider>
      <StatusBar style='dark' />
    </>
  )
}

const styles = StyleSheet.create({})
