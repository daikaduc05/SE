import BackButton from "@/common/BackButton";
import AuthenButton from "@/common/Button";
import InputLabel from "@/common/InputLabel";
import { fLogin } from "@/fakedb";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Text,  View } from "react-native";
import { KeyboardAvoidingView, Platform } from "react-native";
import * as SecureStore from 'expo-secure-store';

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");
  const info = fLogin.find(
    (item) => item.email === email && item.password === password
  );
  const handleSignIn = async () => {
    if (info) {
      setMessage("");
      await SecureStore.setItemAsync("user", email);
      router.push("/dashboard");
    } else {
      setMessage("Invalid email or password");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="w-screen h-screen flex items-center justify-center"
    >
      <BackButton href="/" />
    
      <LinearGradient
        className="absolute top-0 left-0 w-full h-full"
        colors={["#FFFFFF", "#C5C8DD", "#9EA4CB", "#606BAF", "#1D2760"]}
        locations={[0, 0.08, 0.16, 0.41, 1]}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
      />
      <View className="h-[60%] bg-white w-full flex items-center rounded-tl-[100px] justify-start gap-10 absolute bottom-0 py-14 ">
        <Text className="text-[28px] font-bold text-[#4737A5] tracking-[3px]">
          Welcome Back
        </Text>
        <View className="w-full flex flex-col gap-6">
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

          <Link href="/" className="w-full px-10 flex flex-col  ">
            <Text className=" text-[#303A71] font-bold text-[14px]">
              Forgot password?
            </Text>
          </Link>

          <Text className="text-center text-[#4737A5] font-bold text-[14px] underline-offset-2">
            Don't have an account?{" "}
            <Link onPress={() => setMessage("")} href="/signup" className="underline">
              Sign up
            </Link>
          </Text>
          <View className="w-full flex items-center justify-center">
          <AuthenButton
            text="Sign In"
            onPress={handleSignIn}
            radientColor={['#303A71', '#4737A5', '#606BAF']} 
            textColor="#fff"
            width={200}
            height={45}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Index;
