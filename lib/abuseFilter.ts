/**
 * KB FASHIONS — Patron Support Moderation & Abuse Detection Filter
 * Real-time bilingual (English, Hindi/Urdu romanized, and Telugu) profanity & toxic language filter.
 * Ensures transparent, respectful patron communications with the village artisan cooperative.
 */

const ENGLISH_PROFANITIES = [
  'abuse', 'asshole', 'bastard', 'bitch', 'bullshit', 'crap', 'cunt', 'damn', 'dick',
  'douche', 'dumbass', 'fag', 'fuck', 'fucking', 'motherfucker', 'idiot', 'jackass',
  'moron', 'prick', 'pussy', 'retard', 'scam', 'scammer', 'shit', 'slut', 'stupid',
  'threat', 'twat', 'whore'
];

const ROMANIZED_INDIAN_ABUSE = [
  'bhosdike', 'bhenchod', 'benchod', 'chutiya', 'chutiye', 'gandu', 'harami', 'kamina',
  'kamine', 'kutte', 'kutti', 'madarchod', 'mc', 'bc', 'saala', 'sale', 'teri maa',
  'lanja', 'lanjamunda', 'dengu', 'dengutha', 'dengey', 'nakodaka', 'na kodaka', 'naayala',
  'vedhava', 'chetha', 'chettha', 'gudha', 'erripooka', 'erri pooka', 'pukku', 'donga na'
];

const TELUGU_SCRIPT_ABUSE = [
  'లంజ', 'లంజకొడుకా', 'దెంగు', 'దెంగేయ్', 'నాకొడకా', 'వెధవ', 'చెత్త', 'గుద్ద',
  'ఎర్రిపూక', 'పూకు', 'మోసగాడు', 'దొంగ'
];

// Combine all patterns into optimized normalized regexes
const ALL_PATTERNS = [
  ...ENGLISH_PROFANITIES,
  ...ROMANIZED_INDIAN_ABUSE,
  ...TELUGU_SCRIPT_ABUSE,
];

export interface AbuseCheckResult {
  hasAbuse: boolean;
  flaggedWords: string[];
  cleanSuggestion: string;
}

/**
 * Checks arbitrary text for profanity, insults, abusive language, or harassment.
 */
export function detectAbuseLanguage(text: string): AbuseCheckResult {
  if (!text || typeof text !== 'string') {
    return { hasAbuse: false, flaggedWords: [], cleanSuggestion: '' };
  }

  const normalized = text.toLowerCase().trim();
  // Remove special separator characters that attackers use to bypass filters like f.u.c.k or b-i-t-c-h
  const collapsed = normalized.replace(/[\s\.\-_*#@!$%^&()+=]/g, '');

  const flagged = new Set<string>();

  // 1. Direct word boundary check
  for (const word of ALL_PATTERNS) {
    // If Telugu script (non-ascii)
    if (/[^\u0000-\u007F]/.test(word)) {
      if (normalized.includes(word)) {
        flagged.add(word);
      }
    } else {
      // Regex word-boundary search for English / Romanized
      const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      if (regex.test(normalized)) {
        flagged.add(word);
      } else if (word.length >= 4 && collapsed.includes(word)) {
        // Obfuscation check (e.g. f-u-c-k)
        flagged.add(word);
      }
    }
  }

  const flaggedWords = Array.from(flagged);

  // Generate clean suggestion by masking flagged words
  let cleanSuggestion = text;
  for (const word of flaggedWords) {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const mask = '*'.repeat(word.length);
    const regex = new RegExp(escaped, 'gi');
    cleanSuggestion = cleanSuggestion.replace(regex, mask);
  }

  return {
    hasAbuse: flaggedWords.length > 0,
    flaggedWords,
    cleanSuggestion,
  };
}

