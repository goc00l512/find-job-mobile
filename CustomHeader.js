import React from "react";
import { 
  View, 
  TextInput, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

function CustomHeader({ search, onSearchChange, onApplyFilter }) {
  const navigation = useNavigation(); 

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.navigate("UserDetail")}>
        <Image
          source={require("./assets/ava1.png")} 
          style={styles.avatar}
        />
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Tìm kiếm"
          style={styles.searchInput}
          value={search}
          onChangeText={(text) => onSearchChange(text)}
        />
        <TouchableOpacity style={styles.searchIcon} onPress={() => onApplyFilter()}>
          <Icon name="search" size={24} color="#888" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 60,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    height: 40,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  searchIcon: {
    marginLeft: 5,
  },
});