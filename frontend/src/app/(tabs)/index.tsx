import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Driver {
  label: string;
  value: string;
  delta?: string;
  positive?: boolean;
}

interface Pillar {
  label: string;
  pct: number;
  color: string;
}

const DRIVERS: Driver[] = [
  { label: "HRV", value: "68 ms", delta: "+9%", positive: true },
  { label: "Sen", value: "7h 42m", delta: "+12m", positive: true },
  { label: "Tętno", value: "48 bpm", delta: "-2", positive: true },
];

const PILLARS: Pillar[] = [
  { label: "Siła", pct: 67, color: "#30D158" },
  { label: "LISS", pct: 60, color: "#32ADE6" },
  { label: "HIIT", pct: 60, color: "#5E5CE6" },
  { label: "Mobilność", pct: 33, color: "#FF9F0A" },
  { label: "Równowaga", pct: 100, color: "#30D158" },
];

function DriverCard({ label, value, delta, positive }: Driver) {
  return (
    <View
      className="flex-1 rounded-2xl p-4"
      style={{ backgroundColor: "#141416" }}
    >
      <Text className="text-xs font-medium mb-1" style={{ color: "rgba(235,235,245,0.5)" }}>
        {label}
      </Text>
      <Text className="text-base font-semibold text-white">{value}</Text>
      {delta ? (
        <Text className="text-xs mt-0.5" style={{ color: positive ? "#30D158" : "#FF453A" }}>
          {delta}
        </Text>
      ) : null}
    </View>
  );
}

function PillarRow({ label, pct, color }: Pillar) {
  return (
    <View className="mb-3">
      <View className="flex-row justify-between mb-1.5">
        <Text className="text-sm font-medium" style={{ color: "rgba(235,235,245,0.85)" }}>
          {label}
        </Text>
        <Text className="text-sm font-semibold" style={{ color }}>
          {pct}%
        </Text>
      </View>
      <View className="h-1.5 rounded-full" style={{ backgroundColor: "rgba(235,235,245,0.08)" }}>
        <View
          className="h-1.5 rounded-full"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </View>
    </View>
  );
}

export default function TodayScreen() {
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
          <Text className="text-2xl font-bold text-white">Dzisiaj</Text>
        </View>

        {/* Readiness hero card */}
        <View
          className="rounded-3xl p-6 mb-4"
          style={{ backgroundColor: "#141416" }}
        >
          <Text className="text-xs font-semibold tracking-widest mb-4" style={{ color: "rgba(235,235,245,0.4)" }}>
            GOTOWOŚĆ
          </Text>
          <View className="flex-row items-center gap-6">
            {/* Score ring placeholder */}
            <View
              className="items-center justify-center"
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                borderWidth: 8,
                borderColor: "#30D158",
                backgroundColor: "transparent",
              }}
            >
              <Text className="text-3xl font-bold text-white">84</Text>
            </View>
            {/* Summary text */}
            <View className="flex-1">
              <Text className="text-lg font-semibold text-white mb-1">Dobra forma</Text>
              <Text className="text-sm leading-5" style={{ color: "rgba(235,235,245,0.55)" }}>
                Twój organizm jest gotowy na trening o umiarkowanej intensywności.
              </Text>
            </View>
          </View>
        </View>

        {/* Drivers row */}
        <View className="flex-row gap-2.5 mb-6">
          {DRIVERS.map((d) => (
            <DriverCard key={d.label} {...d} />
          ))}
        </View>

        {/* 5 Pillars */}
        <View
          className="rounded-3xl p-6 mb-4"
          style={{ backgroundColor: "#141416" }}
        >
          <Text className="text-xs font-semibold tracking-widest mb-5" style={{ color: "rgba(235,235,245,0.4)" }}>
            5 FILARÓW
          </Text>
          {PILLARS.map((p) => (
            <PillarRow key={p.label} {...p} />
          ))}
        </View>

        {/* AI insight chip */}
        <View
          className="rounded-2xl px-4 py-3 flex-row items-center gap-3"
          style={{ backgroundColor: "rgba(48,209,88,0.10)" }}
        >
          <View
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: "#30D158" }}
          />
          <Text className="flex-1 text-sm leading-5" style={{ color: "rgba(235,235,245,0.75)" }}>
            Świetna noc regeneracyjna. Rozważ trening siłowy dziś po południu.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
