import React, { useState, useRef, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, NativeScrollEvent, NativeSyntheticEvent, Dimensions } from 'react-native';
import { useTheme } from '../../theme/useTheme';

interface CarouselProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  emptyText?: string;
}

export function Carousel<T>({
  data,
  renderItem,
  keyExtractor,
  emptyText,
}: CarouselProps<T>) {
  const theme = useTheme();
  const [currentPage, setCurrentPage] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const prevLengthRef = useRef(data.length);
  const { width: screenWidth } = Dimensions.get('window');
  const cardWidth = screenWidth;

  useEffect(() => {
    if (data.length !== prevLengthRef.current) {
      prevLengthRef.current = data.length;
      setCurrentPage(0);
      scrollRef.current?.scrollTo({ x: 0, animated: false });
    }
  }, [data.length]);

  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const page = Math.round(e.nativeEvent.contentOffset.x / cardWidth);
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  }, [cardWidth, currentPage]);

  if (data.length === 0 && emptyText) {
    return (
      <View style={styles.emptyState}>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>{emptyText}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
      >
        {data.map((item, index) => (
          <View key={keyExtractor(item, index)} style={[styles.card, { width: cardWidth }]}>
            {renderItem(item, index)}
          </View>
        ))}
      </ScrollView>

      {data.length > 1 && (
        <View style={styles.dotsContainer}>
          {data.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: theme.border },
                index === currentPage && { backgroundColor: theme.text },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
  card: {
    justifyContent: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
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
});
