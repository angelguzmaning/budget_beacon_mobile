import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PaperProvider } from "react-native-paper";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { NewAccountScreen } from "./src/screens/NewAccount/NewAccount";
import React from "react";
import { RootStackParamList } from "./types/navigation";
import { AccountsScreen } from "./src/screens/Accounts/Accounts";
import { AccountRecordsScreen } from "./src/screens/AccountRecords/AccountRecords";
import { NewRecordScreen } from "./src/screens/NewRecord/NewRecord";
import { enGB, registerTranslation } from "react-native-paper-dates";

registerTranslation("en-GB", enGB);
const queryClient = new QueryClient();
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Accounts">
            <Stack.Screen name="Accounts" component={AccountsScreen} />
            <Stack.Screen name="NewAccount" component={NewAccountScreen} options={{ title: "Create Account" }} />
            <Stack.Screen name="AccountRecords" component={AccountRecordsScreen} options={{ title: "Account" }} />
            <Stack.Screen name="NewRecord" component={NewRecordScreen} options={{ title: "Create Record" }} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </QueryClientProvider>
  );
}
