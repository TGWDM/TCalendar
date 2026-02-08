import { Stack } from "expo-router"
import { Colors } from "../constants/colors"
import { useColorScheme } from "react-native"
import { StatusBar } from "expo-status-bar"

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.dark

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{
        headerStyle: { backgroundColor: theme.navBackground, },
        headerTintColor: theme.title,
        headerTitleAlign: "center",
      }}>
        {/* Groups */}
        {/* <Stack.Screen name="(auth)" options={{ headerShown: false }} />*./}

        {/* Individual Screens */}
        <Stack.Screen name="index" options={{ title: "TCalendar" }} />
      </Stack>
    </>
  )
}