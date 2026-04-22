import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  getInitialLibraryData,
  loadLibraryData,
} from './src/services/libraryApi';
import type { Library, UserCoordinate } from './src/types';
import {
  formatDistance,
  getDistanceKm,
  getLibraryStatus,
  hasWeekendHours,
} from './src/utils/library';

type FilterMode = 'all' | 'open' | 'weekend' | 'favorites';

const FAVORITES_KEY = 'today-library:favorites';
const SEOUL_CITY_HALL: UserCoordinate = {
  latitude: 37.5662952,
  longitude: 126.9779451,
};

const FILTERS: Array<{ label: string; value: FilterMode }> = [
  { label: '전체', value: 'all' },
  { label: '지금 열림', value: 'open' },
  { label: '주말 운영', value: 'weekend' },
  { label: '즐겨찾기', value: 'favorites' },
];

export default function App() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterMode>('open');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoritesReady, setFavoritesReady] = useState(false);
  const [userLocation, setUserLocation] =
    useState<UserCoordinate>(SEOUL_CITY_HALL);
  const [locationLabel, setLocationLabel] = useState('서울시청 기준');
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationMessage, setLocationMessage] = useState('');
  const [libraryData, setLibraryData] = useState(getInitialLibraryData);
  const [libraryDataLoading, setLibraryDataLoading] = useState(false);
  const now = useMemo(() => new Date(), []);

  useEffect(() => {
    AsyncStorage.getItem(FAVORITES_KEY)
      .then((value) => {
        if (value) {
          setFavorites(JSON.parse(value));
        }
      })
      .catch(() => {
        setFavorites([]);
      })
      .finally(() => setFavoritesReady(true));
  }, []);

  useEffect(() => {
    if (!favoritesReady) {
      return;
    }

    AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites)).catch(
      () => undefined,
    );
  }, [favorites, favoritesReady]);

  useEffect(() => {
    let cancelled = false;

    async function loadLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (cancelled) {
          return;
        }

        if (status !== 'granted') {
          setLocationMessage('위치 권한이 꺼져 있어 서울시청 기준으로 정렬합니다.');
          return;
        }

        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (cancelled) {
          return;
        }

        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationLabel('현재 위치 기준');
        setLocationMessage('');
      } catch {
        if (!cancelled) {
          setLocationMessage('현재 위치를 가져오지 못해 서울시청 기준으로 정렬합니다.');
        }
      } finally {
        if (!cancelled) {
          setLocationLoading(false);
        }
      }
    }

    loadLocation();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadRemoteLibraries() {
      setLibraryDataLoading(true);

      const nextLibraryData = await loadLibraryData();

      if (!cancelled) {
        setLibraryData(nextLibraryData);
        setLibraryDataLoading(false);
      }
    }

    loadRemoteLibraries();

    return () => {
      cancelled = true;
    };
  }, []);

  const preparedLibraries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return libraryData.libraries.map((library) => {
      const status = getLibraryStatus(library, now);
      const distanceKm = getDistanceKm(userLocation, library);

      return {
        library,
        status,
        distanceKm,
      };
    })
      .filter(({ library, status }) => {
        if (filter === 'open' && !status.isOpen) {
          return false;
        }

        if (filter === 'weekend' && !hasWeekendHours(library)) {
          return false;
        }

        if (filter === 'favorites' && !favorites.includes(library.id)) {
          return false;
        }

        if (!normalizedQuery) {
          return true;
        }

        const haystack = [
          library.name,
          library.city,
          library.district,
          library.type,
          library.address,
        ]
          .join(' ')
          .toLowerCase();

        return haystack.includes(normalizedQuery);
      })
      .sort((a, b) => {
        if (a.status.isOpen !== b.status.isOpen) {
          return a.status.isOpen ? -1 : 1;
        }

        return a.distanceKm - b.distanceKm;
      });
  }, [favorites, filter, libraryData.libraries, now, query, userLocation]);

  const openCount = preparedLibraries.filter((item) => item.status.isOpen).length;

  function toggleFavorite(libraryId: string) {
    setFavorites((current) =>
      current.includes(libraryId)
        ? current.filter((id) => id !== libraryId)
        : [...current, libraryId],
    );
  }

  async function refreshLibraryData() {
    setLibraryDataLoading(true);
    setLibraryData(await loadLibraryData());
    setLibraryDataLoading(false);
  }

  async function openUrl(url: string, fallbackMessage: string) {
    try {
      const canOpen = await Linking.canOpenURL(url);

      if (!canOpen) {
        Alert.alert('열 수 없음', fallbackMessage);
        return;
      }

      await Linking.openURL(url);
    } catch {
      Alert.alert('열 수 없음', fallbackMessage);
    }
  }

  function callLibrary(phone: string) {
    openUrl(`tel:${phone.replaceAll('-', '')}`, '전화 앱을 열 수 없습니다.');
  }

  function openHomepage(homepage: string) {
    openUrl(homepage, '홈페이지를 열 수 없습니다.');
  }

  function openDirections(library: Library) {
    const destination = `${library.latitude},${library.longitude}`;
    const encodedName = encodeURIComponent(library.name);
    const url =
      Platform.OS === 'ios'
        ? `http://maps.apple.com/?daddr=${destination}&q=${encodedName}`
        : `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=walking`;

    openUrl(url, '지도 앱을 열 수 없습니다.');
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroTopLine}>
            <Text style={styles.appMark}>오늘도서관</Text>
            <View style={styles.locationPill}>
              {locationLoading ? (
                <ActivityIndicator color="#1a5f53" size="small" />
              ) : null}
              <Text style={styles.locationText}>{locationLabel}</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>오늘 문 여는 도서관을 가까운 순서로.</Text>
          <Text style={styles.heroCopy}>
            공공데이터 구조에 맞춘 도서관 운영시간, 휴관일, 좌석 수, 연락처를 한
            화면에서 확인합니다.
          </Text>

          <View style={styles.summaryRow}>
            <Metric label="검색 결과" value={`${preparedLibraries.length}곳`} />
            <Metric label="지금 열림" value={`${openCount}곳`} />
            <Metric label="저장됨" value={`${favorites.length}곳`} />
          </View>
        </View>

        {locationMessage ? (
          <View style={styles.noticeBox}>
            <Text style={styles.noticeTitle}>위치 안내</Text>
            <Text style={styles.noticeText}>{locationMessage}</Text>
          </View>
        ) : null}

        <View style={styles.searchPanel}>
          <Text style={styles.sectionLabel}>찾고 싶은 도서관이나 지역</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
            onChangeText={setQuery}
            placeholder="예: 마포, 어린이, 중앙도서관"
            placeholderTextColor="#8b948f"
            returnKeyType="search"
            style={styles.searchInput}
            value={query}
          />

          <ScrollView
            contentContainerStyle={styles.filterRow}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {FILTERS.map((item) => {
              const selected = filter === item.value;

              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  key={item.value}
                  onPress={() => setFilter(item.value)}
                  style={[styles.filterChip, selected && styles.filterChipActive]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selected && styles.filterChipTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.sourceNotice}>
          <View style={styles.sourceNoticeHeader}>
            <View style={styles.sourceNoticeTitleBlock}>
              <Text style={styles.sourceNoticeTitle}>
                {libraryData.sourceLabel}
              </Text>
              <Text style={styles.sourceNoticeText}>
                {formatUpdatedAt(libraryData.updatedAt)}
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              disabled={libraryDataLoading}
              onPress={refreshLibraryData}
              style={[
                styles.sourceRefreshButton,
                libraryDataLoading && styles.sourceRefreshButtonDisabled,
              ]}
            >
              {libraryDataLoading ? (
                <ActivityIndicator color="#1a5f53" size="small" />
              ) : (
                <Text style={styles.sourceRefreshButtonText}>새로고침</Text>
              )}
            </Pressable>
          </View>

          {libraryData.warning ? (
            <Text style={styles.sourceWarningText}>{libraryData.warning}</Text>
          ) : null}
        </View>

        <View style={styles.libraryList}>
          {preparedLibraries.map(({ library, status, distanceKm }) => (
            <LibraryCard
              distanceKm={distanceKm}
              isFavorite={favorites.includes(library.id)}
              key={library.id}
              library={library}
              onCall={callLibrary}
              onDirections={openDirections}
              onFavorite={toggleFavorite}
              onHomepage={openHomepage}
              statusLabel={status.label}
              statusTone={status.tone}
            />
          ))}

          {preparedLibraries.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>조건에 맞는 도서관이 없어요</Text>
              <Text style={styles.emptyText}>
                필터를 전체로 바꾸거나 다른 지역명을 검색해보세요.
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function LibraryCard({
  distanceKm,
  isFavorite,
  library,
  onCall,
  onDirections,
  onFavorite,
  onHomepage,
  statusLabel,
  statusTone,
}: {
  distanceKm: number;
  isFavorite: boolean;
  library: Library;
  onCall: (phone: string) => void;
  onDirections: (library: Library) => void;
  onFavorite: (libraryId: string) => void;
  onHomepage: (homepage: string) => void;
  statusLabel: string;
  statusTone: 'open' | 'soon' | 'closed';
}) {
  return (
    <View style={styles.libraryCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleBlock}>
          <Text style={styles.libraryType}>
            {library.city} {library.district} · {library.type}
          </Text>
          <Text style={styles.libraryName}>{library.name}</Text>
        </View>

        <Pressable
          accessibilityLabel={
            isFavorite ? `${library.name} 즐겨찾기 해제` : `${library.name} 즐겨찾기`
          }
          accessibilityRole="button"
          onPress={() => onFavorite(library.id)}
          style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
        >
          <Text
            style={[
              styles.favoriteButtonText,
              isFavorite && styles.favoriteButtonTextActive,
            ]}
          >
            {isFavorite ? '저장됨' : '저장'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.cardMetaRow}>
        <View style={[styles.statusPill, styles[`statusPill_${statusTone}`]]}>
          <Text style={[styles.statusText, styles[`statusText_${statusTone}`]]}>
            {statusLabel}
          </Text>
        </View>
        <Text style={styles.distanceText}>{formatDistance(distanceKm)}</Text>
      </View>

      <View style={styles.infoGrid}>
        <InfoCell label="평일" value={formatHours(library.weekdayHours)} />
        <InfoCell label="토요일" value={formatHours(library.saturdayHours)} />
        <InfoCell label="일요일" value={formatHours(library.sundayHours)} />
        <InfoCell label="열람좌석" value={`${library.seats.toLocaleString()}석`} />
      </View>

      <Text style={styles.address}>{library.address}</Text>
      <Text style={styles.closedRule}>휴관: {library.closedRules.join(', ')}</Text>

      <View style={styles.actionRow}>
        <ActionButton label="전화" onPress={() => onCall(library.phone)} />
        <ActionButton label="홈페이지" onPress={() => onHomepage(library.homepage)} />
        <ActionButton label="길찾기" onPress={() => onDirections(library)} primary />
      </View>
    </View>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoCell}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function ActionButton({
  label,
  onPress,
  primary,
}: {
  label: string;
  onPress: () => void;
  primary?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.actionButton, primary && styles.actionButtonPrimary]}
    >
      <Text
        style={[
          styles.actionButtonText,
          primary && styles.actionButtonTextPrimary,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function formatHours(hours: Library['weekdayHours']) {
  if (!hours) {
    return '휴관';
  }

  return `${hours.open}-${hours.close}`;
}

function formatUpdatedAt(updatedAt: string | null) {
  if (!updatedAt) {
    return '원격 캐시가 없을 때도 앱은 내장 데이터로 동작합니다.';
  }

  return `마지막 동기화: ${new Date(updatedAt).toLocaleString('ko-KR')}`;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f4f1ea',
  },
  content: {
    paddingBottom: 32,
  },
  hero: {
    backgroundColor: '#17433b',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingBottom: 24,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  heroTopLine: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  appMark: {
    color: '#f7efe2',
    fontSize: 16,
    fontWeight: '800',
  },
  locationPill: {
    alignItems: 'center',
    backgroundColor: '#e6f3e9',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 6,
    minHeight: 34,
    paddingHorizontal: 12,
  },
  locationText: {
    color: '#1a5f53',
    fontSize: 12,
    fontWeight: '800',
  },
  heroTitle: {
    color: '#fffaf0',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 38,
    maxWidth: 310,
  },
  heroCopy: {
    color: '#cfe0d7',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 22,
  },
  metricCard: {
    backgroundColor: '#f7efe2',
    borderRadius: 8,
    flex: 1,
    minHeight: 70,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  metricValue: {
    color: '#153b34',
    fontSize: 20,
    fontWeight: '900',
  },
  metricLabel: {
    color: '#6f746e',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 5,
  },
  noticeBox: {
    backgroundColor: '#fff8df',
    borderColor: '#ecd78d',
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 20,
    marginTop: 16,
    padding: 14,
  },
  noticeTitle: {
    color: '#5c4d13',
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 4,
  },
  noticeText: {
    color: '#756526',
    fontSize: 13,
    lineHeight: 19,
  },
  searchPanel: {
    backgroundColor: '#fffaf0',
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 16,
    padding: 14,
  },
  sectionLabel: {
    color: '#3c4942',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
  },
  searchInput: {
    backgroundColor: '#f4f1ea',
    borderColor: '#ded6c9',
    borderRadius: 8,
    borderWidth: 1,
    color: '#1d2924',
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  filterRow: {
    gap: 8,
    paddingTop: 12,
  },
  filterChip: {
    alignItems: 'center',
    borderColor: '#d4cabb',
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 38,
    paddingHorizontal: 14,
  },
  filterChipActive: {
    backgroundColor: '#1a5f53',
    borderColor: '#1a5f53',
  },
  filterChipText: {
    color: '#566159',
    fontSize: 13,
    fontWeight: '800',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  sourceNotice: {
    backgroundColor: '#fffaf0',
    borderColor: '#e4dccc',
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 20,
    marginTop: 14,
    padding: 14,
  },
  sourceNoticeHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  sourceNoticeTitleBlock: {
    flex: 1,
  },
  sourceNoticeTitle: {
    color: '#26352f',
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 4,
  },
  sourceNoticeText: {
    color: '#7d756b',
    fontSize: 12,
    lineHeight: 18,
  },
  sourceWarningText: {
    color: '#8a5a15',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
  },
  sourceRefreshButton: {
    alignItems: 'center',
    borderColor: '#1a5f53',
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 34,
    minWidth: 82,
    paddingHorizontal: 12,
  },
  sourceRefreshButtonDisabled: {
    opacity: 0.65,
  },
  sourceRefreshButtonText: {
    color: '#1a5f53',
    fontSize: 12,
    fontWeight: '900',
  },
  libraryList: {
    gap: 12,
    marginHorizontal: 20,
    marginTop: 16,
  },
  libraryCard: {
    backgroundColor: '#fffaf0',
    borderColor: '#e4dccc',
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  cardHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  cardTitleBlock: {
    flex: 1,
  },
  libraryType: {
    color: '#6c776f',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 5,
  },
  libraryName: {
    color: '#1c2924',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 26,
  },
  favoriteButton: {
    alignItems: 'center',
    borderColor: '#d7ccbc',
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 34,
    minWidth: 62,
    paddingHorizontal: 12,
  },
  favoriteButtonActive: {
    backgroundColor: '#e6f3e9',
    borderColor: '#1a5f53',
  },
  favoriteButtonText: {
    color: '#5f685f',
    fontSize: 12,
    fontWeight: '900',
  },
  favoriteButtonTextActive: {
    color: '#1a5f53',
  },
  cardMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusPill_open: {
    backgroundColor: '#e5f5e8',
  },
  statusPill_soon: {
    backgroundColor: '#fff1c2',
  },
  statusPill_closed: {
    backgroundColor: '#f0e7df',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '900',
  },
  statusText_open: {
    color: '#176340',
  },
  statusText_soon: {
    color: '#755700',
  },
  statusText_closed: {
    color: '#776a5f',
  },
  distanceText: {
    color: '#4f5a53',
    fontSize: 13,
    fontWeight: '800',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  infoCell: {
    backgroundColor: '#f4f1ea',
    borderRadius: 8,
    minHeight: 58,
    paddingHorizontal: 10,
    paddingVertical: 9,
    width: '48%',
  },
  infoLabel: {
    color: '#7b746c',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 5,
  },
  infoValue: {
    color: '#1f2d27',
    fontSize: 14,
    fontWeight: '900',
  },
  address: {
    color: '#415047',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 14,
  },
  closedRule: {
    color: '#7b746c',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#f4f1ea',
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
  },
  actionButtonPrimary: {
    backgroundColor: '#1a5f53',
  },
  actionButtonText: {
    color: '#24342d',
    fontSize: 13,
    fontWeight: '900',
  },
  actionButtonTextPrimary: {
    color: '#ffffff',
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: '#fffaf0',
    borderRadius: 8,
    padding: 24,
  },
  emptyTitle: {
    color: '#1f2d27',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 8,
  },
  emptyText: {
    color: '#6d766f',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
