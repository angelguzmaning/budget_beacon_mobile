import { FlatList, View } from "react-native";
import { ActivityIndicator, Button, Divider, Text } from "react-native-paper";
import { ScreenProps } from "../../../types/navigation";
import { useRecordsByAccount } from "../../services/recordService";
import { P, match } from "ts-pattern";
import { TransactionRecord } from "../../../types/transactionRecord";
import { format } from "date-fns";
import { useRefreshOnFocus } from "../../hooks/useRefreshOnFocus";
import { usePullDownRefresh } from "../../hooks/usePullDownRefresh";

export function AccountRecordsScreen({
  navigation,
  route: {
    params: { account },
  },
}: ScreenProps<"AccountRecords">) {
  const recordsQuery = useRecordsByAccount(account.id);
  const { refreshing, onRefresh } = usePullDownRefresh(recordsQuery.refetch);

  useRefreshOnFocus(recordsQuery.refetch);

  if (recordsQuery.error) {
    console.error(recordsQuery.error);
  }

  return (
    <View style={{ padding: 24, gap: 12 }}>
      <Text variant="titleMedium">Account: {account.name}</Text>
      <Button onPress={() => navigation.navigate("NewRecord", { account })}>New Record</Button>
      {match(recordsQuery)
        .with({ isLoading: true }, () => <ActivityIndicator size="large" color="#0000ff" />)
        .with({ error: P.not(null) }, () => <Text>An error ocurred</Text>)
        .with({ data: P.nullish }, () => <Text>No data</Text>)
        .otherwise(({ data }) => (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <AccountRecordItem record={item} />}
            ItemSeparatorComponent={Divider}
            contentContainerStyle={{ paddingBottom: 24 }}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        ))}
    </View>
  );
}

function AccountRecordItem({ record }: { record: TransactionRecord }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 12 }}>
      <Text>{record.description}</Text>
      <Text>{record.amount}</Text>
      <Text>{format(record.date, "yyyy/MM/dd")}</Text>
    </View>
  );
}
