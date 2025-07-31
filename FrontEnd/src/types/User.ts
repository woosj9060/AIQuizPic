export interface UserRanking {
  username: string;
  solvedCount: number;
}

export interface UserInfo {
  id: number;
  username: string;
}

export interface RankingResponse {
  content: UserRanking[];
  totalPages: number;
  number: number;
}