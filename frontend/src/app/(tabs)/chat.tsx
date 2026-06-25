import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Message {
  id: string;
  text: string;
  from: "coach" | "user";
}

const MESSAGES: Message[] = [
  {
    id: "1",
    from: "coach",
    text: "Cześć! Twoja gotowość dziś wynosi 84/100. Jak się czujesz przed treningiem?",
  },
  {
    id: "2",
    from: "user",
    text: "Czuję się dobrze, trochę senny ale w porządku.",
  },
  {
    id: "3",
    from: "coach",
    text: "Twój HRV wzrósł o 9% — to dobry znak. Proponuję Push Day A z obciążeniem +2,5 kg względem ostatniego tygodnia. Chcesz zobaczyć plan?",
  },
];

interface BubbleProps {
  message: Message;
}

function Bubble({ message }: BubbleProps) {
  const isCoach = message.from === "coach";
  return (
    <View className={`mb-2 max-w-[78%] ${isCoach ? "self-start" : "self-end"}`}>
      <View
        className="rounded-2xl px-4 py-3"
        style={{
          backgroundColor: isCoach ? "#1a1a1c" : "#30D158",
          borderBottomLeftRadius: isCoach ? 6 : 18,
          borderBottomRightRadius: isCoach ? 18 : 6,
        }}
      >
        <Text
          className="text-sm leading-5"
          style={{ color: isCoach ? "rgba(235,235,245,0.85)" : "#04210d" }}
        >
          {message.text}
        </Text>
      </View>
    </View>
  );
}

export default function ChatScreen() {
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#050506" }}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View className="px-5 pt-4 pb-3" style={{ borderBottomWidth: 0.5, borderBottomColor: "rgba(235,235,245,0.07)" }}>
          <Text className="text-sm font-medium mb-0.5" style={{ color: "rgba(235,235,245,0.4)" }}>
            AI Coach
          </Text>
          <Text className="text-2xl font-bold text-white">Coach</Text>
        </View>

        {/* Messages */}
        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {MESSAGES.map((m) => (
            <Bubble key={m.id} message={m} />
          ))}
        </ScrollView>

        {/* Input bar */}
        <View
          className="flex-row items-end px-4 py-3 gap-2"
          style={{
            paddingBottom: 100,
            borderTopWidth: 0.5,
            borderTopColor: "rgba(235,235,245,0.07)",
          }}
        >
          <View
            className="flex-1 rounded-2xl px-4 py-3 min-h-[44px] justify-center"
            style={{ backgroundColor: "#1a1a1c" }}
          >
            <TextInput
              placeholder="Napisz do Coacha…"
              placeholderTextColor="rgba(235,235,245,0.3)"
              style={{ color: "#EBEBF5", fontSize: 15 }}
              multiline
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            className="w-11 h-11 rounded-full items-center justify-center"
            style={{ backgroundColor: "#30D158" }}
          >
            <Text style={{ color: "#04210d", fontSize: 20, lineHeight: 24 }}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
