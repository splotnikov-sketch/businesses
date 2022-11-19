import { Pressable, StyleSheet, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'

function IconButton({ icon, size, color, onPress, border }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.buttonContainer, border ? styles.border : null]}
    >
      <Ionicons name={icon} size={size} color={color} />
    </Pressable>
  )
}

export default IconButton

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 6,
    marginHorizontal: 3,
    alignSelf: 'center',
  },
  border: {
    borderColor: 'black',
    borderRadius: 5,
    borderWidth: 1,
  },
})
