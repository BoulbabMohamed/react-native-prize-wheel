import React, { useState } from "react";
import CustomButton from "./CustomButton";
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,Dimensions
} from "react-native";

type PlayerDataModalProps = {
  phone: number;
  name: string;
  setPhone: (text: string) => void;
  setName: (text: string) => void;
  onSubmit: () => void;
  setModalVisible: (state: boolean) => void;
  modalVisible: boolean;
};

let fontSize = Dimensions.get('window').width > 800 ? 20 : 16;

const PlayerDataModal = ({
  phone,
  name,
  setPhone,
  setName,
  setModalVisible,
  modalVisible = false,
  onSubmit,
}: PlayerDataModalProps) => {
  const [responseMessage, setResponseMessage] = useState("");

  const onSubmitHandler = () => {
  let errorMessage = '';
    // Validate name
    if (name?.trim().length < 4 || name?.trim().length > 30) {
      errorMessage = "The name must contain at least 4 characters.";
    }

    // Validate phone number
    const phoneRegex = /^(06|07|05)\d{8}$/;
    if (!phoneRegex.test(phone?.toString())) {
      errorMessage = errorMessage
        ? `${errorMessage}\nThe phone number must start with 06, 07 or 05 and contain 10 digits.`
        : "The phone number must start with 06, 07 or 05 and contain 10 digits.";
    }

    // If there's an error, show it
    if (errorMessage) {
      setResponseMessage(errorMessage);
      return;
    }

    // Clear the message and proceed
    setResponseMessage('');
    onSubmit();
};

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      style={{flex: 1}}
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContent}
          >
            <Text style={styles.modalTitle}>Please enter your information</Text>
            {responseMessage ? (
              <Text style={styles.responseMessage}>{responseMessage}</Text>
            ) : null}

            <TextInput
              placeholder="Your name / Business"
              value={name}
              onChangeText={(name) => setName(name)}
              style={styles.input}
            />
            <TextInput
              placeholder="Phone number"
              value={phone?.toString()}
              onChangeText={(phone) => setPhone(phone?.toString())}
              style={styles.input}
              keyboardType="phone-pad"
            />
            <View style={{flexDirection: 'row', gap: 20}}>
              <CustomButton onPress={onSubmitHandler} textStyle={{fontSize: fontSize}}>Start</CustomButton>
              <CustomButton onPress={() => setModalVisible(false)} textStyle={{fontSize: fontSize}} type="S">Close</CustomButton>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    // backgroundColor: "#ffce06",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 20,
    width: Dimensions.get('window').width * (Dimensions.get('window').width > 800 ? 0.5 : 0.85),
    alignItems: "center",
  },
  modalTitle: {
    fontSize: fontSize,
    fontWeight: "semibold",
    marginBottom: 25,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    width: "100%",
    marginBottom: 15,
    fontSize: fontSize,
  },
  responseMessage: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
});

export default PlayerDataModal;
