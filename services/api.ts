import { Starship } from "@/types";

const SWAPI_BASE_URL = "https://swapi.dev/api";

export interface SWAPIResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Starship[];
}

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: unknown
  ) {
    super(message);
    this.name = "APIError";
  }
}

export async function fetchStarships(
  searchQuery?: string,
  signal?: AbortSignal
): Promise<Starship[]> {
  try {
    const allStarships: Starship[] = [];
    let nextUrl: string | null = searchQuery
      ? `${SWAPI_BASE_URL}/starships/?search=${encodeURIComponent(searchQuery)}`
      : `${SWAPI_BASE_URL}/starships/`;

    while (nextUrl) {
      const response = await fetch(nextUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal,
      });

      if (!response.ok) {
        throw new APIError(
          `Failed to fetch starships: ${response.statusText}`,
          response.status
        );
      }

      const data: SWAPIResponse = await response.json();
      
      if (data.results) {
        allStarships.push(...data.results);
      }

      nextUrl = data.next;
    }

    return allStarships;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw error;
    }
    if (error instanceof APIError) {
      throw error;
    }
    if (error instanceof Error) {
      throw new APIError(`Network error: ${error.message}`);
    }
    throw new APIError("Unknown error occurred while fetching starships");
  }
}

