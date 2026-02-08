import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import ThemedText from './ThemedText'
import MonthGrid from './MonthGrid'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const date = new Date()

export default function Slide({monthName, daysInMonth }) { // Slide component to render each slide in the carousel
    return (
        <View
            style={{
                height: screenHeight,
                width: screenWidth,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <ThemedText style={styles.title}>Current month is: {monthName}</ThemedText>
            <MonthGrid style={{ marginTop: 10 }} days={daysInMonth} />
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontWeight: 'bold',
        fontSize: 18,
    }
})