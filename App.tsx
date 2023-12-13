import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PaperProvider } from "react-native-paper";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { NewAccountScreen } from "./src/screens/NewAccount/NewAccount";
import React from "react";
import { RootStackParamList } from "./types/navigation";
import { AccountsScreen } from "./src/screens/Accounts/Accounts";

const queryClient = new QueryClient();
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Accounts">
            <Stack.Screen name="Accounts" component={AccountsScreen} />
            <Stack.Screen name="NewAccount" component={NewAccountScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </QueryClientProvider>
  );
}
