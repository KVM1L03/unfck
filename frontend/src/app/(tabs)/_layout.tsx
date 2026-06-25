import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { ColorValue } from "react-native";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

interface TabIconProps {
  name: IoniconsName;
  focusedName: IoniconsName;
  color: ColorValue;
  focused: boolean;
}

function TabIcon({ name, focusedName, color, focused }: TabIconProps) {
  return <Ionicons name={focused ? focusedName : name} size={24} color={color} />;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "rgba(235,235,245,0.35)",
        tabBarStyle: {
          position: "absolute",
          bottom: 24,
          left: 20,
          right: 20,
          height: 64,
          borderRadius: 30,
          borderTopWidth: 0,
          backgroundColor: "rgba(28,28,32,0.88)",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.55,
          shadowRadius: 34,
          elevation: 20,
        },
        tabBarItemStyle: {
          paddingVertical: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="star-outline"
              focusedName="star"
              color={focused ? "#30D158" : color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="add-circle-outline"
              focusedName="add-circle"
              color={focused ? "#32ADE6" : color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="chatbubble-outline"
              focusedName="chatbubble"
              color={focused ? "#5E5CE6" : color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="trending-up-outline"
              focusedName="trending-up"
              color={focused ? "#FF9F0A" : color}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}
