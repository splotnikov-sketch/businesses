import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppContext } from '../contexts/AppContext';

const SearchBox = ({ term, onTermChange, onEndEditing }) => {
	const { state } = useAppContext();
	const searchEditRef = useRef();

	useEffect(() => {
		searchEditRef.current.focus();
	}, [state.location.location]);

	return (
		<View style={styles.container}>
			<Feather name='search' style={styles.icon} />
			<TextInput
				ref={searchEditRef}
				style={styles.input}
				placeholder='Search'
				value={term}
				onChangeText={onTermChange}
				autoCorrect={false}
				autoCapitalize='none'
				onEndEditing={onEndEditing}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		margin: 10,
		backgroundColor: '#d3d3d3',
		flexDirection: 'row',
		height: 40,
		borderRadius: 7,
	},
	icon: {
		fontSize: 30,
		alignSelf: 'center',
	},
	input: {
		marginStart: 10,
	},
});

export default SearchBox;
