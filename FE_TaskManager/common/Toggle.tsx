import { TouchableOpacity } from "react-native";
import Animated from "react-native-reanimated";

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

// Component Toggle tùy chỉnh
const Toggle = ({ value, onValueChange }: ToggleProps) => {
  return (
    <TouchableOpacity
      onPress={() => onValueChange(!value)} 
      className={`w-12 h-6 rounded-full ${
        value ? "bg-[#5a65e4]" : "bg-gray-500"
      } justify-center px-1`}
    >
      <Animated.View
        className="w-4 h-4 rounded-full bg-white"
        style={{
          transform: [{ translateX: value ? 24 : 0 }],
          animationDuration: "1000ms",
        }}
      />
    </TouchableOpacity>
  );
};

export default Toggle;
