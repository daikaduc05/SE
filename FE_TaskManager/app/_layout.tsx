import { Stack, router } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { View, ActivityIndicator } from "react-native";
import "../global.css";

export default function RootLayout() {




  return <Stack screenOptions={{ headerShown: false }} />;
}
