import { StyleSheet, Modal, View } from 'react-native'
import React, { useState } from 'react'
import ThemedView from "../components/ThemedView"
import MonthCarousel from "../components/MonthCarousel"

const Home = () => {
    return (
        <ThemedView style={styles.root}>
            <MonthCarousel/>
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