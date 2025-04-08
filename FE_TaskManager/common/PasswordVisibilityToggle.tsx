import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

/**
 * Component hiển thị nút con mắt động để xem/ẩn mật khẩu
 * @param isVisible - Trạng thái hiển thị mật khẩu
 * @param onToggle - Hàm callback khi người dùng nhấn vào nút
 */
const PasswordVisibilityToggle = ({
  isVisible,
  onToggle,
}: {
  isVisible: boolean;
  onToggle: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onToggle}
      className=" flex items-center justify-center w-8"
    >
      <Ionicons
        name={isVisible ? "eye-outline" : "eye-off-outline"} 
        size={20}
        color="#303A71"
      />
    </TouchableOpacity>
  );
};

export default PasswordVisibilityToggle;