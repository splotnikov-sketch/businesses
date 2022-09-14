import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '@rneui/themed';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AppProvider } from './src/contexts/AppContext';
import SearchScreen from './src/screens/SearchScreen';
import DetailScreen from './src/screens/DetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
	return (
		<AppProvider>
			<ThemeProvider>
				<NavigationContainer>
					<Stack.Navigator>
						<Stack.Screen
							name='Search'
							component={SearchScreen}
							options={{ title: 'Business Search' }}
						/>
						<Stack.Screen
							name='Detail'
							component={DetailScreen}
							options={{ title: 'Detail' }}
						/>
					</Stack.Navigator>
				</NavigationContainer>
			</ThemeProvider>
		</AppProvider>
	);
}

const styles = StyleSheet.create({});
