import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Button, Icon } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { ThemeProvider } from '@rneui/themed'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
//import { createDrawerNavigator } from '@react-navigation/drawer'

import { AppProvider } from './src/contexts/AppContext'
import SearchScreen from './src/screens/SearchScreen'
import DetailScreen from './src/screens/DetailScreen'

import AccountScreen from './src/screens/AccountScreen'
import SignUpScreen from './src/screens/SignUpScreen'
import SignInScreen from './src/screens/SignInScreen'

const Stack = createNativeStackNavigator()
//const Drawer = createDrawerNavigator()

// function AccountStackNavigator() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name='Account Screen' component={AccountScreen} />
//       <Stack.Screen name='Sign Up' component={SignUpScreen} />
//       <Stack.Screen name='Sign In' component={SignInScreen} />
//     </Stack.Navigator>
//   )
// }

// function SearchStackNavigator() {
//   return (
//     <Stack.Navigator initialRouteName='Search'>
//       <Stack.Screen
//         name='Search'
//         component={SearchScreen}
//         options={{
//           title: 'Businesses Search',
//           headerRight: () => (
//             <Button
//               onPress={() => alert('This is a button!')}
//               title='Info'
//               color='#fff'
//             />
//           ),
//         }}
//       />
//       <Stack.Screen
//         name='Detail'
//         component={DetailScreen}
//         options={({ route }) => ({ title: route.params.name })}
//       />
//     </Stack.Navigator>
//   )
// }

export default function App() {
  return (
    <>
      <AppProvider>
        <ThemeProvider>
          <NavigationContainer>
            {/* <Drawer.Navigator>
              <Drawer.Screen name='Main' component={SearchStackNavigator} />
              <Drawer.Screen name='Account' component={AccountStackNavigator} />
            </Drawer.Navigator> */}
            <Stack.Navigator initialRouteName='Search'>
              <Stack.Screen
                name='Search'
                component={SearchScreen}
                options={{
                  title: 'Businesses Search',
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
          </NavigationContainer>
        </ThemeProvider>
      </AppProvider>
      <StatusBar style='dark' />
    </>
  )
}

const styles = StyleSheet.create({})
