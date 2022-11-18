import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Button } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { ThemeProvider } from '@rneui/themed'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer'

import { AppProvider } from 'contexts/AppContext'
import SearchScreen from 'screens/SearchScreen'
import DetailScreen from 'screens/DetailScreen'

import SignupScreen from 'screens/SignupScreen'
import LoginScreen from 'screens/LoginScreen'

const Stack = createNativeStackNavigator()
const Drawer = createDrawerNavigator()

function AuthStack() {
  return (
    <Stack.Navigator initialRouteName='Sign In'>
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='Signup' component={SignupScreen} />
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
