import BackButton from "@/common/BackButton";
import AuthenButton from "@/common/Button";
import InputLabel from "@/common/InputLabel";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import React, {  useState } from "react";
import {
  Text,
  ToastAndroid,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  // Keyboard,
  // KeyboardEvent,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");
  
  // const [keyboardOffset, setKeyboardOffset] = useState(0);

  // useEffect(() => {
  //   // const checkToken = async () => {
  //   //   const token = await SecureStore.getItemAsync("token"); 
  //   //   if (token) {
  //   //     router.replace("/dashboard"); // Redirect to dashboard if token exists
  //   //   }
  //   // };
  //   // checkToken();

  //   const keyboardDidShow = Keyboard.addListener(
  //     "keyboardDidShow",
  //     (e: KeyboardEvent) => {
  //       setKeyboardOffset(e.endCoordinates.height);
  //     }
  //   );
  //   const keyboardDidHide = Keyboard.addListener("keyboardDidHide", () => {
  //     setKeyboardOffset(0);
  //   });

  //   return () => {
  //     keyboardDidShow.remove();
  //     keyboardDidHide.remove();
  //   };
  // }, []);

  const handleSignIn = async () => {
    if (email === "" || password === "") {
      ToastAndroid.show("Please fill in all fields", ToastAndroid.SHORT);
      return;
    }
    try {
      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/users/login`,
        { email: email, password: password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res) {
        await SecureStore.setItemAsync("token", res.data);
        ToastAndroid.show("Login successfully", ToastAndroid.SHORT);
        router.replace("/dashboard");
      }
    } catch (error) {
      console.log("Error during sign-in:", error);
      ToastAndroid.show(
        "Please enter right email and password",
        ToastAndroid.SHORT
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
         
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 items-center  justify-center">
          <BackButton />

          <LinearGradient
            className="absolute top-0 left-0 w-full h-full"
            colors={["#FFFFFF", "#C5C8DD", "#9EA4CB", "#606BAF", "#1D2760"]}
            locations={[0, 0.08, 0.16, 0.41, 1]}
            start={{ x: 0.5, y: 1 }}
            end={{ x: 0.5, y: 0 }}
          />

          <View className="h-[70%] bg-white w-full flex-col  items-center rounded-tl-[100px] justify-start gap-10 absolute bottom-0 py-14 ">
            <Text className="text-[28px] font-bold text-[#4737A5] tracking-[3px]">
              Welcome Back
            </Text>

            <View className="w-full flex flex-col gap-6 my-auto">
              <InputLabel
                title="Email"
                placeholder="Enter your email"
                onChangeText={(text) => setEmail(text)}
                secureTextEntry={false}
              />

              <InputLabel
                title="Password"
                placeholder="Enter your password"
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={!isPasswordVisible}
                showPasswordToggle={true}
                isPasswordVisible={isPasswordVisible}
                onPasswordVisibilityToggle={() =>
                  setIsPasswordVisible(!isPasswordVisible)
                }
                message={message}
              />

              <Link href="/" className="w-full ml-8 px-2">
                <Text className="text-[#303A71]  font-bold text-[14px]">
                  Forgot password?
                </Text>
              </Link>

              <Text className="text-center text-[#4737A5] font-bold text-[14px] underline-offset-2">
                Don’t have an account?{" "}
                <Link
                  href="/signup"
                  onPress={() => setMessage("")}
                  className="underline"
                >
                  Sign up
                </Link>
              </Text>

              <View className="w-full flex items-center justify-center">
                <AuthenButton
                  text="Sign In"
                  onPress={handleSignIn}
                  radientColor={["#303A71", "#4737A5", "#606BAF"]}
                  textColor="#fff"
                  width={200}
                  height={45}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Index;
