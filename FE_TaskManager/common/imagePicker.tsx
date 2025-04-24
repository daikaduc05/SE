import { useEffect, useState } from "react";
import {
  TouchableOpacity,
  Text,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

// ⚠️ Nhớ thay bằng thông tin thật của bạn
const CLOUD_NAME = "dqupovatf"; // ví dụ: "myapp123"
const UPLOAD_PRESET = "demo_frame_print"; // ví dụ: "expo_upload"
import * as SecureStore from "expo-secure-store";

export default function ImagePickerExample({
  setImage,
  setImageSelect,
}: {
  setImage: (image: string) => void;
  setImageSelect: (image: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  useEffect(() => {
    console.log("CLOUD_NAME", CLOUD_NAME);
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageSelect(uri); // Gửi URI về component cha
      uploadToCloudinary(uri);
    } else {
      ToastAndroid.show("Please choose image", ToastAndroid.SHORT);
    }
  };

  const uploadToCloudinary = async (uri: string) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", {
        uri,
        type: "image/jpeg",
        name: "upload.jpg",
      } as any);
      formData.append("upload_preset", UPLOAD_PRESET);

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

      const response = await fetch(cloudinaryUrl, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.secure_url) {
        ToastAndroid.show("Upload successful!", ToastAndroid.SHORT);
        setImage(data.secure_url); // Gửi URL về component cha
        console.log("Cloudinary response:", data.secure_url);
        try {
          await axios.put(
            `${process.env.EXPO_PUBLIC_API_URL}/users`,
            {
              avatar: data.secure_url as string,
            },
            {
              headers: {
                Authorization: `Bearer ${await SecureStore.getItemAsync(
                  "token"
                )}`,
                "Content-Type": "application/json",
              },
            }
          );
        } catch (error) {
          console.error("Error setting image:", error);
          ToastAndroid.show("Error setting image", ToastAndroid.SHORT);
        }
      } else {
        ToastAndroid.show("Upload failed", ToastAndroid.SHORT);
        console.error("Cloudinary error:", data);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      ToastAndroid.show("Upload error", ToastAndroid.SHORT);
    } finally {
      setUploading(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={pickImage}
      disabled={uploading}
      style={{
        backgroundColor: uploading ? "#aaa" : "#D9D9D9",
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginTop: 16,
        borderRadius: 12,
        alignItems: "center",
      }}
    >
      {uploading ? (
        <ActivityIndicator color="#000" />
      ) : (
        <Text className="text-black font-bold">Choose photo</Text>
      )}
    </TouchableOpacity>
  );
}
