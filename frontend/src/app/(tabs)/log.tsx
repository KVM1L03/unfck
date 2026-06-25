import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ActivityType {
  label: string;
  emoji: string;
  color: string;
  bg: string;
}

interface RecentEntry {
  type: string;
  detail: string;
  date: string;
  color: string;
}

const ACTIVITY_TYPES: ActivityType[] = [
  { label: "Siła", emoji: "🏋️", color: "#30D158", bg: "rgba(48,209,88,0.12)" },
  { label: "LISS", emoji: "🚴", color: "#32ADE6", bg: "rgba(50,173,230,0.12)" },
  { label: "HIIT", emoji: "⚡", color: "#5E5CE6", bg: "rgba(94,92,230,0.12)" },
  { label: "Mobilność", emoji: "🧘", color: "#FF9F0A", bg: "rgba(255,159,10,0.12)" },
];

const RECENT: RecentEntry[] = [
  { type: "Siła", detail: "Push Day A · 6 serii", date: "Wtorek", color: "#30D158" },
  { type: "LISS", detail: "Rower · 45 min · 138 bpm", date: "Niedziela", color: "#32ADE6" },
  { type: "Mobilność", detail: "Rozciąganie · 20 min", date: "Sobota", color: "#FF9F0A" },
];

function ActivityPill({ label, emoji, color, bg }: ActivityType) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      className="flex-1 rounded-2xl py-4 items-center gap-1.5"
      style={{ backgroundColor: bg }}
    >
      <Text style={{ fontSize: 28 }}>{emoji}</Text>
      <Text className="text-xs font-semibold" style={{ color }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function RecentRow({ type, detail, date, color }: RecentEntry) {
  return (
    <View className="flex-row items-center py-3.5" style={{ borderBottomWidth: 0.5, borderBottomColor: "rgba(235,235,245,0.07)" }}>
      <View
        className="w-2 h-2 rounded-full mr-3"
        style={{ backgroundColor: color }}
      />
      <View className="flex-1">
        <Text className="text-sm font-semibold text-white">{type}</Text>
        <Text className="text-xs mt-0.5" style={{ color: "rgba(235,235,245,0.45)" }}>
          {detail}
        </Text>
      </View>
      <Text className="text-xs" style={{ color: "rgba(235,235,245,0.3)" }}>
        {date}
      </Text>
    </View>
  );
}

export default function LogScreen() {
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#050506" }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="pt-4 pb-6">
          <Text className="text-sm font-medium mb-0.5" style={{ color: "rgba(235,235,245,0.4)" }}>
            Środa, 25 czerwca
          </Text>
          <Text className="text-2xl font-bold text-white">Dziennik</Text>
        </View>

        {/* Activity type picker */}
        <Text className="text-xs font-semibold tracking-widest mb-3" style={{ color: "rgba(235,235,245,0.4)" }}>
          DODAJ AKTYWNOŚĆ
        </Text>
        <View className="flex-row gap-2.5 mb-8">
          {ACTIVITY_TYPES.map((a) => (
            <ActivityPill key={a.label} {...a} />
          ))}
        </View>

        {/* Recent entries */}
        <Text className="text-xs font-semibold tracking-widest mb-1" style={{ color: "rgba(235,235,245,0.4)" }}>
          OSTATNIE
        </Text>
        <View
          className="rounded-3xl px-4"
          style={{ backgroundColor: "#141416" }}
        >
          {RECENT.map((r, i) => (
            <RecentRow key={i} {...r} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
