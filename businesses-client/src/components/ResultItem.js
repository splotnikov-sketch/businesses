import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const ResultItem = ({ item }) => {
	const navigation = useNavigation();
	return (
		<TouchableOpacity
			onPress={() => navigation.navigate('Detail', { id: item.id })}
			style={styles.container}
		>
			<Image style={styles.image} source={{ uri: item.image_url }} />
			<Text style={styles.name}>{item.name}</Text>
			<Text style={styles.detail}>
				{item.rating} Stars, {item.review_count} reviews
			</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	name: {
		fontWeight: 'bold',
	},
	detail: {},
	container: {
		marginLeft: 15,
		marginBottom: 20,
	},
	image: {
		width: 250,
		height: 200,
		borderRadius: 4,
		marginBottom: 5,
	},
});

export default ResultItem;
