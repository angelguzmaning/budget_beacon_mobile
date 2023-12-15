import { ScreenProps } from "../../../types/navigation";
import { useRefreshOnFocus } from "../../hooks/useRefreshOnFocus";
import { ActivityIndicator, Text, Button, Divider } from "react-native-paper";
import { FlatList, TouchableOpacity, View } from "react-native";
import { useAccounts } from "../../services/accountService";
import { usePullDownRefresh } from "../../hooks/usePullDownRefresh";

export function AccountsScreen({ navigation }: ScreenProps<"Accounts">) {
  const { data, isLoading, refetch } = useAccounts();
  const { refreshing, onRefresh } = usePullDownRefresh(refetch);

  useRefreshOnFocus(refetch);

  if (isLoading || refreshing || data === undefined) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={{ padding: 24, gap: 12 }}>
      <Button onPress={() => navigation.navigate("NewAccount")}>New Account</Button>
      <FlatList
        data={data}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate("AccountRecords", { account: item })}>
            <View style={{ padding: 12 }}>
              <Text variant="displaySmall">{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={Divider}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}
