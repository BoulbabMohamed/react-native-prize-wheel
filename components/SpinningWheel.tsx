import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  Dimensions, 
  StyleSheet, 
  Animated,
  TouchableOpacity,
  Platform
} from 'react-native';
import Svg, { 
  Path, 
  G, 
  Text as SvgText, 
  Defs, 
  LinearGradient, 
  Stop,
  RadialGradient
} from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const SpinningWheel = () => {
  // Wheel configuration
  const SEGMENTS = 6;
  const WHEEL_SIZE = Math.min(width * 0.9, 400);
  const SEGMENT_ANGLE = 360 / SEGMENTS;

  // Animated value for rotation
  const spinValue = useRef(new Animated.Value(0)).current;

  // State to track wheel state
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);

  // Generate wheel segments with more interesting data
  const generateSegments = () => {
    const prizes = [
      { text: 'Dinner', emoji: '🍽️', color: '#FF6B6B' },
      { text: 'Movie', emoji: '🎬', color: '#4ECDC4' },
      { text: 'Game', emoji: '🎮', color: '#45B7D1' },
      { text: 'Trip', emoji: '✈️', color: '#FDCB6E' },
      { text: 'Gift', emoji: '🎁', color: '#6C5CE7' },
      { text: 'Relax', emoji: '🛋️', color: '#A8E6CF' }
    ];
    
    return prizes.map((prize, index) => ({
      ...prize,
      angle: index * SEGMENT_ANGLE
    }));
  };

  const segments = generateSegments();

  // Spin the wheel
  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setWinner(null);

    // Random spin duration and rotation
    const spinDuration = 3000;
    const randomRotation = Math.floor(Math.random() * 360) + 1080; // 3+ full rotations

    Animated.timing(spinValue, {
      toValue: randomRotation,
      duration: spinDuration,
      useNativeDriver: true
    }).start(() => {
      // Calculate winner after spin
      const finalRotation = randomRotation % 360;
      const winnerIndex = Math.floor(finalRotation / SEGMENT_ANGLE);
      
      setWinner(segments[winnerIndex]);
      setIsSpinning(false);
    });
  };

  // Reset wheel
  const resetWheel = () => {
    spinValue.setValue(0);
    setWinner(null);
  };

  // Render wheel segments
  const renderWheel = () => {
    return segments.map((segment, index) => {
      const rotation = index * SEGMENT_ANGLE;
      
      return (
        <G 
          key={index} 
          rotation={rotation}
          origin={`${WHEEL_SIZE / 2}, ${WHEEL_SIZE / 2}`}
        >
          <Path
            d={`
              M${WHEEL_SIZE / 2},${WHEEL_SIZE / 2} 
              L${WHEEL_SIZE / 2},0 
              A${WHEEL_SIZE / 2},${WHEEL_SIZE / 2} 0 0,1 
              ${WHEEL_SIZE / 2 + WHEEL_SIZE / 2 * Math.sin(SEGMENT_ANGLE * Math.PI / 180)},
              ${WHEEL_SIZE / 2 - WHEEL_SIZE / 2 * Math.cos(SEGMENT_ANGLE * Math.PI / 180)} 
              Z
            `}
            fill={segment.color}
            stroke="#FFFFFF"
            strokeWidth="2"
          />
          <SvgText
            x={WHEEL_SIZE / 2}
            y={WHEEL_SIZE / 4}
            fontSize="20"
            fill="white"
            fontWeight="bold"
            textAnchor="middle"
          >
            {segment.emoji}
          </SvgText>
          <SvgText
            x={WHEEL_SIZE / 2}
            y={WHEEL_SIZE / 3 + 20}
            fontSize="14"
            fill="white"
            textAnchor="middle"
          >
            {segment.text}
          </SvgText>
        </G>
      );
    });
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <View style={styles.wheelShadow}>
          <Animated.View 
            style={[
              styles.wheelContainer, 
              { 
                transform: [{ 
                  rotate: spinValue.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg']
                  }) 
                }]
              }
            ]}
          >
            <Svg 
              width={WHEEL_SIZE} 
              height={WHEEL_SIZE}
            >
              <Defs>
                <RadialGradient
                  id="wheelBackground"
                  cx="50%"
                  cy="50%"
                  rx="50%"
                  ry="50%"
                  fx="50%"
                  fy="50%"
                >
                  <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.1"/>
                  <Stop offset="100%" stopColor="#000000" stopOpacity="0.2"/>
                </RadialGradient>
              </Defs>
              
              <Path
                d={`M0,0 L${WHEEL_SIZE},0 L${WHEEL_SIZE},${WHEEL_SIZE} L0,${WHEEL_SIZE}Z`}
                fill="url(#wheelBackground)"
              />
              
              <G>
                {renderWheel()}
              </G>
            </Svg>
            
            {/* Spinning Arrow/Indicator */}
            <View style={styles.indicator} />
          </Animated.View>
        </View>

        <TouchableOpacity 
          style={[
            styles.spinButton, 
            isSpinning && styles.spinButtonDisabled
          ]} 
          onPress={spinWheel}
          disabled={isSpinning}
        >
          <Text style={styles.spinButtonText}>
            {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
          </Text>
        </TouchableOpacity>

        {winner && (
          <View style={styles.winnerContainer}>
            <Text style={styles.winnerText}>
              Winner: {winner.emoji} {winner.text}
            </Text>
            <TouchableOpacity onPress={resetWheel} style={styles.resetButton}>
              <Text style={styles.resetText}>Reset Wheel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelShadow: {
    shadowColor: '#000',
    shadowOffset: { 
      width: 0, 
      height: 10 
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 15,
    borderRadius: 1000,
    backgroundColor: 'white'
  },
  wheelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 1000,
    overflow: 'hidden'
  },
  indicator: {
    position: 'absolute',
    top: -20,
    width: 0,
    height: 0,
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 40,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FF6B6B',
    ...Platform.select({
      android: {
        elevation: 5
      },
      ios: {
        zIndex: 5
      }
    })
  },
  spinButton: {
    marginTop: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: '#4ECDC4',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { 
      width: 0, 
      height: 5 
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5
  },
  spinButtonDisabled: {
    opacity: 0.5,
    backgroundColor: '#A0A0A0'
  },
  spinButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  winnerContainer: {
    marginTop: 30,
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5
      },
      android: {
        elevation: 3
      }
    })
  },
  winnerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50'
  },
  resetButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#F0F0F0',
    borderRadius: 5
  },
  resetText: {
    color: '#4ECDC4',
    fontWeight: 'bold'
  }
});

export default SpinningWheel;