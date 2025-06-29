import invariant from "tiny-invariant";
import { GOOGLE_API_URL } from "~/constants/google-api";

export type FetchSearchParams = {
  after: string | null;
  q: string | null;
  sites: string;
  start: number;
  excludeTerms: string;
};

export const fetchSearch = async (params: FetchSearchParams) => {
  invariant(params.q, "Search parameter is required")

  const fetchUrl = GOOGLE_API_URL;

  const qParamSplited = params.q.split(' ');

  const urlSearchParams = new URLSearchParams({
    "cx": process.env.GOOGLE_API_CX || "",
    "key": process.env.GOOGLE_API_KEY || "",
    "q": `${params.q} ${params.sites}`,
    "excludeTerms": params.excludeTerms,
    "exactTerms": `${qParamSplited[qParamSplited?.length - 1]}`,
    "start": params.start.toString(),
  });

  const url = `${fetchUrl}?${urlSearchParams}`;

  const res = await fetch(url);
  const response = await res.json();

  return response;
};

// Função simplificada para busca básica
export const fetchBasicSearch = async (query: string) => {
  invariant(query, "Search parameter is required")

  const urlSearchParams = new URLSearchParams({
    "cx": process.env.GOOGLE_API_CX || "",
    "key": process.env.GOOGLE_API_KEY || "",
    "q": query,
    "start": "0",
  });

  const url = `${GOOGLE_API_URL}?${urlSearchParams}`;
  const res = await fetch(url);
  const response = await res.json();

  return response;
}; 