import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const BackButton = ({ href }: { href?: string }) => {
  return (
    <Link
      href={href ? (href as any) : "/"}
      style={{
        position: "absolute",
        top: 20,
        left: 10,
        zIndex: 10,
        flexDirection: "row",
        alignItems: "end",
        gap: 4,
      }}
      className="absolute top-5 left-5 z-10 flex flex-row items-end gap-4"
    >
      <Ionicons
        name="arrow-back"
        size={20}
        className="text-end mr-6 w-24"
        color="white"
      />
    </Link>
  );
};

export default BackButton;
