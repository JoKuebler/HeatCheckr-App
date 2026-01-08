export type Team = {
  id: number;
  abbreviation: string;
  name: string;
  conf_rank?: number;
};

export type Game = {
  game_id: string;
  home_team: Team;
  away_team: Team;
  labels: string[];
  excitement_score?: number;
  excitement_emoji?: string;
  status?: 'pending' | 'completed' | 'scheduled';
  status_text?: string;
  arena?: string;
  game_time?: string; // For scheduled games: "7:00 PM ET"
};

export type GamesResponse = {
  games_date: string;
  total_games: number;
  games: Game[];
};
