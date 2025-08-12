import BackButton from "@/common/BackButton";
import AuthenButton from "@/common/Button";
import InputLabel from "@/common/InputLabel";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
  ScrollView,
  Keyboard,
  ToastAndroid,
} from "react-native";

const Signup = () => {
  // Khai báo các state để quản lý form đăng ký
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false); // Thêm state để theo dõi bàn phím

  // Theo dõi sự kiện hiển thị/ẩn bàn phím
  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      console.log("Password and confirm password do not match");
    } else if (
      fullName === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      ToastAndroid.show("Please fill in all fields", ToastAndroid.SHORT);
    } else if (email.includes("@gmail.com") === false) {
      ToastAndroid.show("Invalid email", ToastAndroid.SHORT);
    } else {
      try {
        const res = await axios.post(
          `https://planify-fvgwghb4dzgna2er.southeastasia-01.azurewebsites.net/users`,
          {
            name: fullName,
            email: email,
            password: password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (res) {
          console.log(res.data);
          ToastAndroid.show(
            "Sign up successfully, please sign in to continue",
            ToastAndroid.SHORT
          );
          router.replace("/login");
        } else {
          console.log("Sign up failed");
        }
      } catch (error) {
        ToastAndroid.show(
          "Sign up failed, please try again later",
          ToastAndroid.SHORT
        );
      }
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="w-screen h-screen"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 items-center justify-center">
          <BackButton />
          <LinearGradient
            className="absolute top-0 left-0 w-full h-full"
            colors={["#FFFFFF", "#C5C8DD", "#9EA4CB", "#606BAF", "#1D2760"]}
            locations={[0, 0.08, 0.16, 0.41, 1]}
            start={{ x: 0.5, y: 1 }}
            end={{ x: 0.5, y: 0 }}
          />

          <View
            className={`${
              keyboardVisible ? "h-[100%]" : "h-[80%]"
            } bg-white w-full flex items-center rounded-tl-[100px] justify-start gap-5 absolute bottom-0 py-10`}
          >
            <Text className="text-[28px] font-bold text-[#4737A5] tracking-[3px] mb-2">
              Create Account
            </Text>

            <View className="w-full flex flex-col gap-3 my-auto">
              <InputLabel
                onChangeText={(text) => setFullName(text)}
                title="Full Name"
                placeholder="Enter your full name"
                secureTextEntry={false}
              />
              <InputLabel
                onChangeText={(text) => setEmail(text)}
                title="Email"
                placeholder="Enter your email"
                secureTextEntry={false}
              />
              <InputLabel
                onChangeText={(text) => setPassword(text)}
                title="Password"
                placeholder="Enter your password"
                secureTextEntry={!isPasswordVisible}
                showPasswordToggle={true}
                isPasswordVisible={isPasswordVisible}
                onPasswordVisibilityToggle={() =>
                  setIsPasswordVisible(!isPasswordVisible)
                }
              />
              <InputLabel
                onChangeText={(text) => setConfirmPassword(text)}
                title="Confirm Password"
                placeholder="Confirm your password"
                secureTextEntry={!isConfirmPasswordVisible}
                message={
                  password === confirmPassword
                    ? ""
                    : "Confirm password is not match"
                }
                showPasswordToggle={true}
                isPasswordVisible={isConfirmPasswordVisible}
                onPasswordVisibilityToggle={() =>
                  setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                }
              />
            </View>

            {/* Phần đăng nhập và nút đăng ký */}
            <View className="w-full px-10 ">
              <Text className="text-[#4737A5] text-center font-bold text-[14px]">
                Already have an account?{" "}
                <Link href="/login" className="underline">
                  Sign in
                </Link>
              </Text>
              <View className="w-full flex items-center justify-center mt-4">
                <AuthenButton
                  text="Sign Up"
                  onPress={handleSignUp}
                  radientColor={["#303A71", "#4737A5", "#606BAF"]}
                  textColor="#fff"
                  width={200}
                  height={45}
                />
              </View>
            </View>
          </View>
          {/* Thêm padding bottom để tránh bị che bởi bàn phím */}
          <View className="h-[100px]"></View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Signup;
