import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from "react-native";
import { theme } from "./color";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";

// 주석 다 풀면 Travel 페이지 나옴

const STORAGE_KEY = "@toDos";
const REMEMBER_KEY = "@location";

export default function App() {
  useEffect(() => {
    loadToDos();
  }, []);

  const date = new Date();
  const [year, setYear] = useState(date.getFullYear());
  const [month, setMonth] = useState(date.getMonth() + 1);
  const [day, setDay] = useState(date.getDate());
  const time = new Date().getTime();
  const DateID = year + "" + month + "" + day + "" + time;
  const today = year + "" + month + "" + day;
  // const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const [editText, setEditText] = useState("");
  // const travel = async () => {
  //   try {
  //     setWorking(false);
  //     await AsyncStorage.setItem(REMEMBER_KEY, working.toString());
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  // const work = async () => {
  //   try {
  //     setWorking(true);
  //     await AsyncStorage.setItem(REMEMBER_KEY, working.toString());
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  const onChangeText = (e) => setText(e);
  const saveToDos = (toSave) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  const loadToDos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      const loc = await AsyncStorage.getItem(REMEMBER_KEY);
      setToDos(JSON.parse(s));
      // setWorking(loc !== "false" ? true : false);
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
        [DateID]: { text, done: "false", isEditing: "false", date: today },
        //working,
      };
      console.log(newToDos);
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
    newToDos[key].done = !d;
    setToDos(newToDos);
    saveToDos(newToDos);
  };
  const editToDo = (key) => {
    const newToDos = { ...toDos };
    const edit = newToDos[key].isEditing;
    newToDos[key].isEditing = !edit;
    setToDos(newToDos);
    saveToDos(newToDos);
  };
  const changeText = (e) => setEditText(e);

  const editedToDo = async (key) => {
    const newToDos = { ...toDos };
    const edit = newToDos[key].isEditing;
    if (editText === "") {
      newToDos[key].isEditing = !edit;
      setToDos(newToDos);
      saveToDos(newToDos);
      return;
    }
    try {
      newToDos[key].isEditing = !edit;
      newToDos[key].text = editText;
      setEditText("");
      setToDos(newToDos);
      saveToDos(newToDos);
    } catch (e) {
      console.log(e);
    }
  };

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setYear(date.getFullYear());
    setMonth(date.getMonth() + 1);
    setDay(date.getDate());
    hideDatePicker();
  };

  const addCtg = () => {};
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        {/* <TouchableOpacity onPress={work}> */}
        <TouchableOpacity>
          <Text style={{ ...styles.btnText, color: "white" }}>To Do List</Text>

          {/* <Text style={{ ...styles.btnText, color: working ? "white" : theme.grey }}>Work</Text> */}
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={travel}>
          <Text style={{ ...styles.btnText, color: !working ? "white" : theme.grey }}>Travel</Text>
        </TouchableOpacity> */}
      </View>
      <TextInput
        onSubmitEditing={addToDo}
        value={text}
        returnKeyType="done"
        onChangeText={onChangeText}
        placeholder="할 일 추가"
        // placeholder={working ? "Add a ToDo" : "where do you want to go?"}
        style={styles.input}
      />
      <View style={styles.date}>
        <FontAwesome5 onPress={showDatePicker} name="calendar-alt" size={24} color="white" />
        <Text onPress={showDatePicker} style={styles.dateTxt}>
          {year}년 {month}월 {day}일
        </Text>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          display="inline"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          confirmTextIOS="선택"
          cancelTextIOS="취소"
        />
      </View>
      <View style={{ marginBottom: 10, alignItems: "flex-end" }}>
        <Text onPress={addCtg} style={{ fontSize: 20, color: "white" }}>
          카테고리 추가
        </Text>
      </View>
      <ScrollView>
        {
          Object.keys(toDos).map((key) => (
            // toDos[key].working === working ? (
            <View
              style={{ ...styles.toDo, display: today === toDos[key].date ? "flex" : "none", backgroundColor: toDos[key].done ? "#404040" : "#A6A6A6" }}
              key={key}
            >
              <TextInput
                placeholder="..."
                placeholderTextColor="#D9D9D9"
                onSubmitEditing={() => editedToDo(key)}
                value={editText}
                returnKeyType="done"
                onChangeText={changeText}
                style={{ ...styles.edit, display: toDos[key].isEditing ? "none" : "" }}
              />

              <Text
                style={{
                  ...styles.toDoText,
                  textDecorationLine: toDos[key].done ? "none" : "line-through",
                  color: toDos[key].done ? "black" : "#494949",
                  display: toDos[key].isEditing ? "" : "none",
                }}
              >
                {toDos[key].text}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                <TouchableOpacity disabled={toDos[key].done ? false : true} onPress={() => editToDo(key)}>
                  <Feather style={{ ...styles.icon, color: toDos[key].done ? "white" : "#494949" }} name="edit" size={22} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => completeToDo(key)}>
                  {toDos[key].done ? (
                    <FontAwesome5 style={styles.icon} name="check-square" size={22} color="black" />
                  ) : (
                    <FontAwesome style={styles.icon} name="check-square" size={22} color="black" />
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteToDo(key)}>
                  <FontAwesome style={styles.icon} name="trash" size={22} color="#C01111" />
                </TouchableOpacity>
              </View>
            </View>
          ))
          //     : null
          // )
        }
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
    marginTop: 100,
    alignItems: "center",
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
  edit: {
    flex: 1,
    fontSize: 16,
    color: "#D9D9D9",
  },
  date: {
    marginBottom: 20,
    paddingVertical: 20,
    justifyContent: "center",
    flexDirection: "row",
  },
  dateTxt: {
    fontSize: 20,
    color: "white",
    fontWeight: "600",
    marginLeft: 10,
  },
});
