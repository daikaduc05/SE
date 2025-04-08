import { useEffect, useState } from "react";
import {
  Button,
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ToastAndroid,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function ImagePickerExample({
  setImage,
}:{
 
  setImage: (image: string) => void;
}) {
  
  

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
    else {
      ToastAndroid.show('Vui lòng chọn ảnh', ToastAndroid.SHORT);
    }
  };

  return (
    <TouchableOpacity
      onPress={pickImage}
      className="bg-[#D9D9D9] px-6 py-4  mt-4  rounded-xl"
    >
      <Text className="text-black  font-bold">Choose photo</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
});
