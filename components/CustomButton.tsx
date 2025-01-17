import { Pressable, StyleSheet, Text, View } from 'react-native';

function CustomButton({ children, onPress, style = {}, textStyle= {}, type = "Primary" }) {
  return (
    <View style={style}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <View style={[styles.button, {
    backgroundColor: type == "Primary" ? "#111" : "gray"}]}>
          <Text style={[styles.buttonText, textStyle]}>
            {children}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#111",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10
  },
  flat: {
    // backgroundColor: 'transparent',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  flatText: {
    color: 'black',
  },
  pressed: {
    opacity: 0.75,
    borderRadius: 10
  },
});
