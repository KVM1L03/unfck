# UNF*CK Frontend — Agent Instructions

## Tech Stack
- **Runtime**: Expo SDK 56 · React Native 0.85 · TypeScript 6 (`strict: true`)
- **Routing**: expo-router v4 — file-based, source root `src/app/`
- **Styling**: NativeWind v4 + Tailwind CSS v3 — the ONLY permitted styling method
- **State**: Zustand — auth sessions and global config
- **Backend client**: Supabase JS v2, sessions persisted via `expo-secure-store`

## Source Structure
```
src/
  app/
    _layout.tsx       # Root layout — auth guard lives here
    (auth)/           # Unauthenticated screens (login, onboarding)
    (tabs)/           # Authenticated tab screens + _layout.tsx
  components/         # Shared UI components
  hooks/              # Custom React hooks
  services/
    supabaseClient.ts # Single Supabase client — never create a second
  store/
    authStore.ts      # Zustand auth store
  types/
    database.types.ts # Auto-generated — NEVER hand-write
  constants/          # Theme tokens, config constants
  global.css          # Tailwind entry point (@tailwind base/components/utilities)
```

## Commands (run from `/frontend`)
```bash
npx expo start              # Dev server (Metro)
npx expo start --ios        # iOS simulator
npx expo start --android    # Android emulator
npm run lint                # ESLint
npx tsc --noEmit            # Type-check only
```

## Styling Rules
- Use ONLY NativeWind Tailwind classes — `StyleSheet.create()` is FORBIDDEN
- Dark theme: `bg-black` / `bg-neutral-950` surfaces · `text-white` / `text-neutral-200` typography
- Custom brand accent: `#39D98A` (use inline style or extend Tailwind if needed)
- Every screen root: `flex-1 bg-black`
- Interactive elements: `rounded-3xl` or `rounded-full`
- Screen containers: minimum `p-6` padding
- ALWAYS wrap layout roots in `SafeAreaView` from `react-native-safe-area-context`

## TypeScript Rules
- `strict: true` is enforced — NEVER add `@ts-ignore` without an explanatory comment
- All component props and hook state MUST have explicit named interfaces
- Path alias `@/*` maps to `src/*` — use it everywhere, never write relative `../../` paths
- Nullable Supabase results: prefer `T | null` over `T | undefined`

## expo-router Conventions
- Auth guard lives in `src/app/_layout.tsx`
- Unauthenticated screens: `src/app/(auth)/`
- Authenticated tab screens: `src/app/(tabs)/`
- Every route group has its own `_layout.tsx`
- `typedRoutes: true` is active — use typed `router.push()` calls, not string literals

## Supabase Client
- Import exclusively from `@/services/supabaseClient` — never instantiate a second client
- Sessions are encrypted at rest via `expo-secure-store` — NEVER use `AsyncStorage` for auth data
- Read auth state with a granular Zustand selector: `useAuthStore(state => state.session)`
- Get Bearer token for HTTP calls: `useAuthStore.getState().session?.access_token`

## Zustand Pattern
- One selector per component subscription — prevents unnecessary re-renders
- Store files live in `src/store/`
- Auth store: `src/store/authStore.ts` with `session`, `isLoading`, `initialize()`, `signInWithApple()`, `signOut()`

## Haptics
- Every critical user confirmation (save workout set, complete target, destructive action) MUST trigger:
  `expo-haptics` → `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)`

## Environment Variables
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- All client-exposed vars MUST use the `EXPO_PUBLIC_` prefix — never access server secrets here

## Hard Rules (Never Do)
- `StyleSheet.create()` — use NativeWind classes instead
- `AsyncStorage` for session/token data — use `expo-secure-store`
- Hand-write `database.types.ts` — always regenerate:
  `npx supabase gen types typescript --project-id <ID> --schema public > src/types/database.types.ts`
- Disable `strict: true` in `tsconfig.json`
- Create a second Supabase client instance anywhere in the codebase
- Use relative imports where the `@/` alias works
