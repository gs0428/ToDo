import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default AddCategory = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>카테고리 추가</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 100,
    fontSize: 38,
    fontWeight: "600",
    color: "white",
  },
});
