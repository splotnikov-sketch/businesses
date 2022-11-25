import { Text, StyleSheet, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from 'constants/styles'

function OnlineButtonWhite({ onPress, icon, children }) {
  return (
    <Pressable
      style={(pressed) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
    >
      <Ionicons style={styles.icon} name={icon} size={18} color='white' />
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  )
}

export default OnlineButtonWhite

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
  },
  pressed: {
    opacity: 0.7,
  },
  icon: {
    marginRight: 6,
  },
  text: {
    color: 'white',
  },
})
