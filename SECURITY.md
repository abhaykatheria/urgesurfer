# Security Policy

Urge Surfer is a personal wellness app. It handles potentially sensitive content: which substances or behaviors a user is tracking, when they have cravings, their name, and their photos. Everything stays on-device — but security still matters.

## In scope

- Vulnerabilities in this repository's code (JavaScript / React Native / Expo configuration)
- Issues that could leak user data to other apps, network observers, or device backups
- Permission misuse (camera or photo-library access used in unexpected ways)
- AsyncStorage data being readable in unintended contexts
- Anything that breaks the privacy posture described below

## Not in scope

- Vulnerabilities in upstream dependencies — please report those to the maintainers of the affected packages directly. Once a fix is released, I'll bump the dep here.
- Issues in Expo Go itself, or in the iOS / React Native runtime.
- Anything that requires already having physical, unlocked access to the user's device — that's the OS's threat model, not ours.

## Reporting

**Don't open a public issue for security problems.**

Email **abhay.katheria1998@gmail.com** with:

- A clear description of the issue
- Steps to reproduce
- The version of the app + iOS version you tested on
- Whatever you think is relevant about scope or impact

You'll get an acknowledgment within **3 business days** and a remediation plan within **14 days** for confirmed issues.

If you want a more private channel (Signal, encrypted email), say so in your first message and I'll arrange one.

## Disclosure

- I'll fix and ship a patched release before public disclosure.
- I'll credit you in the release notes — or keep your name out of it — your call.
- For severe issues affecting users in the wild, I'll ship the fix first and write the timeline up after.

## What I won't do

- Threaten you with legal action for good-faith security research on this codebase.
- Ignore reports.

## Privacy posture (current state)

For context, this is the privacy model the app is supposed to maintain:

- **All user data lives in AsyncStorage** under the key `@urge-surfer/state-v2`. That includes: name, tracked urges, log entries (date, time, urge, trigger, intensity, outcome), streaks/counts/rides, and photo URIs.
- **Photos** captured for victory selfies are stored at the URI returned by `expo-image-picker` — typically the app's iOS sandbox.
- **No backend.** No accounts. No analytics. No crash reporting.
- The only network requests happen at build time (Expo's package CDN). The running app makes none.
- **Camera and photo-library permissions** are requested only when the user explicitly initiates a victory selfie. The strings are declared in `app.json` under the `expo-image-picker` plugin.

If you find any of those statements to be untrue in the current code on `main`, that's itself a bug — please report it via the channel above.

## Hall of fame

_(none yet — be the first)_
