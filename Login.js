import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons"; 
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";

import Global from "./Global";

export default function Login({ navigation }) {
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
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        if (response?.data?.account?.role !== "candidate") {
          Alert.alert("Lỗi", "Tài khoản hoặc mật khẩu không chính xác");
          return;
        }
        const token =
          response.headers["Authorization"] ||
          response.headers["authorization"];
        console.log('responseLogin', response.data?.account?.userId)
        Global.token = response.headers.authorization;
        Global.userId = response.data?.account?.userId;

        Alert.alert("Thành công", "Đăng nhập thành công!");

        navigation.navigate("HomeUser");
      }
    } catch (error) {
      if (error.response) {
        Alert.alert(
          "Lỗi",
          error.response.data?.message || "Đăng nhập thất bại."
        );
      } else {
        console.error("Error:", error.message);
        Alert.alert("Lỗi", "Không thể kết nối tới máy chủ.");
      }
    }
  };

  const navigateToRegister = () => {
    navigation.navigate("Signup");
  };

  const navigateToRecruiter = () => {
    navigation.navigate("LoginRecruiter");
  };

  return (
    <LinearGradient
      colors={["#2A3AD8", "#FFFFFF"]}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login</Text>

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

        <View style={styles.separator} />

        <View style={styles.footer}>
          <View style={styles.footerRow}>
            <Text style={styles.infoText}>Chưa có tài khoản?</Text>
            <TouchableOpacity onPress={navigateToRegister}>
              <Text style={styles.linkText}>Đăng ký</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.orText}>Hoặc</Text>

          <View style={styles.footerRow}>
            <Text style={styles.infoText}>Bạn muốn đăng tin tuyển dụng?</Text>
            <TouchableOpacity onPress={navigateToRecruiter}>
              <Text style={styles.linkText}>Nhà tuyển dụng</Text>
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
  },
  inputContainer: {
    width: "100%",
    marginBottom: 12,
  },
  passwordRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  googleButton: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    justifyContent: "center",
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: "#000",
    marginVertical: 10,
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
  forgotPasswordText: {
    fontSize: 16,
    color: "#007BFF",
    fontWeight: "bold",
  },
});