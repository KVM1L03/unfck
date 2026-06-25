@AGENTS.md

## Claude-Specific Rules

**Expo docs lookup is mandatory.** Before using any Expo or React Native API, consult
https://docs.expo.dev/versions/v56.0.0/ — the API surface changes significantly between
SDK versions. Never rely on training data for SDK 56 specifics.

**Milestone & diff discipline:** Governed by root `CLAUDE.md` §4.
One milestone per response. Stop at every checkpoint and wait for explicit confirmation.
Never chain milestones without a user reply.
