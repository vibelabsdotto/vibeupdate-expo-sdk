import type { CheckResponse, RuntimeMetadata } from '../src/types.js';

export const metadata: RuntimeMetadata = {
  platform: 'ios',
  nativeApplicationId: 'com.example.app',
  buildNumber: 41,
  version: '1.4.1',
  locale: 'de-DE',
};

export const optionalResponse: CheckResponse = {
  update: {
    mode: 'optional',
    targetBuildNumber: 42,
    version: '1.5.0',
    storeUrl: 'https://apps.apple.com/app/id123456789',
    changelog: '## Neu\n\n- Schneller',
    changelogLocale: 'de',
  },
  changelog: {
    buildNumber: 41,
    version: '1.4.1',
    markdown: '## Willkommen\n\nAktuelle Version.',
    locale: 'de',
  },
};
