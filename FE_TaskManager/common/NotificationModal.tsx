import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";

interface NotificationHoverProps {
  isVisible: boolean;
  onClose: () => void;
}

const NotificationHover: React.FC<NotificationHoverProps> = ({
  isVisible,
  onClose,
}) => {
  if (!isVisible) return null;

  return (
    <View className="absolute top-28 right-5 bg-white shadow-xl rounded-xl w-[300px] p-4 z-50">
      <Text className="text-[#1D2760] font-bold text-lg mb-2">Notifications</Text>

      {/* Example Notifications */}
      <View className="mb-3">
        <Text className="text-gray-600">🔔 You have a new project invite.</Text>
        <Text className="text-gray-500 text-xs mt-1">Just now</Text>
      </View>

      {/* Button to go to full notification page */}
      <TouchableOpacity
        onPress={() => {
          onClose();
        //   router.push("/notifications");
        }}
        className="bg-[#2f3f96] rounded-lg py-2 px-3 mt-2 flex-row items-center justify-center"
      >
        <Ionicons name="expand-outline" size={20} color="white" />
        <Text className="text-white ml-2">Open Fullscreen</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NotificationHover;
