import { StyleSheet, Modal, View } from 'react-native'
import React, { useState } from 'react'
import ThemedView from "../components/ThemedView"
import ThemedText from '../components/ThemedText'
import MonthGrid from '../components/MonthGrid'
import ThemedCard from '../components/ThemedCard'

const date = new Date()
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const currentMonth = monthNames[date.getMonth()]

let daysInMonth = 0;
if (date.getMonth() === 1) {
    daysInMonth = 28
} else if (date.getMonth() % 2 === 0) {
    daysInMonth = 30
} else {
    daysInMonth = 31
}


const Home = () => {
    return (
        <ThemedView style={styles.root}>
            <View style={styles.MonthCarousel}>
                <View style={styles.Month}>
                    <ThemedText style={styles.title}>Current month is: {currentMonth}</ThemedText>
                    <MonthGrid style={{ marginTop: 10 }} days={daysInMonth} openMonth={date.getMonth()} />
                </View>
            </View>
        </ThemedView>
    )
}



export default Home

const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    MonthCarousel: {
        display: 'flex',
        overflow: 'hidden',
        backgroundColor: 'transparent'
    },
    Month: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }

})