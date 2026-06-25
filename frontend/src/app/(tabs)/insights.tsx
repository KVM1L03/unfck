import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface MetricTile {
  label: string;
  value: string;
  unit: string;
  delta: string;
  positive: boolean;
  color: string;
}

interface WeekBar {
  day: string;
  pct: number;
}

const METRICS: MetricTile[] = [
  { label: "HRV średnia", value: "64", unit: "ms", delta: "+6%", positive: true, color: "#30D158" },
  { label: "Tętno spocz.", value: "50", unit: "bpm", delta: "-3%", positive: true, color: "#32ADE6" },
  { label: "Sen (śr.)", value: "7h 18m", unit: "", delta: "+22m", positive: true, color: "#5E5CE6" },
  { label: "Obj. treningu", value: "14 200", unit: "kg", delta: "+8%", positive: true, color: "#FF9F0A" },
];

const WEEK_BARS: WeekBar[] = [
  { day: "Pn", pct: 80 },
  { day: "Wt", pct: 60 },
  { day: "Śr", pct: 84 },
  { day: "Cz", pct: 55 },
  { day: "Pt", pct: 70 },
  { day: "Sb", pct: 90 },
  { day: "Nd", pct: 45 },
];

function MetricCard({ label, value, unit, delta, positive, color }: MetricTile) {
  return (
    <View
      className="rounded-2xl p-4"
      style={{ backgroundColor: "#141416", flex: 1 }}
    >
      <Text className="text-xs font-medium mb-2" style={{ color: "rgba(235,235,245,0.4)" }}>
        {label}
      </Text>
      <View className="flex-row items-baseline gap-1 mb-1">
        <Text className="text-xl font-bold text-white">{value}</Text>
        {unit ? (
          <Text className="text-xs" style={{ color: "rgba(235,235,245,0.4)" }}>
            {unit}
          </Text>
        ) : null}
      </View>
      <Text className="text-xs font-semibold" style={{ color: positive ? color : "#FF453A" }}>
        {delta} · 7 dni
      </Text>
    </View>
  );
}

export default function InsightsScreen() {
  const maxPct = Math.max(...WEEK_BARS.map((b) => b.pct));

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
            Ostatnie 7 dni
          </Text>
          <Text className="text-2xl font-bold text-white">Trendy</Text>
        </View>

        {/* Blueprint Score card */}
        <View
          className="rounded-3xl p-6 mb-4"
          style={{ backgroundColor: "#141416" }}
        >
          <Text className="text-xs font-semibold tracking-widest mb-4" style={{ color: "rgba(235,235,245,0.4)" }}>
            BLUEPRINT SCORE
          </Text>
          <View className="flex-row items-end justify-between mb-4">
            <View>
              <Text className="text-5xl font-bold text-white">78</Text>
              <Text className="text-sm mt-1" style={{ color: "rgba(235,235,245,0.45)" }}>
                z 100 punktów
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-lg font-semibold" style={{ color: "#30D158" }}>
                +4
              </Text>
              <Text className="text-xs mt-0.5" style={{ color: "rgba(235,235,245,0.35)" }}>
                vs. ubiegły tyg.
              </Text>
            </View>
          </View>

          {/* Weekly readiness bar chart */}
          <View className="flex-row items-end gap-1.5" style={{ height: 56 }}>
            {WEEK_BARS.map((b) => {
              const barH = Math.round((b.pct / maxPct) * 48);
              const isToday = b.day === "Śr";
              return (
                <View key={b.day} className="flex-1 items-center gap-1">
                  <View
                    className="w-full rounded-full"
                    style={{
                      height: barH,
                      backgroundColor: isToday ? "#30D158" : "rgba(235,235,245,0.12)",
                    }}
                  />
                  <Text
                    className="text-xs"
                    style={{ color: isToday ? "#30D158" : "rgba(235,235,245,0.3)" }}
                  >
                    {b.day}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* 2×2 metric tiles */}
        <Text className="text-xs font-semibold tracking-widest mb-3" style={{ color: "rgba(235,235,245,0.4)" }}>
          METRYKI
        </Text>
        <View className="gap-2.5">
          <View className="flex-row gap-2.5">
            <MetricCard {...METRICS[0]} />
            <MetricCard {...METRICS[1]} />
          </View>
          <View className="flex-row gap-2.5">
            <MetricCard {...METRICS[2]} />
            <MetricCard {...METRICS[3]} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
