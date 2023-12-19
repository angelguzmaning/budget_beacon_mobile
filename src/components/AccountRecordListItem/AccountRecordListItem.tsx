import { ToastAndroid, View } from "react-native";
import { TransactionRecord } from "../../../types/transactionRecord";
import { ActivityIndicator, Button, Dialog, IconButton, Portal, Text } from "react-native-paper";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useDeleteRecordMutation } from "../../services/recordService";
import { match } from "ts-pattern";

export function AccountRecordListItem({ record }: { record: TransactionRecord }) {
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);

  return (
    <>
      <View
        style={{ flexDirection: "row", justifyContent: "space-between", padding: 12, alignItems: "center", gap: 8 }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", flex: 1 }}>
          <Text>{record.description}</Text>
          <Text>{record.amount}</Text>
          <Text>{format(record.date, "yyyy/MM/dd")}</Text>
        </View>
        <IconButton icon="delete" iconColor="red" onPress={() => setConfirmDialogVisible(true)} />
      </View>
      <Portal>
        <ConfirmDeleteDialog
          confirmDialogVisible={confirmDialogVisible}
          setConfirmDialogVisible={setConfirmDialogVisible}
          recordId={record.id}
        />
      </Portal>
    </>
  );
}

function ConfirmDeleteDialog({
  confirmDialogVisible,
  setConfirmDialogVisible,
  recordId,
}: {
  confirmDialogVisible: boolean;
  setConfirmDialogVisible: (visible: boolean) => void;
  recordId: number;
}) {
  const deleteRecordMutation = useDeleteRecordMutation({
    onSuccess: () => {
      ToastAndroid.show("Record deleted successfully", ToastAndroid.SHORT);
      setConfirmDialogVisible(false);
    },
    onError: (error) => {
      console.error(error);
      ToastAndroid.show("An error ocurred, please try again later", ToastAndroid.SHORT);
      setConfirmDialogVisible(false);
    },
  });

  useEffect(() => {
    if (confirmDialogVisible) deleteRecordMutation.reset();
  }, [confirmDialogVisible]);

  return (
    <Dialog visible={confirmDialogVisible}>
      <Dialog.Title>Confirm</Dialog.Title>
      {match(deleteRecordMutation)
        .with({ isIdle: true }, () => (
          <>
            <Dialog.Content>
              <Text>Are you sure you want to delete this record? This is a permanent action.</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setConfirmDialogVisible(false)}>Cancel</Button>
              <Button icon="delete" textColor="red" onPress={() => deleteRecordMutation.mutate(recordId)}>
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
