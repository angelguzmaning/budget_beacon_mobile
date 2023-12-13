import { ScreenProps } from "../../../types/navigation";
import { useRefreshOnFocus } from "../../hooks/useRefreshOnFocus";
import { ActivityIndicator, Text, Button, Divider } from "react-native-paper";
import { FlatList, View } from "react-native";
import { useAccounts } from "../../services/accountService";
import { useCallback, useState } from "react";

export function AccountsScreen({ navigation }: ScreenProps) {
  const { data, isLoading, refetch } = useAccounts();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().then(() => setRefreshing(false));
  }, [refetch]);

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
          <View style={{ padding: 12 }}>
            <Text variant="displaySmall">{item.name}</Text>
          </View>
        )}
        ItemSeparatorComponent={Divider}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}
