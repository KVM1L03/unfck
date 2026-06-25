# CLAUDE.md - Frontend Development Standards (React Native / Expo)

## Style & Component Architecture Constraints
- YOU MUST use strict TypeScript interfaces for all React component props and hooks state.
- YOU MUST enforce a premium Apple Minimalist aesthetic: pitch black backgrounds (`bg-black`), charcoal surfaces, white typography, and heavy border radiuses (`rounded-3xl` or `rounded-full`).
- ALWAYS wrap layout roots in `SafeAreaView` from `react-native-safe-area-context` to prevent UI elements from bleeding into hardware notches/dynamic islands.
- YOU MUST use `expo-router` file-based navigation semantics (`app/` directory layout groups: `(auth)` and `(tabs)`).

## Performance & State Management (Zustand & Queries)
- Use Zustand for global reactive client states (Auth sessions, global configurations).
- Keep store selectors granular to prevent unnecessary component re-renders (e.g., `const session = useAuthStore(state => state.session)`).
- NEVER use heavy UI libraries that drop frames. Stick to pure Tailwind classes via NativeWind.
- All network interactions with the FastAPI backend MUST safely grab the bearer token from `useAuthStore.getState().session?.access_token`.

## Interaction & Haptics
- Every critical user confirmation (like saving a workout set or completing a target) MUST trigger a native haptic response via `expo-haptics` (`ImpactFeedbackStyle.Medium`).