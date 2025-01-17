import React, { useState, useRef, useEffect } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  Easing,
  TouchableOpacity,
  Dimensions 
} from 'react-native';
import LottieView from 'lottie-react-native';

const CongratulationsModal = ({ 
  isVisible, 
  onClose, 
  winningPrize,
  userName
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      // Parallel animations for dynamic entrance
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true
        }),
        Animated.timing(translateAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.bounce,
          useNativeDriver: true
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        })
      ]).start();
    }
  }, [isVisible]);

  const handleClose = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start(() => onClose());
  };

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
    >
      <View style={styles.overlay}>
        <Animated.View 
          style={[
            styles.modalContainer,
            {
              transform: [
                { scale: scaleAnim },
                { translateY: translateAnim }
              ],
              opacity: opacityAnim
            }
          ]}
        >
          <LottieView
            source={require('../assets/confetti.json')}
            autoPlay
            loop={false}
            style={styles.confettiAnimation}
          />
          
          <Text style={styles.congratsTitle}>Congratulations 🥳</Text>
          
          <Text style={styles.prizeText}>{userName} you won </Text>
          <Text style={styles.winningPrizeText}>{winningPrize}</Text>
          
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={handleClose}
          >
            <Text style={styles.closeButtonText}>Re-play</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    width: Dimensions.get('window').width * (Dimensions.get('window').width > 800 ? 0.5 : 0.85),
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  congratsTitle: {
    fontSize: Dimensions.get('window').width > 800 ? 30 : 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10
  },
  prizeText: {
    fontSize: Dimensions.get('window').width > 800 ? 25 : 18,
    color: '#666',
    marginBottom: 5
  },
  winningPrizeText: {
    fontSize: Dimensions.get('window').width > 800 ? 27 : 22,
    fontWeight: 'bold',
    color: '#FF5722',
    marginBottom: 15,
    textAlign: 'center'
  },
  closeButton: {
    // backgroundColor: '#2196F3',
    backgroundColor: "#111",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10
  },
  closeButtonText: {
    color: 'white',
    fontSize: Dimensions.get('window').width > 800 ? 20 : 16,
    fontWeight: 'bold',
  },
  confettiAnimation: {
    width: '100%',
    height: 200,
    position: 'absolute',
    top: -50,
    zIndex: 1
  }
});

export default CongratulationsModal;