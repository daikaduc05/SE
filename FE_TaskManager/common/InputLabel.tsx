import React from "react";
import { Text, TextInput, View } from "react-native";
import PasswordVisibilityToggle from "./PasswordVisibilityToggle";

const InputLabel = ({
  title,
  placeholder,
  secureTextEntry,
  onChangeText,
  showPasswordToggle = false,
  isPasswordVisible = false,
  onPasswordVisibilityToggle,
  message = '', // Thêm prop message với giá trị mặc định là chuỗi rỗng
}: {
  title: string;
  placeholder: string;
  secureTextEntry?: boolean;
  onChangeText?: (text: string) => void;
  showPasswordToggle?: boolean;
  isPasswordVisible?: boolean;
  onPasswordVisibilityToggle?: () => void;
  message?: string; // Thêm kiểu dữ liệu cho message
}) => {
  return (
    <View className="w-full px-10 flex flex-col gap-3">
      <Text className="text-black font-bold text-[14px]">{title}</Text>
      <View className="relative flex flex-col gap-1">
        <View className="relative flex flex-row items-center gap-2 justify-between">
          <TextInput
            className={`border border-opacity-40 px-2 w-full ${message ? 'border-red-500' : 'border-slate-400'} py-3 rounded-2xl ${showPasswordToggle ? 'pr-12' : ''}`}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            onChangeText={onChangeText} 
          />
          {showPasswordToggle && onPasswordVisibilityToggle && (
            <PasswordVisibilityToggle
              isVisible={isPasswordVisible}   
              onToggle={onPasswordVisibilityToggle}
            />
          )}
        </View>
        {/* Hiển thị message nếu có */}
        {message && (
          <Text style={{color: '#FF0000'}} className=" text-[12px] pl-2">{message}</Text>
        )}
      </View>
    </View>
  );
};

export default InputLabel;
