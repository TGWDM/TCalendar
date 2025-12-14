import { StyleSheet, Pressable } from 'react-native'
import React from 'react'
import ThemedText from './ThemedText'

interface SaveButtonProps { // Define props interface for save button
    onPress: () => void;
    text: string;
    enabled?: boolean;
}

const SaveButton = ({ onPress, text = "Save", enabled = true }: SaveButtonProps) => {
    // Debug log
    console.log('SaveButton rendered with enabled:', enabled);  
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