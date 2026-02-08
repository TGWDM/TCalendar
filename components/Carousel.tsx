import { Dimensions, Image, StyleSheet, Text, View, FlatList } from 'react-native'
import React from 'react'

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const slideList = Array.from({ length: 30 }).map((_, i) => {
  return {
    id: i,
    image: `https://picsum.photos/1440/2842?random=${i}`,
    title: `This is the title! ${i + 1}`,
    subtitle: `This is the subtitle ${i + 1}!`,
  };
});



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
        style={{ width: screenWidth * 0.9, height: screenHeight * 0.9 }}
      ></Image>
      <Text style={{ fontSize: 24 }}>{data.title}</Text>
      <Text style={{ fontSize: 18 }}>{data.subtitle}</Text>
    </View>
  );
}

export default function Carousel() {
  return (
    <FlatList
      data={slideList}
      style={{ flex: 1 }}
      renderItem={({ item }) => {
        return <Slide data={item} />;
      }}
    />
  );
};

const styles = StyleSheet.create({})