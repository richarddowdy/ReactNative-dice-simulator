import React, { useReducer } from "react";
import Constants from "expo-constants";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { RNG } from "./util/rng";

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

const rows: Array<Array<Array<string | number>>> = [
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
  console.log("current action", action);
  console.log("current state", state);
  switch (action.type) {
    default:
      return { ...state, [action.type]: action.value };
  }
};

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <View style={styles.container}>
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 50,
          backgroundColor: "blue",
          width: "100%",
        }}
      >
        <Text>DnD Dice Anywhere</Text>
      </View>
      {rows.map((row, idx) => (
        <View key={`row-${idx}`} style={styles.row}>
          {row.map((dice: Array<any>) => {
            const [die, value] = dice;
            return (
              <Pressable
                key={die}
                style={styles.card}
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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Constants.statusBarHeight,
  },
  row: {
    flex: 1,
    flexDirection: "row",
  },
  card: {
    flex: 1,
    backgroundColor: "grey",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 5,
    borderColor: "red",
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
});
