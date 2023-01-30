import React, { useEffect, useReducer, useState } from "react";
import Constants from "expo-constants";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StatusBar,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { RNG } from "./util/rng";
import { TriangleColorPicker } from "react-native-color-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

type DiceStateType = {
  D4?: number;
  D6?: number;
  D8?: number;
  D10?: number;
  D12?: number;
  D20?: number;
};

type ActionType = {
  type: string;
  value: number;
};

type ColorsType = {
  background: string;
  die: string;
  font: string;
};

const initialDiceState: DiceStateType = {
  D4: 0,
  D6: 0,
  D8: 0,
  D10: 0,
  D12: 0,
  D20: 0,
};

const rows: Array<Array<[string, number]>> = [
  [
    ["D4", 4],
    ["D6", 6],
  ],
  [
    ["D8", 8],
    ["D10", 10],
  ],
  [
    ["D12", 12],
    ["D20", 20],
  ],
];

const reducer = (state: DiceStateType, action: ActionType) => {
  switch (action.type) {
    case "reset":
      return initialDiceState;
    default:
      return { ...state, [action.type]: action.value };
  }
};

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialDiceState);
  const [modalVisible, setModalVisible] = useState(false);
  const [finishedLoading, setFinishedLoading] = useState(false);
  // https://coolors.co/palette/000814-001d3d-003566-ffc300-ffd60a
  // https://coolors.co/palette/0d1b2a-1b263b-415a77-778da9-e0e1dd

  const [bgColor, setBgColor] = useState("#000814");
  const [dieColor, setDieColor] = useState("#001d3d");
  const [fontColor, setFontColor] = useState("#e0e1dd");
  const [colorFn, setColorFn] = useState(() => setBgColor);

  const rollEffect = (die: string, dieMax: number, count: number = 0, speed: number = 30) => {
    count++;

    dispatch({ type: die, value: RNG(dieMax) });

    if (count >= 25) {
      return;
    }
    speed = speed * 1.1;
    setTimeout(() => rollEffect(die, dieMax, count, speed), speed);
  };

  // useEffect(() => {
  //   const fetchColors = async () => {
  //     const colors: { background: string; die: string; font: string } = JSON.parse(
  //       (await AsyncStorage.getItem("diceColors")) || "{}"
  //     );
  //     const { background, die, font } = colors;
  //     setBgColor(background);
  //     setDieColor(die);
  //     setFontColor(font);
  //   };
  //   fetchColors();
  //   setFinishedLoading(true);
  // }, []);

  // const handleColorChange = async () => {
  //   const savedColors: ColorsType = {
  //     background: bgColor,
  //     die: dieColor,
  //     font: fontColor,
  //   };
  //   try {
  //     await AsyncStorage.setItem("diceColors", JSON.stringify(savedColors));
  //   } catch (e) {
  //     console.warn(e);
  //   }
  // };

  // if (!finishedLoading) {
  //   return (
  //     <View style={{ ...styles.container }}>
  //       <ActivityIndicator size="large" color="blue" />
  //     </View>
  //   );
  // }

  return (
    <View style={{ ...styles.container, backgroundColor: bgColor }}>
      <StatusBar />
      <View style={styles.header}>
        <Text style={styles.headerText}>Dice Anywhere</Text>
        <Pressable style={{ padding: 5 }} onPress={() => dispatch({ type: "reset", value: 0 })}>
          <Text>Clear</Text>
        </Pressable>
        <Pressable
          style={styles.settingsButton}
          onPress={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <FontAwesome name="cog" size={32} color="black" />
        </Pressable>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <TouchableOpacity onPressOut={() => setModalVisible(!modalVisible)} style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View style={{ backgroundColor: "#06191d", ...styles.modalView }}>
                <Pressable
                  style={{ position: "absolute", top: 15, right: 20 }}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <FontAwesome name="close" size={32} color="black" />
                </Pressable>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                    marginTop: 40,
                  }}
                >
                  <Pressable
                    style={{ backgroundColor: "snow", ...styles.fnSelectButton }}
                    onPress={() => {
                      setColorFn(() => setBgColor);
                    }}
                  >
                    <Text style={{ color: "#353839", fontSize: 22, fontWeight: "800" }}>Background</Text>
                  </Pressable>
                  <Pressable
                    style={{ backgroundColor: "snow", ...styles.fnSelectButton }}
                    onPress={() => {
                      setColorFn(() => setDieColor);
                    }}
                  >
                    <Text style={{ color: "#353839", fontSize: 22, fontWeight: "800" }}>Die</Text>
                  </Pressable>
                  <Pressable
                    style={{ backgroundColor: "snow", ...styles.fnSelectButton }}
                    onPress={() => {
                      setColorFn(() => setFontColor);
                    }}
                  >
                    <Text style={{ color: "#353839", fontSize: 22, fontWeight: "800" }}>Font</Text>
                  </Pressable>
                </View>
                <TriangleColorPicker
                  defaultColor={""}
                  onColorSelected={(color) => {
                    colorFn(color);
                  }}
                  style={{ flex: 1, width: 200, marginBottom: 15 }}
                />
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>
      </View>
      {rows.map((row, idx) => (
        <View key={`row-${idx}`} style={styles.row}>
          {row.map((dice: [string, number]) => {
            const [die, value] = dice;
            return (
              <View key={die} style={{ backgroundColor: dieColor, ...styles.card }}>
                <Pressable
                  style={{
                    flex: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    // borderWidth: 1,
                    // borderColor: "black",
                  }}
                  onPress={() => rollEffect(die, value)}
                >
                  <Text style={{ color: fontColor, ...styles.diceName }}>{die}</Text>
                  <Text style={{ color: fontColor, ...styles.diceValue }}>{state[die as keyof DiceStateType]}</Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // marginTop: Constants.statusBarHeight,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
    height: 70,
    width: "100%",
  },
  headerText: {
    fontSize: 24,
    color: "#e3e4db",
  },
  settingsButton: {
    padding: 4,
  },
  row: {
    flex: 1,
    flexDirection: "row",
  },
  card: {
    flex: 1,
    borderRadius: 15,
    margin: 10,
    // shadow box
    elevation: 50,
    shadowColor: "black",
  },
  diceName: {
    fontSize: 20,
    position: "absolute",
    top: 10,
    left: 20,
  },
  diceValue: {
    fontSize: 50,
    fontWeight: "800",
  },
  criticalText: {
    fontSize: 26,
    fontWeith: "800",
  },
  // Modal
  centeredView: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    height: "70%",
    margin: 20,
    width: "92%",
    borderRadius: 20,
    borderColor: "grey",
    borderWidth: 1,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    elevation: 5,
  },
  fnSelectButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    borderWidth: 2,
    borderColor: "grey",
    borderRadius: 10,
    padding: 5,
    paddingHorizontal: 10,
  },
});
