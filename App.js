/*
  Mohamed Boulbab
  @2025
  React Native Fortune Wheel
*/


import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text as RNText,
  Dimensions,
  Animated,
  ImageBackground,
  Image,
} from "react-native";
import Svg, { Path, G, Text, TSpan } from "react-native-svg";
import * as d3Shape from "d3-shape";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import { snap } from "@popmotion/popcorn";
import * as Font from "expo-font";
import PlayerDataModal from "./components/playerDataModal";
import CustomButton from "./components/CustomButton";
import { StatusBar } from "expo-status-bar";
import CongratulationsModal from "./components/CongratulationsModal";
import axios from "axios";

const { width } = Dimensions.get("screen");

const segments = [
  "Prize 1\n1000",
  "Prize 2\n50",
  "Prize 3",
  "Prize 4\n100",
  "Prize 5\n500",
  "Prize 6\n30%",
  "Prize 7",
];

const API_LINK="YOUR_API_ENDPOINT"
const numberOfSegments = segments.length;
const wheelSize = width * 0.95;
const fontSize = width < 450 ? 19 : width < 900 ? 30 : 50;
const oneTurn = 360;
const angleBySegment = oneTurn / numberOfSegments;
const angleOffset = angleBySegment / 2;

const makeWheel = () => {
  const data = Array.from({ length: numberOfSegments }).fill(1);
  const arcs = d3Shape.pie()(data);

  const colors = [
    "#ff160e",
    "#3498DB",
    "#28B463",
    "#8E44AD",
    "#FF5733",
    "#28B463",
    "#3498DB",
  ];

  return arcs.map((arc, index) => {
    const instance = d3Shape
        .arc()
        .padAngle(0.01)
        .outerRadius(width / 2)
        .innerRadius(20);

    return {
      path: instance(arc),
      color: colors[index],
      value: segments[index],
      centroid: instance.centroid(arc),
    };
  });
};

const App = () => {
  const _angle = useRef(new Animated.Value(0)).current;
  const angle = useRef(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [prize, setPrize] = useState("");
  const [userId, setUserId] = useState("");
  const [fontLoaded, setFontLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wheelPaths, setWheelPaths] = useState(makeWheel());
  const [enabled, setEnabled] = useState(true);
  const [finished, setFinished] = useState(false);
  const [congratulation, setCongratulation] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync({
        Roboto: require("./assets/fonts/Roboto-Regular.ttf"),
      });
      setFontLoaded(true);
    };
    loadFont();
  }, []);

  useEffect(() => {
    const listener = _angle.addListener((event) => {
      angle.current = event.value;
    });
    return () => {
      _angle.removeAllListeners();
    };
  }, [_angle]);

  useEffect(() => {
    if (prize && name && phone) {
      sendData();
    }
  }, [prize]);

  const getWinnerIndex = () => {
    const normalizedAngle = ((angle.current % oneTurn) + oneTurn + angleOffset) % oneTurn;
    const segmentIndex = Math.floor((360 - normalizedAngle) / angleBySegment);
    return (segmentIndex + 1) % numberOfSegments;
  };

  const handlePan = ({ nativeEvent }) => {
    if (!name || !phone) {
      setMessage("Please register first");
      return;
    }

    if (nativeEvent.state === 5) {
      setEnabled(false);
      setFinished(false);

      Animated.decay(_angle, {
        velocity: nativeEvent.velocityY / 1000,
        deceleration: 0.999,
        useNativeDriver: true,
      }).start(() => {
        _angle.setValue(angle.current % oneTurn);
        const snapTo = snap(oneTurn / numberOfSegments);

        Animated.timing(_angle, {
          toValue: snapTo(angle.current),
          duration: 3000,
          useNativeDriver: true,
        }).start(() => {
          const winnerIndex = getWinnerIndex();
          if (winnerIndex >= 0 && winnerIndex < wheelPaths.length) {
            const cleanWinnerText = wheelPaths[winnerIndex].value.replace(
                /\n/g,
                " "
            );
            finishHandler(cleanWinnerText);
            setTimeout(() => {
              setEnabled(true);
            }, 20);
          }
        });
      });
    }
  };

  const AddUser = async (name, phone) => {
    try {
      const response = await axios.post(`${API_LINK}/games`, {
        name: name,
        phone: phone,
      });
      setUserId(response.data.data.id);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const startGameHandler = () => {
    AddUser(name, phone);
    setModalVisible(false);
    setMessage(name + " 👏🏼👏🏼👏🏼");
  };

  const newUserHandler = () => {
    resetAll();
    setModalVisible(true);
  };

  const finishHandler = (p) => {
    setFinished(true);
    setCongratulation(true);
    setPrize(p);
  };

  const resetAll = () => {
    setName(null);
    setPhone(null);
    setPrize(null);
    setModalVisible(false);
    setCongratulation(false);
    setMessage(null);
  };

  const sendData = async () => {
    try {
      await axios.patch(`${API_LINK}/games/${userId}`, {
        prize: prize
      });
    } catch (error) {
      console.error("Error updating prize:", error);
    }
  };

  const renderKnob = () => {
    const knobSize = 30;
    const YOLO = Animated.modulo(
        Animated.divide(
            Animated.modulo(Animated.subtract(_angle, angleOffset), oneTurn),
            new Animated.Value(angleBySegment)
        ),
        1
    );

    return (
        <Animated.View
            style={{
              width: knobSize,
              height: knobSize * 2,
              justifyContent: "flex-end",
              zIndex: 1,
              transform: [
                {
                  rotate: YOLO.interpolate({
                    inputRange: [-1, -0.5, -0.0001, 0.0001, 0.5, 1],
                    outputRange: [
                      "0deg",
                      "0deg",
                      "35deg",
                      "-35deg",
                      "0deg",
                      "0deg",
                    ],
                  }),
                },
              ],
            }}
        >
          <Svg
              width={knobSize}
              height={(knobSize * 100) / 57}
              viewBox={`0 0 57 100`}
              style={{ transform: [{ translateY: 8 }] }}
          >
            <Path
                d="M28.034,0C12.552,0,0,12.552,0,28.034S28.034,100,28.034,100s28.034-56.483,28.034-71.966S43.517,0,28.034,0z"
                fill="#111"
            />
          </Svg>
        </Animated.View>
    );
  };

  const renderSvgWheel = () => {
    return (
        <View style={styles.container}>
          {renderKnob()}
          <Animated.View
              style={{
                alignItems: "center",
                justifyContent: "center",
                transform: [
                  {
                    rotate: _angle.interpolate({
                      inputRange: [-oneTurn, 0, oneTurn],
                      outputRange: [`-${oneTurn}deg`, `0deg`, `${oneTurn}deg`],
                    }),
                  },
                ],
              }}
          >
            <View style={styles.logoContainer}>


            </View>
            <Svg
                width={wheelSize}
                height={wheelSize}
                viewBox={`0 0 ${width} ${width}`}
                style={{ transform: [{ rotate: `-${angleOffset}deg` }] }}
            >
              <G y={width / 2} x={width / 2}>
                {wheelPaths.map((arc, i) => {
                  const [x, y] = arc.centroid;
                  const number = arc.value.toString();
                  const lines = number.split("\n");

                  return (
                      <G key={`arc-${i}`}>
                        <Path d={arc.path} fill={arc.color} />
                        <G
                            rotation={(i * oneTurn) / numberOfSegments + angleOffset}
                            origin={`${x}, ${y}`}
                        >
                          <Text
                              x={x}
                              y={y - (width > 800 ? 30 : 10)}
                              fill="white"
                              textAnchor="middle"
                              fontSize={fontSize}
                              fontWeight="bold"
                              fontFamily="Roboto"
                              dominantBaseline="middle"
                          >
                            {lines.length > 1 ? (
                                lines.map((line, index) => (
                                    <TSpan
                                        key={index}
                                        x={x}
                                        dy={index === 0 ? -fontSize / 2 : fontSize}
                                        fontFamily="Roboto"
                                    >
                                      {line}
                                    </TSpan>
                                ))
                            ) : (
                                <TSpan x={x} fontFamily="Roboto">
                                  {number}
                                </TSpan>
                            )}
                          </Text>
                        </G>
                      </G>
                  );
                })}
              </G>
            </Svg>
          </Animated.View>
        </View>
    );
  };

  return (
      <>
        <StatusBar style="dark" />
        <ImageBackground
            source={require("./assets/images/background.png")}
            style={{ flex: 1 }}
            resizeMode="cover"
        >
          <View
              style={[
                { flex: 1, justifyContent: "center", alignItems: "center" },
                modalVisible && { display: "none" },
              ]}
          >
            <View style={{ alignItems: "center", justifyContent: "center", width: "100%" }}>
              <View style={{ width: "80%", height: 80, marginVertical: 30, marginHorizontal: "auto"}}>
                <Image
                    source={require("./assets/images/logo_2.png")}
                    style={{ width: "100%", height: "100%" }} resizeMode={"contain"}
                />
              </View>


              <RNText
                  style={[
                    { fontSize: fontSize, paddingHorizontal: 10 },
                    width > 500 && { marginTop: 50 },
                  ]}
              >
                🎉 Spin the wheel to win exciting prizes! 🎉
              </RNText>
              <RNText
                  style={[
                    {
                      fontSize: fontSize - 5,
                      marginTop: 10,
                      textAlign: "center",
                      paddingHorizontal: 10,
                    },
                  ]}
              >
                Click "Register" to spin the wheel and see what you win! Good luck! 🍀
              </RNText>
            </View>

            <GestureHandlerRootView style={styles.container}>
              <PanGestureHandler
                  onHandlerStateChange={handlePan}
                  enabled={enabled}
              >
                <View style={styles.container}>
                  {renderSvgWheel()}
                  {message !== null && (
                      <RNText style={[styles.messageText, { fontSize: fontSize }]}>
                        {message}
                      </RNText>
                  )}
                </View>
              </PanGestureHandler>
            </GestureHandlerRootView>

            {(!name || !phone) && (
                <CustomButton
                    onPress={newUserHandler}
                    style={styles.startButton}
                    textStyle={{ fontSize: fontSize }}
                >
                  Register!
                </CustomButton>
            )}
          </View>

          <PlayerDataModal
              name={name}
              setName={setName}
              phone={phone}
              setPhone={setPhone}
              onSubmit={startGameHandler}
              setModalVisible={setModalVisible}
              modalVisible={modalVisible}
          />

          <CongratulationsModal
              isVisible={congratulation}
              onClose={resetAll}
              winningPrize={prize}
              userName={name}
          />
        </ImageBackground>
      </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  messageText: {
    fontFamily: "Roboto",
    position: "absolute",
    bottom: width > 500 ? 70 : 20,
    fontWeight: "bold",
  },
  startButton: {
    marginHorizontal: 100,
    marginBottom: width > 500 ? 50 : 30,
  },
  logoContainer: {
    position: "absolute",
    zIndex: 10,
    top: "50%",
    left: "50%",
    transform: [{ translateX: "-50%"  }, { translateY: "-50%"  }],
  },
  logoImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
});

export default App;