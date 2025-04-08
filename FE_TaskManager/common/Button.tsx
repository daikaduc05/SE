import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { TouchableOpacity, Text, DimensionValue } from "react-native";

interface AuthenButtonProps {
  // Các props cho component
  backgroundColor?: string; // Màu nền của nút
  radientColor?: readonly [string, string, ...string[]]; // Màu nền của nút
  textColor?: string; // Màu chữ
  width?: DimensionValue; // Chiều rộng nút
  height?: DimensionValue; // Chiều cao nút
  text: string; // Text hiển thị
  onPress: () => void; // Hàm xử lý khi nhấn nút
}

/**
 * Component nút xác thực có thể tái sử dụng
 * @param backgroundColor - Màu nền của nút (mặc định: white)
 * @param textColor - Màu chữ (mặc định: #4737A5)
 * @param width - Chiều rộng nút (mặc định: 100px)
 * @param height - Chiều cao nút (mặc định: 50px)
 * @param text - Text hiển thị trên nút
 * @param onPress - Hàm xử lý khi nhấn nút
 */
const AuthenButton: React.FC<AuthenButtonProps> = ({
  backgroundColor = ["#fff"], // Mặc định gradient từ trắng sang tím
  radientColor, // Mặc định gradient từ trắng sang tím
  textColor = "#4737A5",
  width = 100,
  height = 50,
  text,
  onPress,
}) => {
  return (
    <TouchableOpacity
      className="m-auto"
      onPress={onPress}
      style={{
        width: width,
        height: height,
        borderRadius: 24,
      }}
    >
      <LinearGradient
        className="m-auto"
        colors={radientColor || ["#fff", "#fff"]}
        style={{
          height: "100%",
          width: "100%",
          borderRadius: 24,
          alignItems: "center",
          justifyContent: "center",
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text
          className="font-bold text-[18px]"
          style={{
            color: textColor,
          }}
        >
          {text}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default AuthenButton;
