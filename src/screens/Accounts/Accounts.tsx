import { ScreenProps } from "../../../types/navigation";
import { useRefreshOnFocus } from "../../hooks/useRefreshOnFocus";
import { ActivityIndicator, Text, Button, Divider } from "react-native-paper";
import { FlatList, TouchableOpacity, View } from "react-native";
import { useAccounts } from "../../services/accountService";
import { usePullDownRefresh } from "../../hooks/usePullDownRefresh";
import { Account } from "../../../types/account";
import { P, match } from "ts-pattern";

export function AccountsScreen({ navigation }: ScreenProps<"Accounts">) {
  const accountsQuery = useAccounts();
  const { refreshing, onRefresh } = usePullDownRefresh(accountsQuery.refetch);

  useRefreshOnFocus(accountsQuery.refetch);

  if (accountsQuery.error) {
    console.error(accountsQuery.error);
  }

  return (
    <View style={{ padding: 24, gap: 12 }}>
      <Button onPress={() => navigation.navigate("NewAccount")}>New Account</Button>
      {match(accountsQuery)
        .with({ isLoading: true }, () => <ActivityIndicator size="large" color="#0000ff" />)
        .with({ data: undefined }, () => <Text style={{ color: "red" }}>Something went wrong</Text>)
        .with({ error: P.not(P.nullish) }, () => (
          <Text style={{ color: "red" }}>An error ocurred, please try again later</Text>
        ))
        .otherwise(({ data }) => (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate("AccountRecords", { account: item })}>
                <AccountPanel account={item} />
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={Divider}
            refreshing={refreshing}
            onRefresh={onRefresh}
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        ))}
    </View>
  );
}

function AccountPanel({ account }: { account: Account }) {
  return (
    <View style={{ padding: 12, flexDirection: "row", justifyContent: "space-between" }}>
      <Text variant="displaySmall">{account.name}</Text>
      <Text variant="labelLarge" style={{ verticalAlign: "bottom" }}>
        ${account.balance.toFixed(2)}
      </Text>
    </View>
  );
}
