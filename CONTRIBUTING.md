# Contributing to Urge Surfer

Thanks for wanting to make this better. Reading this once will save us both time.

## Philosophy

Urge Surfer's value comes from being **small, honest, and shame-free**. Every change should support those.

**I'll merge fast:**
- Bug fixes with a clear repro
- Accessibility improvements (VoiceOver, dynamic type, reduced motion, contrast)
- Performance fixes — especially around the timer or AsyncStorage
- New tracked-urge presets
- Translations / i18n scaffolding
- Things that make the app work better offline
- Tightening privacy (less data stored, less metadata captured, etc.)

**I'll merge slowly or not at all:**
- New full screens not on the roadmap
- Cloud sync, accounts, social/community features
- Anything that requires telemetry, analytics, crash reporting, or "phoning home"
- Gamification that adds shame (red banners, "you broke your streak!", public leaderboards)
- Major dependency churn for marginal wins
- Big rewrites without a Discussion thread first

If your idea falls in the second list, **open a Discussion before writing code.** I'm happy to talk it through, but I don't want either of us spending hours on a PR I won't merge.

## Setup

```sh
git clone https://github.com/abhaykatheria/urgesurfer.git
cd urgesurfer
npm install
npx expo start --ios
```

Requirements:
- Node 20+
- Xcode (for the iOS simulator)
- Either Expo Go on a real device, or `npx expo run:ios` for a local native build

There's no test runner yet — see _Testing_ below for the manual smoke pass.

## Code style

- **Prefer editing existing files over creating new ones.** If you create a new file, justify it in the PR description.
- **Plain JavaScript**, no TypeScript yet. If you want to introduce TS, open a Discussion first — that's a project-wide call.
- **Functional React only**, hooks only, no class components.
- **No comments unless they explain WHY** something non-obvious is happening. Don't comment what the code already says. Don't reference the current task or PR in code comments — that belongs in the PR body.
- **Match the existing patterns:**
  - State via the `useApp()` context (`src/state.js`)
  - Theme via `useTheme()` (`src/theme.js`) — colors are CSS-var-style names
  - Screens are absolute-positioned children of `<Shell>` with `useSafeAreaInsets()` for top/bottom offsets
  - `<Press>` wraps `<Pressable>` with a press-scale animation; layout props go on the outer Pressable, visual props on the inner Animated.View
- Keep imports sorted: React → React Native → third-party → local (`../components`, `../screens`, etc.).

## Branching

- `main` is always shippable.
- Branch off `main`. Name it `fix/short-description` or `feat/short-description`.
- One logical change per PR. If you're touching unrelated things, split them.

## Commit messages

Tight imperative subject (under 70 chars), explain the _why_ in the body if non-obvious:

```
Fix timer drift after long backgrounding

setInterval was decrementing remaining from prev state instead of
recomputing from endTime. After 10+ minutes backgrounded, the displayed
time could lag by several seconds before the AppState listener
corrected it. Now every tick reads remainingFromEnd(s.endTime).
```

## Pull requests

Include in the description:
- **What** changed
- **Why** — the user-visible problem this solves
- **Test plan** — what you actually did to verify it works (simulator + real device if possible)
- Screenshots / screen recording for any UI change

If you can't test on a real device, say so — I'll try it on hardware before merging.

## Testing (manual smoke pass)

There's no automated test suite right now — the app is small enough that manual QA covers it. Before submitting a PR, walk through:

1. **Onboarding → home** (fresh install path — clear AsyncStorage or use a fresh sim)
2. **Start a surf** → let it auto-complete _or_ tap "Surfed it" _or_ tap "I caved"
3. **Background mid-timer** for 30+ seconds, foreground — remaining time should be accurate
4. **Force-quit mid-timer**, relaunch — should land back on Timer (if not yet expired) or Success (if expired while away)
5. **Take a victory selfie** → save to album → open from album → share via system sheet
6. **Toggle theme** on home — every screen you visit should respect it (light + dark)
7. **Add a custom urge** in onboarding _and_ in profile edit
8. **Stats** — heatmap and top triggers should reflect your real log entries

If your change touches state shape or persistence:
- Existing user (data already in AsyncStorage from a previous version) → app loads correctly
- Fresh install (clear app data first) → onboarding shows

## Privacy is a hard line

Don't add anything that:
- Sends user data off the device (analytics, crash reporting that includes user content, A/B testing SDKs)
- Stores sensitive content in unencrypted shared/external storage
- Adds a third-party SDK without a clear, documented purpose

If your PR adds a new dependency, include a one-line justification in the PR description.

## Reporting bugs

Open an Issue with:
- Device + iOS version
- What you did
- What you expected
- What happened instead
- Screenshots / screen recording if applicable

A reliable repro path goes a long way.

## Reporting security issues

**Don't open a public issue.** See [SECURITY.md](SECURITY.md).

## Code of conduct

Be kind. This app is for people working through hard stuff — let's hold the same energy in the repo.
