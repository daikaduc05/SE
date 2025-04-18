import { router, type RelativePathString } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Component nút back để quay lại màn hình trước đó
const BackButton = ({
  urlBack,
}:{
  urlBack?: RelativePathString;
}) => {
  return (
    <TouchableOpacity
      onPress={() => urlBack ? router.push(urlBack) : router.back()}
      style={{
        position: "absolute", 
        top: 30,
        left: 10,
        zIndex: 10,
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 4
      }}
    >
      <Ionicons
        name="arrow-back"
        size={20}
        className="text-end mr-6 w-24"
        color="white"
      />
    </TouchableOpacity>
  );
};

export default BackButton;
