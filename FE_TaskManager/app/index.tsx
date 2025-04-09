import { Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import AuthenButton from "@/common/Button";

export default function Index() {
  // const width =  useSharedValue(100)
  const handleSignIn = () => {
    router.push("/login");
    // width.value = width.value + 100
  };
  const handleSignUp = () => {
    router.push("/signup");
  };
  return (
    <View className="w-full h-full flex items-center justify-center ">
      <LinearGradient
        className="absolute top-0 left-0 w-full h-full"
        colors={["#FFFFFF", "#C5C8DD", "#9EA4CB", "#606BAF", "#1D2760"]}
        locations={[0, 0.08, 0.16, 0.41, 1]}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
      />
      <View className="flex items-center justify-center gap-3 ">
        <Text className="text-[30px] font-semibold text-white tracking-[7px] ">
          Planify
        </Text>
        <Text className="text-white font-semibold text-[20px]">
          “Plan your day, own your future."
        </Text>
      </View>
      <View className="flex flex-row absolute bottom-10 items-center justify-around gap-3 mt-10 w-full">
        <AuthenButton
          text="Sign up"
          onPress={handleSignUp}
        />
        <AuthenButton 
          text="Sign in"
          onPress={handleSignIn}
        />
      </View>
    </View>
  );
}
