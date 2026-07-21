import type { VibeUpdateStringOverrides, VibeUpdateStrings } from './types.js';

export const supportedLocales = [
  'en', 'zh-Hans', 'zh-Hant', 'es', 'pt-BR', 'fr', 'de', 'ja', 'ko', 'ar',
  'hi', 'id', 'tr', 'it', 'ru', 'vi', 'th', 'pl', 'nl', 'uk',
] as const;

export type SupportedLocale = (typeof supportedLocales)[number];

export const dictionaries: Record<SupportedLocale, VibeUpdateStrings> = {
  en: { requiredTitle: 'Update required', persistentTitle: 'Update available', optionalTitle: 'A new version is ready', changelogTitle: 'What’s new', updateNow: 'Update now', later: 'Later', close: 'Close', versionLabel: 'Version' },
  'zh-Hans': { requiredTitle: '需要更新', persistentTitle: '有可用更新', optionalTitle: '新版本已就绪', changelogTitle: '新功能', updateNow: '立即更新', later: '稍后', close: '关闭', versionLabel: '版本' },
  'zh-Hant': { requiredTitle: '需要更新', persistentTitle: '有可用更新', optionalTitle: '新版本已就緒', changelogTitle: '最新功能', updateNow: '立即更新', later: '稍後', close: '關閉', versionLabel: '版本' },
  es: { requiredTitle: 'Actualización obligatoria', persistentTitle: 'Actualización disponible', optionalTitle: 'Hay una nueva versión', changelogTitle: 'Novedades', updateNow: 'Actualizar ahora', later: 'Más tarde', close: 'Cerrar', versionLabel: 'Versión' },
  'pt-BR': { requiredTitle: 'Atualização obrigatória', persistentTitle: 'Atualização disponível', optionalTitle: 'Uma nova versão está pronta', changelogTitle: 'Novidades', updateNow: 'Atualizar agora', later: 'Mais tarde', close: 'Fechar', versionLabel: 'Versão' },
  fr: { requiredTitle: 'Mise à jour requise', persistentTitle: 'Mise à jour disponible', optionalTitle: 'Une nouvelle version est prête', changelogTitle: 'Nouveautés', updateNow: 'Mettre à jour', later: 'Plus tard', close: 'Fermer', versionLabel: 'Version' },
  de: { requiredTitle: 'Update erforderlich', persistentTitle: 'Update verfügbar', optionalTitle: 'Eine neue Version ist bereit', changelogTitle: 'Neuigkeiten', updateNow: 'Jetzt aktualisieren', later: 'Später', close: 'Schließen', versionLabel: 'Version' },
  ja: { requiredTitle: 'アップデートが必要です', persistentTitle: 'アップデートがあります', optionalTitle: '新しいバージョンがあります', changelogTitle: '新機能', updateNow: '今すぐ更新', later: '後で', close: '閉じる', versionLabel: 'バージョン' },
  ko: { requiredTitle: '업데이트 필요', persistentTitle: '업데이트 사용 가능', optionalTitle: '새 버전이 준비되었습니다', changelogTitle: '새로운 기능', updateNow: '지금 업데이트', later: '나중에', close: '닫기', versionLabel: '버전' },
  ar: { requiredTitle: 'التحديث مطلوب', persistentTitle: 'يتوفر تحديث', optionalTitle: 'إصدار جديد جاهز', changelogTitle: 'ما الجديد', updateNow: 'التحديث الآن', later: 'لاحقًا', close: 'إغلاق', versionLabel: 'الإصدار' },
  hi: { requiredTitle: 'अपडेट आवश्यक है', persistentTitle: 'अपडेट उपलब्ध है', optionalTitle: 'नया संस्करण तैयार है', changelogTitle: 'नया क्या है', updateNow: 'अभी अपडेट करें', later: 'बाद में', close: 'बंद करें', versionLabel: 'संस्करण' },
  id: { requiredTitle: 'Pembaruan diperlukan', persistentTitle: 'Pembaruan tersedia', optionalTitle: 'Versi baru sudah siap', changelogTitle: 'Yang baru', updateNow: 'Perbarui sekarang', later: 'Nanti', close: 'Tutup', versionLabel: 'Versi' },
  tr: { requiredTitle: 'Güncelleme gerekli', persistentTitle: 'Güncelleme mevcut', optionalTitle: 'Yeni bir sürüm hazır', changelogTitle: 'Yenilikler', updateNow: 'Şimdi güncelle', later: 'Daha sonra', close: 'Kapat', versionLabel: 'Sürüm' },
  it: { requiredTitle: 'Aggiornamento richiesto', persistentTitle: 'Aggiornamento disponibile', optionalTitle: 'È pronta una nuova versione', changelogTitle: 'Novità', updateNow: 'Aggiorna ora', later: 'Più tardi', close: 'Chiudi', versionLabel: 'Versione' },
  ru: { requiredTitle: 'Требуется обновление', persistentTitle: 'Доступно обновление', optionalTitle: 'Доступна новая версия', changelogTitle: 'Что нового', updateNow: 'Обновить сейчас', later: 'Позже', close: 'Закрыть', versionLabel: 'Версия' },
  vi: { requiredTitle: 'Cần cập nhật', persistentTitle: 'Có bản cập nhật', optionalTitle: 'Phiên bản mới đã sẵn sàng', changelogTitle: 'Có gì mới', updateNow: 'Cập nhật ngay', later: 'Để sau', close: 'Đóng', versionLabel: 'Phiên bản' },
  th: { requiredTitle: 'จำเป็นต้องอัปเดต', persistentTitle: 'มีอัปเดตใหม่', optionalTitle: 'เวอร์ชันใหม่พร้อมแล้ว', changelogTitle: 'มีอะไรใหม่', updateNow: 'อัปเดตตอนนี้', later: 'ภายหลัง', close: 'ปิด', versionLabel: 'เวอร์ชัน' },
  pl: { requiredTitle: 'Wymagana aktualizacja', persistentTitle: 'Dostępna aktualizacja', optionalTitle: 'Nowa wersja jest gotowa', changelogTitle: 'Co nowego', updateNow: 'Aktualizuj teraz', later: 'Później', close: 'Zamknij', versionLabel: 'Wersja' },
  nl: { requiredTitle: 'Update vereist', persistentTitle: 'Update beschikbaar', optionalTitle: 'Een nieuwe versie staat klaar', changelogTitle: 'Wat is er nieuw', updateNow: 'Nu bijwerken', later: 'Later', close: 'Sluiten', versionLabel: 'Versie' },
  uk: { requiredTitle: 'Потрібне оновлення', persistentTitle: 'Доступне оновлення', optionalTitle: 'Нова версія готова', changelogTitle: 'Що нового', updateNow: 'Оновити зараз', later: 'Пізніше', close: 'Закрити', versionLabel: 'Версія' },
};

const localeLookup = new Map(supportedLocales.map((locale) => [locale.toLowerCase(), locale]));

export function resolveUiLocale(locale: string | null | undefined): SupportedLocale {
  const normalized = locale?.trim().replaceAll('_', '-') ?? '';
  const lower = normalized.toLowerCase();
  const exact = localeLookup.get(lower);
  if (exact !== undefined) return exact;
  if (lower.startsWith('zh-')) {
    if (/^zh-(tw|hk|mo|hant)(-|$)/.test(lower) || lower.includes('-hant')) return 'zh-Hant';
    if (/^zh-(cn|sg|my|hans)(-|$)/.test(lower) || lower.includes('-hans')) return 'zh-Hans';
  }
  const base = lower.split('-')[0];
  const baseMatch = base === undefined ? undefined : localeLookup.get(base);
  return baseMatch ?? 'en';
}

export function resolveStrings(
  locale: string | null | undefined,
  overrides: VibeUpdateStringOverrides = {},
): VibeUpdateStrings {
  return { ...dictionaries[resolveUiLocale(locale)], ...overrides };
}
