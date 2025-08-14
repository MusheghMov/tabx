// Mapping from language codes to appropriate country codes for flag display
export const LANGUAGE_TO_COUNTRY_MAP: Record<string, string> = {
  // Common language codes to country codes
  en: "US", // English -> United States
  es: "ES", // Spanish -> Spain
  fr: "FR", // French -> France
  de: "DE", // German -> Germany
  it: "IT", // Italian -> Italy
  pt: "PT", // Portuguese -> Portugal
  ja: "JP", // Japanese -> Japan
  ko: "KR", // Korean -> South Korea
  zh: "CN", // Chinese -> China
  "zh-cn": "CN", // Chinese (Simplified) -> China
  "zh-tw": "TW", // Chinese (Traditional) -> Taiwan
  ar: "SA", // Arabic -> Saudi Arabia
  hi: "IN", // Hindi -> India
  ru: "RU", // Russian -> Russia
  nl: "NL", // Dutch -> Netherlands
  sv: "SE", // Swedish -> Sweden
  no: "NO", // Norwegian -> Norway
  da: "DK", // Danish -> Denmark
  fi: "FI", // Finnish -> Finland
  pl: "PL", // Polish -> Poland
  tr: "TR", // Turkish -> Turkey
  th: "TH", // Thai -> Thailand
  vi: "VN", // Vietnamese -> Vietnam
  he: "IL", // Hebrew -> Israel
  uk: "UA", // Ukrainian -> Ukraine
  cs: "CZ", // Czech -> Czech Republic
  sk: "SK", // Slovak -> Slovakia
  hu: "HU", // Hungarian -> Hungary
  ro: "RO", // Romanian -> Romania
  bg: "BG", // Bulgarian -> Bulgaria
  hr: "HR", // Croatian -> Croatia
  sr: "RS", // Serbian -> Serbia
  sl: "SI", // Slovenian -> Slovenia
  et: "EE", // Estonian -> Estonia
  lv: "LV", // Latvian -> Latvia
  lt: "LT", // Lithuanian -> Lithuania
  mt: "MT", // Maltese -> Malta
  ga: "IE", // Irish -> Ireland
  cy: "GB", // Welsh -> United Kingdom
  is: "IS", // Icelandic -> Iceland
  mk: "MK", // Macedonian -> North Macedonia
  sq: "AL", // Albanian -> Albania
  eu: "ES", // Basque -> Spain
  ca: "ES", // Catalan -> Spain
  gl: "ES", // Galician -> Spain
  be: "BY", // Belarusian -> Belarus
  kk: "KZ", // Kazakh -> Kazakhstan
  ky: "KG", // Kyrgyz -> Kyrgyzstan
  uz: "UZ", // Uzbek -> Uzbekistan
  tg: "TJ", // Tajik -> Tajikistan
  mn: "MN", // Mongolian -> Mongolia
  ka: "GE", // Georgian -> Georgia
  hy: "AM", // Armenian -> Armenia
  az: "AZ", // Azerbaijani -> Azerbaijan
  fa: "IR", // Persian/Farsi -> Iran
  ur: "PK", // Urdu -> Pakistan
  bn: "BD", // Bengali -> Bangladesh
  ta: "IN", // Tamil -> India
  te: "IN", // Telugu -> India
  ml: "IN", // Malayalam -> India
  kn: "IN", // Kannada -> India
  gu: "IN", // Gujarati -> India
  pa: "IN", // Punjabi -> India
  or: "IN", // Odia -> India
  as: "IN", // Assamese -> India
  ne: "NP", // Nepali -> Nepal
  si: "LK", // Sinhala -> Sri Lanka
  my: "MM", // Burmese -> Myanmar
  km: "KH", // Khmer -> Cambodia
  lo: "LA", // Lao -> Laos
  id: "ID", // Indonesian -> Indonesia
  ms: "MY", // Malay -> Malaysia
  tl: "PH", // Filipino/Tagalog -> Philippines
  sw: "KE", // Swahili -> Kenya
  am: "ET", // Amharic -> Ethiopia
  yo: "NG", // Yoruba -> Nigeria
  ig: "NG", // Igbo -> Nigeria
  ha: "NG", // Hausa -> Nigeria
  zu: "ZA", // Zulu -> South Africa
  af: "ZA", // Afrikaans -> South Africa
  xh: "ZA", // Xhosa -> South Africa
}

// Mapping from language codes to language names
export const LANGUAGE_CODE_TO_NAME_MAP: Record<string, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese",
  "zh-cn": "Chinese (Simplified)",
  "zh-tw": "Chinese (Traditional)",
  ar: "Arabic",
  hi: "Hindi",
  ru: "Russian",
  nl: "Dutch",
  sv: "Swedish",
  no: "Norwegian",
  da: "Danish",
  fi: "Finnish",
  pl: "Polish",
  tr: "Turkish",
  th: "Thai",
  vi: "Vietnamese",
  he: "Hebrew",
  uk: "Ukrainian",
  cs: "Czech",
  sk: "Slovak",
  hu: "Hungarian",
  ro: "Romanian",
  bg: "Bulgarian",
  hr: "Croatian",
  sr: "Serbian",
  sl: "Slovenian",
  et: "Estonian",
  lv: "Latvian",
  lt: "Lithuanian",
  mt: "Maltese",
  ga: "Irish",
  cy: "Welsh",
  is: "Icelandic",
  mk: "Macedonian",
  sq: "Albanian",
  eu: "Basque",
  ca: "Catalan",
  gl: "Galician",
  be: "Belarusian",
  kk: "Kazakh",
  ky: "Kyrgyz",
  uz: "Uzbek",
  tg: "Tajik",
  mn: "Mongolian",
  ka: "Georgian",
  hy: "Armenian",
  az: "Azerbaijani",
  fa: "Persian",
  ur: "Urdu",
  bn: "Bengali",
  ta: "Tamil",
  te: "Telugu",
  ml: "Malayalam",
  kn: "Kannada",
  gu: "Gujarati",
  pa: "Punjabi",
  or: "Odia",
  as: "Assamese",
  ne: "Nepali",
  si: "Sinhala",
  my: "Burmese",
  km: "Khmer",
  lo: "Lao",
  id: "Indonesian",
  ms: "Malay",
  tl: "Filipino",
  sw: "Swahili",
  am: "Amharic",
  yo: "Yoruba",
  ig: "Igbo",
  ha: "Hausa",
  zu: "Zulu",
  af: "Afrikaans",
  xh: "Xhosa",
}

/**
 * Get the appropriate country code for a given language code
 * @param languageCode - The ISO language code (e.g., "en", "es", "fr")
 * @returns The ISO country code (e.g., "US", "ES", "FR") or "UN" as fallback
 */
export function getCountryCodeForLanguage(languageCode: string): string {
  // Convert to lowercase and handle potential variants
  const normalizedCode = languageCode.toLowerCase()
  
  // Try exact match first
  if (LANGUAGE_TO_COUNTRY_MAP[normalizedCode]) {
    return LANGUAGE_TO_COUNTRY_MAP[normalizedCode]
  }
  
  // Try base language code (e.g., "en-US" -> "en")
  const baseCode = normalizedCode.split("-")[0]
  if (LANGUAGE_TO_COUNTRY_MAP[baseCode]) {
    return LANGUAGE_TO_COUNTRY_MAP[baseCode]
  }
  
  // Fallback to UN flag for unknown languages
  return "UN"
}

/**
 * Get the full language name for a given language code
 * @param languageCode - The ISO language code (e.g., "en", "es", "fr")
 * @returns The full language name (e.g., "English", "Spanish", "French") or "Unknown" as fallback
 */
export function getLanguageName(languageCode: string): string {
  // Convert to lowercase and handle potential variants
  const normalizedCode = languageCode.toLowerCase()
  
  // Try exact match first
  if (LANGUAGE_CODE_TO_NAME_MAP[normalizedCode]) {
    return LANGUAGE_CODE_TO_NAME_MAP[normalizedCode]
  }
  
  // Try base language code (e.g., "en-US" -> "en")
  const baseCode = normalizedCode.split("-")[0]
  if (LANGUAGE_CODE_TO_NAME_MAP[baseCode]) {
    return LANGUAGE_CODE_TO_NAME_MAP[baseCode]
  }
  
  // Fallback to "Unknown" for unrecognized languages
  return "Unknown"
}