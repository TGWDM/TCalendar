import { Dimensions, Image, StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useRef, useState, useEffect, useCallback, memo } from 'react'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const slideList = Array.from({ length: 30 }).map((_, i) => {
  return {
    id: i,
    image: `https://picsum.photos/1440/2842?random=${i}`,
    title: `This is the title! ${i + 1}`,
    subtitle: `This is the subtitle ${i + 1}!`,
  };
});

const flatListOptimizationProps = {
  initialNumToRender: 0, // how many items to render initially
  maxToRenderPerBatch: 1, // how many items to render in each batch
  removeClippedSubviews: true, // unmount components when outside of window
  scrollEventThrottle: 16, // how often to fire scroll events (in ms)
  windowSize: 2, // number of items outside of the visible area to keep rendered
  keyExtractor: useCallback(e => e.id, []),
  getItemLayout: useCallback(
    (_, index) => ({
      index,
      length: screenWidth,
      offset: index * screenWidth,
    }),
    []
  ),
};

function Slide({ data }) { // Slide component to render each slide in the carousel
  return (
    <View
      style={{
        height: screenHeight,
        width: screenWidth,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={{ uri: data.image }}
        style={{ width: screenWidth * 0.9, height: screenHeight * 0.4 }}
      ></Image>
      <Text style={{ fontSize: 24, color: 'white' }}>{data.title}</Text>
      <Text style={{ fontSize: 18, color: 'white' }}>{data.subtitle}</Text>
    </View>
  );
}

// Memoize the Slide component to prevent unnecessary re-renders
const MemoizedSlide = memo(Slide);

export default function Carousel() {
  // State to keep track of the current slide index
  const [index, setIndex] = useState(0);
  // Ref to keep track of the current index
  const indexRef = useRef(index);
  // Function to handle updating the index when the user scrolls
  indexRef.current = index;
  const onScroll = useCallback((event) => {
    // Get the width of each slide since carousel is horizontal
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    // Calculate the current index based on the scroll position
    const index = event.nativeEvent.contentOffset.x / slideSize;
    // Round the index to the nearest whole number
    const roundIndex = Math.round(index);
    // Calculate the distance between the rounded index and the current index
    const distance = Math.abs(roundIndex - index);

    // Prevent one pixel triggering setIndex in the middle of the transition. 
    // With this we have to scroll a bit more to trigger the index change.
    const isNoMansLand = 0.4 < distance;
    // If not in "no mans land" and rounded index does not equal current index, update the index
    if (roundIndex !== indexRef.current && !isNoMansLand) {
      setIndex(roundIndex);
    }
  }, []);

  // use the index
  useEffect(() => {
    console.warn("index changed to ", index);
  }, [index]) // This effect will run whenever the index changes

  return (
    <FlatList
      data={slideList}
      style={{ flex: 1 }}
      renderItem={({ item }) => {
        return <MemoizedSlide data={item}/>;
      }}
      pagingEnabled
      horizontal
      showsHorizontalScrollIndicator={false}
      // set onScroll handler
      onScroll={onScroll}
      // add flatList optimization props
      {...flatListOptimizationProps}
    />
  );
};

const styles = StyleSheet.create({})