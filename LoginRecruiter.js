import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient"; 
import axios from "axios"; 
import Global from "./Global";

export default function LoginRecruiter({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Vui lòng điền đầy đủ các trường.");
      return;
    }

    try {
      const response = await axios.post(
        "https://auth-service-job-system.onrender.com/api/auth", 
        {
          email: email.trim(),
          password: password.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json", 
          },
        }
      );
      console.log('reeeeee')
      if (response.status === 200 || response.status === 201) {
        if (response?.data?.account?.role !== "recruiter") {
          Alert.alert("Lỗi", "Tài khoản hoặc mật khẩu không chính xác");
          return;
        }
        console.log('xxxxx=====', response?.headers?.authorization)
        console.log('responseLoginRecruiter', response.data?.account?.userId)

        Global.token = response.headers.authorization;
        Global.userId = response.data?.account?.userId;
        console.log("xxxxxx2222", Global.token);
        Alert.alert("Đăng nhập thành công", "Chào mừng bạn quay lại!");
        navigation.navigate("BottomBar"); 
      }
    } catch (error) {
      if (error.response) {
        Alert.alert(
          "Đăng nhập thất bại",
          error.response.data.message || "Kiểm tra lại thông tin và thử lại."
        );
      } else {
        Alert.alert("Lỗi mạng", "Không thể kết nối đến máy chủ.");
      }
    }
  };

  const navigateToJobSeeker = () => {
    navigation.navigate("Login");
  };

  return (
    <LinearGradient
      colors={["#2A3AD8", "#FFFFFF"]}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login for Recruiter</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Email <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.passwordRow}>
            <Text style={styles.label}>
              Mật khẩu <Text style={styles.required}>*</Text>
            </Text>
          </View>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nhập mật khẩu"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="grey"
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Đăng nhập</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <View style={styles.footerRow}>
            <Text style={styles.infoText}>Bạn muốn tìm việc?</Text>
            <TouchableOpacity onPress={navigateToJobSeeker}>
              <Text style={styles.linkText}>Người tìm việc</Text>
            </TouchableOpacity>
          </View>
        </View>
        <StatusBar style="auto" />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 35,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: "bold",
    color: "#000",
  },
  required: {
    color: "red",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  passwordRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 12,
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: "#007BFF",
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#007BFF",
    fontWeight: "bold",
  },
  footer: {
    marginTop: 20,
    width: "100%",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  infoText: {
    fontSize: 16,
    color: "#000",
    marginRight: 5,
  },
  linkText: {
    fontSize: 16,
    color: "#007BFF",
    fontWeight: "bold",
  },
  orText: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
    marginVertical: 10,
  },
});