import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { MeridianId, Combination } from '../types';
import { UPPER_MERIDIANS, LOWER_MERIDIANS, MERIDIAN_LIST } from '../data/meridians';
import { COMBINATIONS } from '../data/combinations';
import { channelRelations } from '../data/channelRelations';
import { MeridianPicker, Carousel, CombinationCard, StaticResultCard } from '../components';

type TabType = 'global' | 'static';

const GlobalBalanceSubScreen: React.FC = () => {
  const theme = useTheme();
  const [ponto1, setPonto1] = useState<MeridianId | null>(null);
  const [ponto2, setPonto2] = useState<MeridianId | null>(null);
  const [ponto3, setPonto3] = useState<MeridianId | null>(null);
  const [ponto4, setPonto4] = useState<MeridianId | null>(null);

  const filteredCombinations = useMemo(() => {
    if (!ponto1 && !ponto2 && !ponto3 && !ponto4) {
      return [];
    }
    return COMBINATIONS.filter(combination => {
      if (ponto1 && combination.point1 !== ponto1) return false;
      if (ponto2 && combination.point2 !== ponto2) return false;
      if (ponto3 && combination.point3 !== ponto3) return false;
      if (ponto4 && combination.point4 !== ponto4) return false;
      return true;
    });
  }, [ponto1, ponto2, ponto3, ponto4]);

  const hasSelections = !!(ponto1 || ponto2 || ponto3 || ponto4);
  const showResults = hasSelections && filteredCombinations.length > 0;
  const showEmptyState = hasSelections && filteredCombinations.length === 0;

  return (
    <View style={styles.subContainer}>
      <ScrollView style={styles.pickersContainer} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Seleccioná los canales</Text>

        <View style={styles.pickersGrid}>
          <View style={styles.pickerRow}>
            <View style={styles.pickerCell}>
              <MeridianPicker
                selectedMeridian={ponto1}
                onSelect={setPonto1}
                availableMeridians={UPPER_MERIDIANS}
                pairValue={ponto2}
              />
            </View>
            <View style={styles.pickerCell}>
              <MeridianPicker
                selectedMeridian={ponto2}
                onSelect={setPonto2}
                availableMeridians={UPPER_MERIDIANS}
                pairValue={ponto1}
              />
            </View>
          </View>
          <View style={styles.pickerRow}>
            <View style={styles.pickerCell}>
              <MeridianPicker
                selectedMeridian={ponto3}
                onSelect={setPonto3}
                availableMeridians={LOWER_MERIDIANS}
                pairValue={ponto4}
              />
            </View>
            <View style={styles.pickerCell}>
              <MeridianPicker
                selectedMeridian={ponto4}
                onSelect={setPonto4}
                availableMeridians={LOWER_MERIDIANS}
                pairValue={ponto3}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.carouselContainer}>
        {!hasSelections && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Elegí los canales para ver las combinaciones posibles.
            </Text>
          </View>
        )}
        {showEmptyState && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Ninguna combinación coincide con los criterios seleccionados.
            </Text>
          </View>
        )}
        {showResults && (
          <Carousel<Combination>
            data={filteredCombinations}
            keyExtractor={(item) => item.id}
            renderItem={(combination) => (
              <CombinationCard combination={combination} />
            )}
          />
        )}
      </View>
    </View>
  );
};

const StaticBalanceSubScreen: React.FC = () => {
  const theme = useTheme();
  const [canal1, setCanal1] = useState<MeridianId | null>(null);
  const [canal2, setCanal2] = useState<MeridianId | null>(null);
  const [canal3, setCanal3] = useState<MeridianId | null>(null);
  const [canal4, setCanal4] = useState<MeridianId | null>(null);
  const [canal5, setCanal5] = useState<MeridianId | null>(null);
  const [canal6, setCanal6] = useState<MeridianId | null>(null);

  const allSelectedMeridians = useMemo(() => {
    const selected = [canal1, canal2, canal3, canal4, canal5, canal6];
    return selected.filter((m): m is MeridianId => m !== null);
  }, [canal1, canal2, canal3, canal4, canal5, canal6]);

  const getDisabledForCanal = (ownValue: MeridianId | null): MeridianId[] => {
    return allSelectedMeridians.filter(m => m !== ownValue);
  };

  const selectedArrays = useMemo(() => {
    return [canal1, canal2, canal3, canal4, canal5, canal6]
      .filter((m): m is MeridianId => m !== null)
      .map(m => channelRelations[m]);
  }, [canal1, canal2, canal3, canal4, canal5, canal6]);

  const matches = useMemo(() => {
    if (selectedArrays.length < 1) return [];

    const results: Array<{ channelId: string; positions: number[] }> = [];
    const firstArray = selectedArrays[0];

    for (let x = 0; x < 5; x++) {
      let matchStr = '' + (x + 1);
      if (selectedArrays.length > 1) {
        for (let i = 1; i < selectedArrays.length; i++) {
          for (let y = 0; y < 5; y++) {
            if (selectedArrays[i][y] === firstArray[x]) {
              matchStr += '' + (y + 1);
            }
          }
        }
      }
      if (matchStr.length === selectedArrays.length) {
        const channelId = firstArray[x];
        const positions = matchStr.split('').map(Number);
        results.push({ channelId, positions });
      }
    }
    return results;
  }, [selectedArrays]);

  const hasSelections = allSelectedMeridians.length > 0;
  const showResults = hasSelections && matches.length > 0;
  const showEmptyState = hasSelections && matches.length === 0;

  return (
    <View style={styles.subContainer}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Seleccioná los canales</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Un canal no puede ser seleccionado más de una vez
        </Text>

        <View style={styles.pickersGrid}>
          <View style={styles.pickerRow}>
            <View style={styles.pickerCell}>
              <MeridianPicker
                selectedMeridian={canal1}
                onSelect={setCanal1}
                availableMeridians={MERIDIAN_LIST}
                disabledValues={getDisabledForCanal(canal1)}
              />
            </View>
            <View style={styles.pickerCell}>
              <MeridianPicker
                selectedMeridian={canal2}
                onSelect={setCanal2}
                availableMeridians={MERIDIAN_LIST}
                disabledValues={getDisabledForCanal(canal2)}
              />
            </View>
          </View>
          <View style={styles.pickerRow}>
            <View style={styles.pickerCell}>
              <MeridianPicker
                selectedMeridian={canal3}
                onSelect={setCanal3}
                availableMeridians={MERIDIAN_LIST}
                disabledValues={getDisabledForCanal(canal3)}
              />
            </View>
            <View style={styles.pickerCell}>
              <MeridianPicker
                selectedMeridian={canal4}
                onSelect={setCanal4}
                availableMeridians={MERIDIAN_LIST}
                disabledValues={getDisabledForCanal(canal4)}
              />
            </View>
          </View>
          <View style={styles.pickerRow}>
            <View style={styles.pickerCell}>
              <MeridianPicker
                selectedMeridian={canal5}
                onSelect={setCanal5}
                availableMeridians={MERIDIAN_LIST}
                disabledValues={getDisabledForCanal(canal5)}
              />
            </View>
            <View style={styles.pickerCell}>
              <MeridianPicker
                selectedMeridian={canal6}
                onSelect={setCanal6}
                availableMeridians={MERIDIAN_LIST}
                disabledValues={getDisabledForCanal(canal6)}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.carouselContainer}>
        {!hasSelections && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Elegí los canales para ver las combinaciones posibles.
            </Text>
          </View>
        )}
        {showEmptyState && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Ninguna combinación coincide con los criterios seleccionados.
            </Text>
          </View>
        )}
        {showResults && (
          <Carousel<{ channelId: string; positions: number[] }>
            data={matches}
            keyExtractor={(item, index) => `${item.channelId}-${index}`}
            renderItem={(match, index) => (
              <StaticResultCard
                channelId={match.channelId}
                positions={match.positions}
                displayIndex={index + 1}
              />
            )}
          />
        )}
      </View>
    </View>
  );
};

export const BalanceScreen: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('global');

  const renderContent = () => {
    if (activeTab === 'global') return <GlobalBalanceSubScreen />;
    return <StaticBalanceSubScreen />;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.tabBar, { borderBottomColor: theme.primary }]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'global' && { borderBottomColor: theme.primary }]}
          onPress={() => setActiveTab('global')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'global'
                ? [styles.tabTextActive, { color: theme.primary }]
                : { color: theme.textSecondary },
            ]}
          >
            Equilibrio{'\n'}Global
          </Text>
        </TouchableOpacity>

        <View style={[styles.tabDivider, { backgroundColor: theme.border }]} />

        <TouchableOpacity
          style={[styles.tab, activeTab === 'static' && { borderBottomColor: theme.primary }]}
          onPress={() => setActiveTab('static')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'static'
                ? [styles.tabTextActive, { color: theme.primary }]
                : { color: theme.textSecondary },
            ]}
          >
            Equilibrio{'\n'}Estático
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>{renderContent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  tabDivider: {
    width: 1,
  },
  tabText: {
    fontSize: 14,
    textAlign: 'center',
  },
  tabTextActive: {
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  subContainer: {
    flex: 1,
  },
  pickersContainer: {
    flexGrow: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 16,
    textAlign: 'center',
  },
  pickersGrid: {
    marginBottom: 10,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerCell: {
    flex: 1,
    paddingHorizontal: 4,
  },
  carouselContainer: {
    flex: 1,
    minHeight: 300,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
});
