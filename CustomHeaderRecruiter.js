import React from "react";
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import Global from "./Global"; 

function CustomHeaderRecruiter({ search, onSearchChange, onApplyFilter }) {
  const navigation = useNavigation();

  const handleLogout = () => {
    Global.token = "";
    Global.userId = "";
    navigation.navigate("LoginRecruiter");
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={handleLogout}>
        <Icon name="logout" size={28} color="#000" style={styles.logoutIcon} />
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

export default CustomHeaderRecruiter;

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
  logoutIcon: {
    marginRight: 10,
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