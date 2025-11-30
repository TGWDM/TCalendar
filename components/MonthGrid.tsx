import { Pressable, StyleSheet, useColorScheme, View, Modal, Platform, TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors'
import ThemedCard from './ThemedCard'
import ThemedText from './ThemedText'
import ThemedView from './ThemedView'
import EventModal from './EventModal'
import React, { useState } from 'react'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

const MonthGrid = ({ style, days = 7, ...props }) => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light
    const numOfRows = Math.ceil(days / 7);
    const [modalVisible, setModalVisible] = useState(false);
    const [DatePickerVisible, setDatePickerVisible] = useState(false);

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
            <EventModal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.modalTitleContainer}>
                    <View style={{ flex: 1 }} />
                    {/* Modal Title */}
                    <ThemedText style={styles.modalTitle}>Add Event</ThemedText>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <Ionicons name="close"
                            size={25}
                            color={theme.text}
                            onPress={() => setModalVisible(false)} />
                    </View>
                </View>

                {/* Modal content*/}
                <View style={styles.modalBodyContainer}>
                    {/* Splitting view into labels on the left and inputs on the right using styles */}
                    {/* Add your form inputs here */}
                    <View style={styles.fieldRow}>
                        <ThemedText style={styles.fieldLabel}>Event Name:</ThemedText>
                        <TextInput style={[styles.modalBodyTextInput, { flex: 1 }]} />
                    </View>
                    <View style={styles.fieldRow}>
                        <ThemedText style={styles.fieldLabel}>Event Date:</ThemedText>
                        <View style={styles.fieldControlRow}>
                            <Pressable
                                style={styles.selectDateButton}
                                onPress={() => setDatePickerVisible(true)}>
                                <ThemedText style={styles.selectDateText}>Select Date</ThemedText>
                            </Pressable>

                            {DatePickerVisible && (
                                <DateTimePicker
                                    mode="date"
                                    display="default"
                                    value={new Date()}
                                    onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                                        setDatePickerVisible(false);
                                         // handle selectedDate
                                    }}
                                />
                            )}
                        </View>
                    </View>
                </View>
            </EventModal>
        </ThemedView >
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
    modalTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalBodyContainer: {
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        justifyContent: 'flex-start',
        paddingHorizontal: 30,
    },
    fieldRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 12,
    },
    fieldLabel: {
        width: 110,         
        fontSize: 16,
        fontWeight: 'bold',
    },
    fieldControlRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 8,
    },
    selectDateButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#b3b1b1b7',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 6,
    },
    selectDateText: {
        fontSize: 14,
    },
    modalBodyText: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: "bold",
        marginBottom: 40,
        paddingTop: 8,
    },
    modalBodyTextInput: {
        height: 40,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#000000ff',
        backgroundColor: '#b3b1b1b7',
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