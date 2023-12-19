import { FlatList, ToastAndroid, View } from "react-native";
import { ActivityIndicator, Button, Dialog, Divider, Text } from "react-native-paper";
import { ScreenProps } from "../../../types/navigation";
import { useRecordsByAccount } from "../../services/recordService";
import { P, match } from "ts-pattern";
import { TransactionRecord } from "../../../types/transactionRecord";
import { format } from "date-fns";
import { useRefreshOnFocus } from "../../hooks/useRefreshOnFocus";
import { usePullDownRefresh } from "../../hooks/usePullDownRefresh";
import { useEffect, useState } from "react";
import { useDeleteAccountMutation } from "../../services/accountService";

export function AccountRecordsScreen({
  navigation,
  route: {
    params: { account },
  },
}: ScreenProps<"AccountRecords">) {
  const recordsQuery = useRecordsByAccount(account.id);
  const { refreshing, onRefresh } = usePullDownRefresh(recordsQuery.refetch);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);

  useRefreshOnFocus(recordsQuery.refetch);

  if (recordsQuery.error) {
    console.error(recordsQuery.error);
  }

  return (
    <View style={{ padding: 24, gap: 12, height: "100%" }}>
      <Text variant="titleMedium">Account: {account.name}</Text>
      <Button onPress={() => navigation.navigate("NewRecord", { account })}>New Record</Button>
      <Button icon="delete" textColor="red" onPress={() => setConfirmDialogVisible(true)}>
        Delete
      </Button>
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
      <ConfirmDeleteDialog
        confirmDialogVisible={confirmDialogVisible}
        setConfirmDialogVisible={setConfirmDialogVisible}
        navigation={navigation}
        accountId={account.id}
      />
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

function ConfirmDeleteDialog({
  confirmDialogVisible,
  setConfirmDialogVisible,
  navigation,
  accountId,
}: {
  confirmDialogVisible: boolean;
  setConfirmDialogVisible: (visible: boolean) => void;
  navigation: ScreenProps<"AccountRecords">["navigation"];
  accountId: number;
}) {
  const deleteAccountMutation = useDeleteAccountMutation({
    onSuccess: () => {
      ToastAndroid.show("Account deleted successfully", ToastAndroid.SHORT);
      navigation.navigate("Accounts");
    },
    onError: (error) => {
      console.error(error);
      ToastAndroid.show("An error ocurred, please try again later", ToastAndroid.SHORT);
      setConfirmDialogVisible(false);
    },
  });

  useEffect(() => {
    if (confirmDialogVisible) deleteAccountMutation.reset();
  }, [confirmDialogVisible]);

  return (
    <Dialog visible={confirmDialogVisible}>
      <Dialog.Title>Confirm</Dialog.Title>
      {match(deleteAccountMutation)
        .with({ isIdle: true }, () => (
          <>
            <Dialog.Content>
              <Text>
                Are you sure you want to delete this account? This is a permanent action. All the records associated
                with this account will be deleted as well
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setConfirmDialogVisible(false)}>Cancel</Button>
              <Button icon="delete" textColor="red" onPress={() => deleteAccountMutation.mutate(accountId)}>
                Delete
              </Button>
            </Dialog.Actions>
          </>
        ))
        .with({ isPending: true }, () => (
          <>
            <Dialog.Content>
              <ActivityIndicator size="large" color="#0000ff" />
            </Dialog.Content>
            <Dialog.Actions>
              <Button disabled>Cancel</Button>
              <Button disabled icon="delete" textColor="red">
                Delete
              </Button>
            </Dialog.Actions>
          </>
        ))
        .otherwise(() => (
          <>
            <Dialog.Content>
              <Text>An error ocurred, please try again later</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setConfirmDialogVisible(false)}>Go Back</Button>
            </Dialog.Actions>
          </>
        ))}
    </Dialog>
  );
}
