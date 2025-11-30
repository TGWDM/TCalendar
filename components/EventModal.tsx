import { StyleSheet, Text, View, Modal, Platform, useColorScheme } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../constants/colors'

const EventModal = (props) => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <Modal
        {...props}
        >
            <View style={[
                styles.modalOverlay,
                Platform.OS === 'web' && styles.modalOverlayWeb // for web to cover entire screen
            ]}>
                <View style={[
                    styles.modalContent,
                    Platform.OS === 'web' && styles.modalContentWeb, // for web to position above overlay
                    { backgroundColor: theme.modalBackground }
                ]}>
                    {/* Add in children to allow flexible content */}
                    {props.children}
                </View>
            </View>
        </Modal>
    )
}

export default EventModal

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.67)',
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
    modalContentContainer: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        paddingHorizontal: 30,
    }
})