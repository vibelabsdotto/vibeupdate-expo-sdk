# @vibelabsdotto/vibeupdate

Public Expo and React Native SDK for localized changelogs and optional, persistent, or required store-update prompts. It checks after the host app's first render, renders no loader, collects no identifiers, and fails open on every integration, storage, validation, or network error.

## Compatibility

- Expo SDK 54–57
- React Native 0.81–0.86
- React 19.1–19.x
- iOS and Android in Expo Go, development builds, managed apps, and prebuild apps
- Node.js 24 for developing or building this package

There is no custom native code and no dependency on Gorhom, Reanimated, Gesture Handler, or a WebView.

## Installation

Install the package, then let Expo select versions of its native modules compatible with your SDK:

```sh
npm install @vibelabsdotto/vibeupdate
npx expo install expo-application expo-localization @react-native-async-storage/async-storage
```

`react`, `react-native`, and `expo` are peer dependencies normally already present in an Expo app.

## Minimal integration

Mount the component once near the root of the app:

```tsx
import { VibeUpdate } from '@vibelabsdotto/vibeupdate';

export default function RootLayout() {
  return (
    <>
      <YourApp />
      <VibeUpdate appId="app_xxx" />
    </>
  );
}
```

The initial request starts in an effect after the first render. At most one VibeUpdate dialog is presented per component mount. The priority is Required, Persistent, installed-build changelog, then Optional.

## Props

| Prop | Type | Default | Purpose |
| --- | --- | --- | --- |
| `appId` | `string` | required | Public VibeUpdate app ID (`app_xxx`). |
| `apiUrl` | `string` | `https://api.vibeupdate.app` | API origin. HTTPS is required except for localhost development. |
| `timeoutMs` | `number` | `3000` | AbortController request timeout. |
| `foregroundIntervalMs` | `number` | `21600000` (6h) | Minimum time since the last successful check before an active-state recheck. |
| `storage` | `StorageAdapter` | AsyncStorage | Custom local storage implementation. |
| `theme` | `VibeUpdateThemeOverride` | system light/dark | Local visual token overrides. |
| `stringOverrides` | `VibeUpdateStringOverrides` | resolved UI language | Local UI-copy overrides applied last. |
| `locale` | `string` | device locale | Locale override for the API request and built-in UI. |
| `onError` | `(error) => void` | none | Receives local errors without changing fail-open behavior. |
| `onOpenStore` | `(url) => void \| Promise<void>` | `Linking.openURL` | Overrides the validated HTTPS store-opening action. |
| `enabled` | `boolean` | `true` | Disables checks and UI when false. |

The optional imperative API uses the same metadata, validation, ETag, timeout, and fail-open behavior:

```ts
import { checkVibeUpdate } from '@vibelabsdotto/vibeupdate';

const result = await checkVibeUpdate({ appId: 'app_xxx' });
// null means fail-open or no trustworthy current response.
```

## Theme

The component follows `useColorScheme()` and accepts any subset of these flat tokens:

```tsx
<VibeUpdate
  appId="app_xxx"
  theme={{
    accent: '#3559E0',
    accentText: '#FDFDFF',
    surface: '#F8F9FC',
    elevatedSurface: '#EEF0F6',
    text: '#171920',
    mutedText: '#626775',
    border: '#DDE0E8',
    backdrop: 'rgba(18, 20, 27, 0.52)',
    pressed: '#2948C4',
    cornerRadius: 20,
  }}
/>
```

All styling remains local. The backend cannot remotely configure theme or UI strings.

## Strings and locales

Built-in UI dictionaries are provided for exactly: `en`, `zh-Hans`, `zh-Hant`, `es`, `pt-BR`, `fr`, `de`, `ja`, `ko`, `ar`, `hi`, `id`, `tr`, `it`, `ru`, `vi`, `th`, `pl`, `nl`, and `uk`.

Resolution is exact locale, then supported base language, then English. Chinese script/region forms resolve to `zh-Hans` or `zh-Hant`; only Brazilian Portuguese resolves to `pt-BR`. Override any final UI string locally:

```tsx
<VibeUpdate
  appId="app_xxx"
  locale="de-DE"
  stringOverrides={{ updateNow: 'Zum Store', later: 'Nicht jetzt' }}
/>
```

Available keys are `requiredTitle`, `persistentTitle`, `optionalTitle`, `changelogTitle`, `updateNow`, `later`, `close`, and `versionLabel`.

## Storage

AsyncStorage is the default. A custom adapter only needs three asynchronous methods:

```ts
import type { StorageAdapter } from '@vibelabsdotto/vibeupdate';

const storage: StorageAdapter = {
  getItem: async (key) => myStore.read(key),
  setItem: async (key, value) => myStore.write(key, value),
  removeItem: async (key) => myStore.remove(key),
};
```

Keys are namespaced with `@vibelabsdotto/vibeupdate:v1` and scoped by app, platform, and relevant installed or target build. Changelogs are shown once per app, platform, and installed build. Optional updates are shown once per app, platform, and target build. Persistent and Required updates repeat on every new mount while returned by a current successful response.

## Errors and fail-open behavior

`onError` receives a `VibeUpdateError` with one of these codes: `invalid-metadata`, `invalid-config`, `network`, `timeout`, `http`, `invalid-response`, `storage`, or `store-open`.

```tsx
<VibeUpdate
  appId="app_xxx"
  onError={(error) => localLogger.warn(error.code, error.message)}
/>
```

Invalid Expo application metadata and likely app-ID/native-ID configuration mistakes emit a clear `console.warn` in development. Production remains silent unless `onError` is supplied. Errors thrown by host callbacks are contained.

Only a current HTTP 200 response, or an HTTP 304 that confirms a locally validated ETag response, may activate Required. Timeouts, offline errors, 4xx/5xx responses, invalid JSON, invalid response fields, and storage failures never activate a cached Required response.

## Privacy

Each check sends only:

- public VibeUpdate `appId`
- `platform` (`ios` or `android`)
- native bundle ID or package name
- native integer build number
- visible native version
- locale

The SDK creates and sends no device ID, installation ID, user ID, analytics event, impression, click, or dismiss telemetry.

## Safe changelog Markdown

The native renderer supports paragraphs, headings, ordered and unordered lists, bold, italic, and links. It never renders HTML, scripts, images, WebViews, or custom components. Only `https://` and `mailto:` links are clickable; all other schemes are plain text. Input length, block count, and list length are bounded before rendering.

## SDK check response

`GET /api/v1/sdk/apps/:appId/check` receives `platform`, `nativeApplicationId`, `buildNumber`, `version`, and `locale` as query parameters. A successful response follows this contract:

```json
{
  "update": {
    "mode": "optional",
    "targetBuildNumber": 124,
    "version": "1.5.0",
    "storeUrl": "https://apps.apple.com/app/id123456789",
    "changelog": "## Faster and calmer\n\n- Improved launch time\n- Fixed offline sync",
    "changelogLocale": "en"
  },
  "changelog": {
    "buildNumber": 123,
    "version": "1.4.0",
    "markdown": "## Welcome to 1.4\n\nYour installed release notes.",
    "locale": "en"
  }
}
```

Either field may be `null`. `update.mode` is `optional`, `persistent`, or `required`. `changelog.buildNumber` must equal the installed build, `targetBuildNumber` must be newer, and `storeUrl` must be HTTPS. The server may return an `ETag`; the next request sends `If-None-Match`, and a bodyless `304` confirms that validated response as current.

## License

MIT
