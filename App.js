import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from "react-native";
import { theme } from "./color";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";

const STORAGE_KEY = "@toDos";
const REMEMBER_KEY = "@location";

export default function App() {
  useEffect(() => {
    loadToDos();
  }, []);
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const travel = () => {
    setWorking(false);
    AsyncStorage.setItem(REMEMBER_KEY, JSON.stringify(working.toString()));
  };
  const work = () => {
    setWorking(true);
    AsyncStorage.setItem(REMEMBER_KEY, JSON.stringify(working.toString()));
  };
  const onChangeText = (e) => setText(e);
  const saveToDos = (toSave) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  const loadToDos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      const loc = await AsyncStorage.getItem(REMEMBER_KEY);
      setWorking(loc !== JSON.stringify("false") ? true : false);
      setToDos(s ? JSON.parse(s) : null);
    } catch (e) {
      console.log(e);
    }
  };
  const addToDo = async () => {
    if (text === "") {
      return;
    }
    try {
      const newToDos = {
        ...toDos,
        [Date.now()]: { text, working, done: "false" },
      };
      setToDos(newToDos);
      await saveToDos(newToDos);
      setText("");
    } catch (e) {
      console.log(e);
    }
  };
  const deleteToDo = async (key) => {
    Alert.alert("Delete ToDo?", "Are you Sure?", [
      { text: "Cancel" },
      {
        text: "I'm Sure",
        style: "destructive",
        onPress: async () => {
          try {
            const newToDos = { ...toDos };
            delete newToDos[key];
            setToDos(newToDos);
            await saveToDos(newToDos);
          } catch (e) {
            console.log(e);
          }
        },
      },
    ]);
    return;
  };
  const completeToDo = (key) => {
    const newToDos = { ...toDos };
    const d = newToDos[key].done;
    let done = !d;
    newToDos[key].done = done;
    setToDos(newToDos);
    saveToDos(newToDos);
  };
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{ ...styles.btnText, color: working ? "white" : theme.grey }}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{ ...styles.btnText, color: !working ? "white" : theme.grey }}>Travel</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        onSubmitEditing={addToDo}
        value={text}
        returnKeyType="done"
        onChangeText={onChangeText}
        placeholder={working ? "Add a ToDo" : "where do you want to go?"}
        style={styles.input}
      />
      <ScrollView>
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working ? (
            <View style={styles.toDo} key={key}>
              <Text
                style={{
                  ...styles.toDoText,
                  textDecorationLine: toDos[key].done ? "none" : "line-through",
                  color: toDos[key].done ? "black" : "grey",
                }}
              >
                {toDos[key].text}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                <TouchableOpacity onPress={() => completeToDo(key)}>
                  {toDos[key].done ? (
                    <FontAwesome5 style={styles.icon} name="check-square" size={22} color="black" />
                  ) : (
                    <FontAwesome style={styles.icon} name="check-square" size={22} color="black" />
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteToDo(key)}>
                  <FontAwesome style={styles.icon} name="trash" size={22} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    fontSize: 16,
    fontWeight: "500",
    textDecorationLine: "line-through",
  },
  icon: {
    marginLeft: 15,
  },
});
