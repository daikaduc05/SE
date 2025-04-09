import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import dayjs from "dayjs";

const CalendarPicker = ({
  date,
  onDateChange
}: {
  date: string;
  onDateChange: (date: string) => void;
}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs(date).format("YYYY-MM-DD"));
  useEffect(() => {
    setSelectedDate(dayjs(date).format("YYYY-MM-DD"));
  }, [date])

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setSelectedDate(dayjs(date).format("YYYY-MM-DD"));
    onDateChange(dayjs(date).format("YYYY-MM-DD"));
    hideDatePicker();
  };

  return (
    <View className="mb-6">
       <TouchableOpacity
        className="flex-row items-center gap-4 justify-center mb-[20px]"
        onPress={showDatePicker}
      >
        <Text className="text-white font-medium text-xl">{selectedDate}</Text>
        <Ionicons name="calendar-outline" size={16} color="white" />
      </TouchableOpacity>
      <DateTimePickerModal
        date={new Date(selectedDate)}
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        onChange={handleConfirm}
      />
    </View>
  );
};

export default CalendarPicker;