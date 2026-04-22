import { LIBRARIES } from '../data/libraries';
import type { Library } from '../types';

export type LibraryDataState = {
  libraries: Library[];
  sourceLabel: string;
  updatedAt: string | null;
  warning: string | null;
};

type LibraryApiPayload = {
  source?: string;
  updatedAt?: string;
  count?: number;
  libraries?: Library[];
};

const libraryApiUrl = process.env.EXPO_PUBLIC_LIBRARY_API_URL;

export function getInitialLibraryData(): LibraryDataState {
  return {
    libraries: LIBRARIES,
    sourceLabel: '앱 내장 seed 데이터',
    updatedAt: null,
    warning: libraryApiUrl
      ? null
      : 'EXPO_PUBLIC_LIBRARY_API_URL이 없어 앱 내장 seed 데이터를 사용합니다.',
  };
}

export async function loadLibraryData(): Promise<LibraryDataState> {
  if (!libraryApiUrl) {
    return getInitialLibraryData();
  }

  try {
    const response = await fetch(libraryApiUrl, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Library API responded with ${response.status}.`);
    }

    const payload = (await response.json()) as LibraryApiPayload;

    if (!Array.isArray(payload.libraries) || payload.libraries.length === 0) {
      throw new Error('Library API returned no libraries.');
    }

    return {
      libraries: payload.libraries,
      sourceLabel: '공공데이터 캐시 JSON',
      updatedAt: payload.updatedAt ?? null,
      warning: null,
    };
  } catch {
    return {
      ...getInitialLibraryData(),
      warning:
        '공공데이터 캐시를 불러오지 못해 앱 내장 seed 데이터로 표시합니다.',
    };
  }
}
