export type Team = {
  id: number;
  abbreviation: string;
  name: string;
};

export type Game = {
  game_id: string;
  home_team: Team;
  away_team: Team;
  labels: string[];
  excitement_score?: number;
  excitement_emoji?: string;
  status?: 'pending' | 'completed';
  status_text?: string;
};

export type GamesResponse = {
  games_date: string;
  total_games: number;
  games: Game[];
};
