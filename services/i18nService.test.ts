import test from 'node:test';
import assert from 'node:assert';
import { detectLanguage, languages } from './i18nService.ts';

test('detectLanguage', async (t) => {
    const originalWindow = (globalThis as any).window;

    t.afterEach(() => {
        (globalThis as any).window = originalWindow;
    });

    await t.test('returns "ko" when Telegram WebApp data is missing', () => {
        (globalThis as any).window = {};
        assert.strictEqual(detectLanguage(), 'ko');
    });

    await t.test('returns supported languages when provided by Telegram', () => {
        const supportedCodes = languages.map(l => l.code);
        supportedCodes.forEach(lang => {
            (globalThis as any).window = {
                Telegram: {
                    WebApp: {
                        initDataUnsafe: {
                            user: {
                                language_code: lang
                            }
                        }
                    }
                }
            };
            assert.strictEqual(detectLanguage(), lang, `Should detect ${lang}`);
        });
    });

    await t.test('returns "ko" for unsupported languages', () => {
        (globalThis as any).window = {
            Telegram: {
                WebApp: {
                    initDataUnsafe: {
                        user: {
                            language_code: 'fr'
                        }
                    }
                }
            }
        };
        assert.strictEqual(detectLanguage(), 'ko');
    });

    await t.test('detects supported "km" language specifically', () => {
        (globalThis as any).window = {
            Telegram: {
                WebApp: {
                    initDataUnsafe: {
                        user: {
                            language_code: 'km'
                        }
                    }
                }
            }
        };
        assert.strictEqual(detectLanguage(), 'km');
    });
});
