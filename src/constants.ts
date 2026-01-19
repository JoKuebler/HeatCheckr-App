export const SUPPORT_URL = 'https://jokuebler.github.io/heatcheckr-support/';
import { colors } from './theme';
import Constants from 'expo-constants';

export const API_BASE = Constants.expoConfig?.extra?.apiBase || 'https://app-production-2fb0.up.railway.app/api/games';
export const CACHE_KEY = 'games_cache_latest';
export const HIGHLIGHT_WARNING_KEY = 'highlight_warning_seen_v1';
export const SETTINGS_KEY = 'label_group_settings_v1';
export const LEGEND_VISIBLE_KEY = 'legend_visible';
export const ONBOARDING_KEY = 'onboarding_completed_v1';

export const BEHIND_THE_SCENES_URL = 'https://jokuebler.github.io/heatcheckr-support/';

export const LEGEND = [
  { name: 'Significance', color: colors.accentMatchup, key: 'significance' },
  { name: 'Competitiveness', color: colors.accentFlow, key: 'competitiveness' },
  { name: 'Highlights', color: colors.accentPlayer, key: 'highlights' },
  { name: 'Lowlights', color: colors.accentMeta, key: 'lowlights' },
];

export type GroupKey = 'significance' | 'competitiveness' | 'highlights' | 'lowlights';
export type GroupSettings = Record<GroupKey, boolean>;

export const DEFAULT_SETTINGS: GroupSettings = {
  significance: true,
  competitiveness: true,
  highlights: true,
  lowlights: true,
};

export const LABEL_COLORS: Record<string, string> = {
  significance: colors.accentMatchup,
  competitiveness: colors.accentFlow,
  highlights: colors.accentPlayer,
  lowlights: colors.accentMeta,
};

export const BUCKET_ORDER: Array<keyof typeof LABEL_COLORS> = ['significance', 'competitiveness', 'highlights', 'lowlights'];

export const SCORE_BORDERS = [
  colors.scoreBorder1, colors.scoreBorder2, colors.scoreBorder3, colors.scoreBorder4, colors.scoreBorder5,
  colors.scoreBorder6, colors.scoreBorder7, colors.scoreBorder8, colors.scoreBorder9, colors.scoreBorder10,
];

export const SCORE_EMOJIS: [number, string][] = [
  [9.5, '💎'],  // Diamond - absolute gem
  [8.5, '🔥'],  // Fire - scorcher
  [7.5, '⚡️'],  // Lightning - electric
  [6.5, '✨'],  // Sparkles - pretty good
  [5.5, '👀'],  // Eyes - watchable
  [4.5, '😐'],  // Neutral face - mid
  [3.5, '😴'],  // Sleepy - snoozer
  [2.5, '🪫'],  // Low battery - draining
  [1.5, '🤮'],  // Vomit - skip it
  [0, '💀'],    // Skull - unwatchable
];

export const LABEL_PATTERNS: [RegExp, keyof typeof LABEL_COLORS][] = [
  // Significance: instant classic, matchup, bout, playoff race, tank bowl
  [/instant classic|matchup|bout|playoff race|tank bowl/i, 'significance'],
  // Competitiveness: back & forth, down to the wire, photo finish, q4 comeback, comeback, hot start, late run/rally, defensive
  [/back & forth|down to the wire|photo finish|q4 comeback|comeback|hot start|late r(un|ally)|defensive/i, 'competitiveness'],
  // Highlights: shootout, high octane, glass cleaner, assist symphony, triple double, scoring explosion, sniper, pickpocket, block party, clutch stop, game winner, double/triple ot, heartbreaker, marathon, epic, free flowing
  [/shootout|high octane|glass cleaner|assist symphony|triple double|scoring explosion|sniper|pickpocket|block party|clutch stop|game winner|double ot|triple ot|heartbreaker|marathon|epic|free flowing/i, 'highlights'],
  // Lowlights: chaos, brick, free throw parade, easy win, blowout, nothing burger
  [/chaos|brick|free throw parade|easy win|blowout|nothing burger/i, 'lowlights'],
];