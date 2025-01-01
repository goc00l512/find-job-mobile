import "react-native-gesture-handler";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import JobDetail from "./JobDetail";
import Login from "./Login";
import Signup from "./Signup";
import LoginRecruiter from "./LoginRecruiter";
import Home from "./Home";
import HomeUser from "./HomeUser";
import BottomBar from "./BottomBar";
import JobPosting from "./JobPosting";
import UserDetail from "./UserDetail";
import PostManager from "./PostManager";
import CandidateManager from "./CandidateManager";
import Job from "./Job";
import HomeRecruiter from "./HomeRecruiter";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LoginRecruiter"
            component={LoginRecruiter}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="JobDetail"
            component={JobDetail}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CandidateManager"
            component={CandidateManager}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HomeUser"
            component={HomeUser}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="BottomBar"
            component={BottomBar}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="JobPosting"
            component={JobPosting}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="UserDetail"
            component={UserDetail}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PostManager"
            component={PostManager}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CandidateManger"
            component={CandidateManager}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Job"
            component={Job}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HomeRecruiter"
            component={HomeRecruiter}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}