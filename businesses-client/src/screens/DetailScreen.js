import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, FlatList, Image } from 'react-native';
import { Code } from 'react-content-loader/native';

import { useAppContext } from '../contexts/AppContext';

const DetailScreenContentLoader = () => {
	return <Code />;
};

const DetailScreen = ({ route, navigation }) => {
	const { id } = route.params;
	const { state, getBusinessDetail } = useAppContext();
	const { business } = state.data;

	console.log('business');
	console.log(business);

	useEffect(() => {
		(async () => {
			await getBusinessDetail(id);
		})();
	}, []);

	return business === null ? (
		<DetailScreenContentLoader />
	) : (
		<View style={styles.container}>
			<Text style={styles.name}>{business.name}</Text>
			<FlatList
				data={business.photos}
				keyExtractor={(photo) => photo}
				renderItem={({ item }) => {
					return (
						<Image style={styles.image} source={{ uri: item }} />
					);
				}}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		margin: 10,
	},
	name: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	image: {
		height: 200,
		width: 300,
		margin: 10,
	},
});

export default DetailScreen;
