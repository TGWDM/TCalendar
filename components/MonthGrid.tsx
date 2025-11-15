import { Pressable, StyleSheet, useColorScheme, View, Modal, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors'
import ThemedCard from './ThemedCard'
import ThemedText from './ThemedText'
import ThemedView from './ThemedView'
import React, { useState } from 'react'

const MonthGrid = ({ style, days = 7, ...props }) => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light
    const numOfRows = Math.ceil(days / 7);
    const [modalVisible, setModalVisible] = useState(false);

    const buildGrid = () => {
        let grid = [];
        for (let row = 0; row < numOfRows; row++) { // for each week
            let rowItems = [];
            for (let col = 0; col < 7; col++) { // for each day in the week
                const dayIndex = row * 7 + col;
                if (dayIndex < days) {
                    rowItems.push( // add day card
                        <ThemedCard style={styles.GridCell} key={dayIndex}>
                            <View>
                                <ThemedText style={styles.CellText}>{dayIndex + 1}</ThemedText>
                            </View>
                            <ThemedView style={{ position: 'absolute', bottom: 5 }} >
                                <Pressable onPress={() => {
                                    // Open modal to add event
                                    setModalVisible(true);
                                }}>
                                    <Ionicons name="add-circle" size={20} color="white" />
                                </Pressable>
                            </ThemedView>
                        </ThemedCard>
                    );
                }
            }
            grid.push( // add the week row
                <View style={styles.row} key={row}>
                    {rowItems}
                </View>
            );
        }
        return grid;
    }

    return (
        <ThemedView
            style={[styles.GridContainer, { backgroundColor: theme.background }, style]}
            {...props}
        >
            {buildGrid()}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={[
                    styles.modalOverlay,
                    Platform.OS === 'web' && styles.modalOverlayWeb // for web to cover entire screen
                ]}>
                    <View style={[
                        styles.modalContent,
                        Platform.OS === 'web' && styles.modalContentWeb, // for web to position above overlay
                        { backgroundColor: theme.modalBackground }
                    ]}>
                        <View style={[styles.CellText,{ alignItems: 'center', justifyContent:"space-between", marginBottom: 20, flexDirection: 'row' }]}>
                            <ThemedText style={styles.modalTitle}>Add Event</ThemedText>
                            <Ionicons name="close" size={20} color={theme.text} />
                        </View>

                        <Pressable
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <ThemedText style={styles.closeButtonText}>Close</ThemedText>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </ThemedView>
    )
}

export default MonthGrid

const styles = StyleSheet.create({
    GridContainer: {
        flexDirection: 'column',
        flex: 1
    },
    row: {
        flexDirection: 'row',
    },
    GridCell: {
        height: 90,
        width: 90,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
    },
    CellText: {
        alignSelf: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalOverlayWeb: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
    },
    modalContent: {
        borderRadius: 12,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        minHeight: 400,
        alignItems: 'center',
    },
    modalContentWeb: {
        position: 'relative',
        zIndex: 1001,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    closeButton: {
        backgroundColor: '#FF3B30',
        padding: 12,
        borderRadius: 8,
        width: '50%',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
})