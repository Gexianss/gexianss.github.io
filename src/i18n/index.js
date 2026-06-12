import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zh from './zh.json';
import en from './en.json';

const saved = localStorage.getItem('lang') || 'zh';

i18n.use(initReactI18next).init({
  resources: { zh: { translation: zh }, en: { translation: en } },
  lng: saved,
  fallbackLng: 'zh',
  interpolation: { escapeValue: false },
  returnObjects: true,
});

document.documentElement.lang = saved === 'zh' ? 'zh-Hant' : 'en';

export function toggleLang() {
  const next = i18n.language === 'zh' ? 'en' : 'zh';
  i18n.changeLanguage(next);
  localStorage.setItem('lang', next);
  document.documentElement.lang = next === 'zh' ? 'zh-Hant' : 'en';
}

export default i18n;
