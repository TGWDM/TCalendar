import { StyleSheet, Pressable } from 'react-native'
import React from 'react'
import ThemedText from './ThemedText'
import * as SQLite from 'expo-sqlite';

interface SaveButtonProps { // Define props interface for save button
    onPress: () => void;
    text: string;
    enabled?: boolean;
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
    // Close the database connection
    await db.closeAsync();
}


const SaveButton = ({ onPress, text = "Save", enabled = true }: SaveButtonProps) => {
    return (
        <Pressable
            style={[enabled ? styles.saveButtonOn : styles.saveButtonOff]} // Change style based on enabled prop
            onPress ={enabled ? onPress : undefined} // Disable onPress if not enabled
            disabled={!enabled} // Disable Pressable if not enabled
        >
            <ThemedText style={styles.saveButtonText}>
                {text}
            </ThemedText>
        </Pressable>
    )
}

export default SaveButton

const styles = StyleSheet.create({
    saveButtonOn: {
        backgroundColor: '#FF3B30',
        padding: 12,
        borderRadius: 8,
        width: '50%',
        alignItems: 'center',
        justifyContent: "center",
        alignSelf: "center"
    },
    saveButtonOff: {
        backgroundColor: '#676767ff',
        padding: 12,
        borderRadius: 8,
        width: '50%',
        alignItems: 'center',
        justifyContent: "center",
        alignSelf: "center"
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
})