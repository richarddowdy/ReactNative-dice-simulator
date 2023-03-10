import React, { useReducer, useState } from "react";
import Constants from "expo-constants";
import {
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

type StateType = {
  D4: number;
  D6: number;
  D8: number;
  D10: number;
  D12: number;
  D20: number;
};

type ActionType = {
  type: string;
  value: number;
};

const initialState: StateType = {
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

const reducer = (state: StateType, action: ActionType) => {
  switch (action.type) {
    default:
      return { ...state, [action.type]: action.value };
  }
};

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [modalVisible, setModalVisible] = useState(false);
  const [bgColor, setBgColor] = useState("#fffafa");
  const [dieColor, setDieColor] = useState("#444");
  const [colorFn, setColorFn] = useState(() => setBgColor);

  return (
    <View style={{ ...styles.container, backgroundColor: bgColor }}>
      <StatusBar />
      <View style={styles.header}>
        <Text style={styles.headerText}>DnD Dice Anywhere</Text>
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
              <View style={styles.modalView}>
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
                    style={styles.fnSelectButton}
                    onPress={() => {
                      setColorFn(() => setBgColor);
                    }}
                  >
                    <Text style={{ fontSize: 22, fontWeight: "800" }}>Background</Text>
                  </Pressable>
                  <Pressable
                    style={styles.fnSelectButton}
                    onPress={() => {
                      setColorFn(() => setDieColor);
                    }}
                  >
                    <Text style={{ fontSize: 22, fontWeight: "800" }}>Die</Text>
                  </Pressable>
                </View>
                <TriangleColorPicker
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
              <Pressable
                key={die}
                style={{ ...styles.card, backgroundColor: dieColor }}
                onPress={() => {
                  dispatch({ type: die, value: RNG(value) });
                }}
              >
                <Text style={styles.diceName}>{die}</Text>
                <Text style={styles.diceValue}>{state[die as keyof StateType]}</Text>
                {state[die as keyof StateType] === 20 && <Text style={styles.criticalText}>"Critical!!!"</Text>}
              </Pressable>
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
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 5,
    borderColor: "red",
    borderRadius: 15,
    margin: 5,
  },
  diceName: {
    fontSize: 20,
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
    height: "60%",
    margin: 20,
    width: "80%",
    backgroundColor: "snow",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  fnSelectButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 10,
    padding: 5,
    paddingHorizontal: 10,
    backgroundColor: "teal",
  },
});
