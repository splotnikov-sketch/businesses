import { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Button, Alert } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { ThemeProvider } from '@rneui/themed'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { Colors } from 'constants/styles'
import { useAppContext } from 'contexts/AppContext'
import { isNullOrEmpty } from 'utils/index'
import IconButton from 'components/ui/IconButton'
import { Ionicons } from '@expo/vector-icons'

import { AppProvider } from 'contexts/AppContext'
import SearchScreen from 'screens/search/SearchScreen'
import DetailScreen from 'screens/search/DetailScreen'
import SignupScreen from 'screens/account/SignupScreen'
import LoginScreen from 'screens/account/LoginScreen'
import ProfileScreen from 'screens/account/ProfileScreen'
import EditLocationScreen from 'screens/location/EditLocationScreen'
import killSession from 'api/cdp/killSession'

const Stack = createNativeStackNavigator()
const Drawer = createDrawerNavigator()

function UnauthenticatedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary800 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary30 },
      }}
    >
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='Signup' component={SignupScreen} />
    </Stack.Navigator>
  )
}

function AuthenticatedStack() {
  const { signOut, getCdpBrowserId } = useAppContext()

  const signOutLocal = async () => {
    signOut()
    await killSession()
    await getCdpBrowserId()
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary800 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary30 },
      }}
    >
      <Stack.Screen
        name='Profile'
        component={ProfileScreen}
        options={{
          headerRight: ({ tintColor }) => (
            <IconButton
              icon='exit'
              color={tintColor}
              size={32}
              onPress={signOutLocal}
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
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary800 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary30 },
      }}
    >
      <Stack.Screen
        name='Search'
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
        options={({ route }) => ({
          title: route.params.name,
        })}
      />
      <Stack.Screen name='Edit Location' component={EditLocationScreen} />
    </Stack.Navigator>
  )
}

function Navigation() {
  const { state, getCdpBrowserId, detectLocation } = useAppContext()
  const isAuthenticated = !isNullOrEmpty(state.auth.token)

  useEffect(() => {
    ;(async () => {
      await killSession()
      await detectLocation()
      await getCdpBrowserId()
    })()
  }, [])

  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          drawerStyle: {
            backgroundColor: Colors.primary30,
          },
        }}
      >
        <Drawer.Screen
          name='Businesses Search'
          component={SearchStackNavigator}
          options={{
            drawerLabel: 'Search',
            drawerIcon: ({ color, size }) => (
              <Ionicons name='search' color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name='Account'
          component={
            isAuthenticated ? AuthenticatedStack : UnauthenticatedStack
          }
          options={{
            drawerLabel: 'Profile',
            drawerIcon: ({ color, size }) => (
              <Ionicons name='person-outline' color={color} size={size} />
            ),
          }}
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
