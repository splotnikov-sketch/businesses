import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Button } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { ThemeProvider } from '@rneui/themed'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { Colors } from 'constants/styles'
import { useAppContext } from 'contexts/AppContext'

import { AppProvider } from 'contexts/AppContext'
import SearchScreen from 'screens/search/SearchScreen'
import DetailScreen from 'screens/search/DetailScreen'
import SignupScreen from 'screens/account/SignupScreen'
import LoginScreen from 'screens/account/LoginScreen'
import WelcomeScreen from 'screens/account/WelcomeScreen'
import { isNullOrEmpty } from 'utils/index'
import IconButton from 'components/ui/IconButton'

const Stack = createNativeStackNavigator()
const Drawer = createDrawerNavigator()

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='Signup' component={SignupScreen} />
    </Stack.Navigator>
  )
}

function AuthenticatedStack() {
  const { signOut } = useAppContext()
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen
        name='Welcome'
        component={WelcomeScreen}
        options={{
          headerRight: ({ tintColor }) => (
            <IconButton
              icon='exit'
              color={tintColor}
              size={24}
              onPress={signOut}
            />
          ),
        }}
      />
    </Stack.Navigator>
  )
}

function SearchStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName='Search'
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
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

function Navigation() {
  const { state } = useAppContext()
  const isAuthenticated = !isNullOrEmpty(state.auth.token)
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name='Search' component={SearchStackNavigator} />
        <Drawer.Screen
          name='Account'
          component={isAuthenticated ? AuthenticatedStack : AuthStack}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <>
      <AppProvider>
        <ThemeProvider>
          <Navigation />
        </ThemeProvider>
      </AppProvider>
      <StatusBar style='dark' />
    </>
  )
}

const styles = StyleSheet.create({})
