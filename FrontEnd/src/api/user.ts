import type { RankingResponse } from "../types/User";

export const fetchUserRankings = async (page: number): Promise<RankingResponse> => {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/stats/rankings?page=${page}&size=10`);

  if (!response.ok) {
    throw new Error('랭킹 불러오기 실패');
  }

  return response.json();
};

export const fetchSignup = async(username: string, password: string): Promise<void> => {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password })
    });

    return response.json();
}