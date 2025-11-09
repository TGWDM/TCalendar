import { StyleSheet, useColorScheme, View } from 'react-native'
import { Colors } from '../constants/colors'
import ThemedCard from './ThemedCard'
import ThemedText from './ThemedText'
import ThemedView from './ThemedView'

const MonthGrid = ({ style, days = 7, ...props }) => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light
    const numOfRows = Math.ceil(days / 7);

    const buildGrid = () => {
        let grid = [];
        for (let row = 0; row < numOfRows; row++) { // for each week
            let rowItems = [];
            for (let col = 0; col < 7; col++) { // for each day in the week
                const dayIndex = row * 7 + col;
                if (dayIndex < days) {
                    rowItems.push( // add day card
                        <ThemedCard style={styles.GridCell} key={dayIndex}>
                            <ThemedText style={styles.CellText}>{dayIndex + 1}</ThemedText>
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
        </ThemedView>
    )
}

export default MonthGrid

const styles = StyleSheet.create({
    GridContainer: {
        flexDirection: 'column',
        flex:1
    },
    row: {
        flexDirection: 'row',
    },
    GridCell: {
        height: 70,
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
})