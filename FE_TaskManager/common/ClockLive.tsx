<div className=""></div>
// Import các thư viện cần thiết
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

const LiveClock = () => {
  // State để lưu thời gian hiện tại
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Cập nhật thời gian mỗi giây
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup khi component unmount
    return () => clearInterval(timer);
  }, []);

  // Format thời gian thành chuỗi
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Format ngày tháng thành chuỗi
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric", 
      month: "long",
      day: "numeric"
    });
  };

  return (
    <View className="items-center">
      {/* Hiển thị ngày tháng */}
      <Text className="text-white text-lg">
        {formatDate(currentTime)}
      </Text>
      
      {/* Hiển thị giờ phút giây */}
      <Text className="text-white text-3xl font-bold">
        {formatTime(currentTime)}
      </Text>
    </View>
  );
};

export default LiveClock;