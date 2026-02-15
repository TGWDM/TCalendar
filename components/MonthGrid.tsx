import { Pressable, StyleSheet, useColorScheme, View, Dimensions, Platform, TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors'
import ThemedCard from './ThemedCard'
import ThemedText from './ThemedText'
import ThemedView from './ThemedView'
import EventModal from './EventModal'
import SaveButton from './SaveButton'
import React, { useState } from 'react'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as SQLite from 'expo-sqlite';

// Get current month index (0-11)
const date = new Date()
const currentMonth = date.getMonth() + 1; // +1 to convert to 1-12
const currentYear = date.getFullYear();

// function for formatting date to YYYY-MM-DD
const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(currentMonth).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

async function setupDatabase() {
    // Open or create the database
    const db = await SQLite.openDatabaseAsync('events.db');
    // Create the events table if it doesn't exist
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            event_date DATE NOT NULL,
            event_time TIME NOT NULL,
            description TEXT
        );
    `);
    return db;
}

// Function to add an event to the database
export async function addEvent(title: string, eventDate: string, eventTime: string,  description: string) {
    // Get the database connection
    const db = await setupDatabase();
    // Insert the event into the database
    await db.runAsync(`
        INSERT INTO events (title, event_date, event_time, description)
        VALUES (?, ?, ?, ?);
    `, [title, eventDate, eventTime, description]);
}

const MonthGrid = ({ style, days = 7, ...props }) => {
    const colorScheme = useColorScheme() // get current color scheme
    const theme = Colors[colorScheme] ?? Colors.dark // select theme colors
    const numOfRows = Math.ceil(days / 7); // calculate number of weeks needed
    const [modalVisible, setModalVisible] = useState(false); // control modal visibility
    const [datePickerVisible, setDatePickerVisible] = useState(false);// controls native date picker visibility
    const [selectedDate, setSelectedDate] = useState(new Date());// default to current date
    const [selectedTime, setSelectedTime] = useState(new Date());// default to current time
    const [calEvent, setCalEvent] = useState({
        name: '',
        date: selectedDate,
        time: selectedTime,
        description: '',
    }); // store event details

    const handleDateChange = (event, date) => {
        // Native mobile behavior
        if (Platform.OS !== "web") {
            if (event.type === "set" && date) {
                setSelectedDate(date);
            }
            setDatePickerVisible(false);
        }
    };

    /*function to calculate the width/height of the grid cells so they even fill the parent container.*/
    const calculateCellDimensions = () => {
        const screenWidth = Dimensions.get('window').width;
        const screenHeight = Dimensions.get('window').height;
        const cellWidth = screenWidth / 7;
        const cellHeight = screenHeight / numOfRows;
        return { cellWidth, cellHeight };
    };

    const webTextInputFix = {
        //Fix for web TextInput to remove default blue outline on focus
        outlineStyle: 'none',
        boxShadow: 'none',
    } as any;

    const buildGrid = () => {
        let { dynamicCellWidth, dynamicCellHeight } = calculateCellDimensions();
        let grid = [];
        for (let row = 0; row < numOfRows; row++) { // for each week
            let rowItems = [];
            for (let col = 0; col < 7; col++) { // for each day in the week
                const dayIndex = row * 7 + col;
                const dayAfterIndex = dayIndex + 1;
                if (dayIndex < days) {
                    rowItems.push( // add day card
                        <ThemedCard 
                        style={styles.GridCell}
                        key={dayIndex}>
                            <View>
                                <ThemedText style={styles.CellText}>{dayAfterIndex}</ThemedText>
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
                    <View>
                        {/* Splitting view into labels on the left and inputs on the right using styles */}
                        {/* Add your form inputs here */}
                        <View style={styles.fieldRow}>
                            <ThemedText style={styles.fieldLabel}>Event Name:</ThemedText>
                            <TextInput
                                style={[
                                    styles.modalBodyTextInput,
                                    Platform.OS === 'web' && webTextInputFix, // use the web-specific style here
                                ]}
                                value={calEvent.name} // bind to event name state
                                onChangeText={(text) => setCalEvent({ ...calEvent, name: text })} // update event name
                                selectionColor="transparent"
                            />
                        </View>

                        {/* Date picker for web */}
                        <View style={styles.fieldRow}>
                            <ThemedText style={styles.fieldLabel}>Event Date:</ThemedText>
                            {Platform.OS === 'web' ? (
                                <input
                                    type="date"
                                    style={styles.modalBodyTextInput}
                                    value={formatDate(calEvent.date)}// bind to event date using selected cell
                                    onChange={(e) => {
                                        const [y, m, d] = e.target.value.split('-').map(Number); // extract year, month, day 
                                        setCalEvent(prev => ({ ...prev, date: new Date(y, m - 1, d) })); // update event date state
                                        setSelectedDate(new Date(y, m - 1, d)); // also update selected date state
                                    }}
                                />
                            ) : (
                                <Pressable
                                    style={styles.selectDateButton}
                                    onPress={() => setDatePickerVisible(true)}
                                >
                                    <ThemedText style={styles.selectDateText}>Select Date</ThemedText>
                                </Pressable>
                            )}
                        </View>

                        {/* Time picker for web */}
                        <View style={styles.fieldRow}>
                            <ThemedText style={styles.fieldLabel}>Event Time:</ThemedText>
                            {Platform.OS === 'web' ? (
                                <input
                                    type="time"
                                    style={styles.modalBodyTextInput}
                                    value={calEvent.time.toISOString().split('T')[1].substring(0, 5)} // bind to event time state
                                    // update event time with user selection
                                    onChange={(e) => {
                                        const [hours, minutes] = e.target.value.split(':'); // extract hours and minutes
                                        const updatedTime = new Date(calEvent.time); // create a copy of the current time
                                        updatedTime.setHours(parseInt(hours), parseInt(minutes));// set new hours and minutes
                                        setCalEvent({ ...calEvent, time: updatedTime }); // update event time state
                                    }}
                                />
                            ) : (
                                <Pressable
                                    style={styles.selectDateButton}
                                    onPress={() => setDatePickerVisible(true)}
                                >
                                    <ThemedText style={styles.selectDateText}>Select Time</ThemedText>
                                </Pressable>
                            )}
                        </View>
                        <View style={styles.fieldRow}>
                            <ThemedText style={styles.fieldLabel}>Event Details:</ThemedText>
                            <TextInput
                                style={[
                                    styles.modalDetailsInput,
                                    Platform.OS === 'web' && webTextInputFix, // use the web-specific style here
                                ]}
                                value={calEvent.description} // bind to event name state
                                onChangeText={(text) => setCalEvent({ ...calEvent, description: text })} // update event description
                                multiline={true}
                                selectionColor="transparent"
                            />
                        </View>
                    </View>
                    <SaveButton
                        text="Save Event"
                         // onPress should save the event to the database and close the modal
                        onPress={() => {
                            addEvent(
                                calEvent.name,
                                formatDate(calEvent.date),
                                calEvent.time.toTimeString().split(' ')[0], // format time as HH:MM:SS
                                calEvent.description || '' // use description if available, otherwise empty string
                            );
                            setModalVisible(false);
                        }}
                        enabled={!!calEvent.name?.trim()} // enable only if event name is not empty trim is avoids space only names
                    />
                </View>
            </EventModal>

            {datePickerVisible && Platform.OS === "android" && (
                <DateTimePicker
                    mode="date"
                    display="default"
                    value={selectedDate}
                    onChange={handleDateChange}
                />
            )}
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
        width: 70,
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
        justifyContent: 'space-between',
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
        width: '70%',
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#000000ff',
        backgroundColor: '#b3b1b1b7',
    },
    modalDetailsInput: {
        height: 80,
        width: '70%',
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#000000ff',
        backgroundColor: '#b3b1b1b7',
        textAlignVertical: 'top'
    },
})