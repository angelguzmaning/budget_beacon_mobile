import { ToastAndroid, View } from "react-native";
import { ScreenProps } from "../../../types/navigation";
import { useNewRecordMutation } from "../../services/recordService";
import { useFormik } from "formik";
import { Button, TextInput, Text, ActivityIndicator } from "react-native-paper";
import { DatePickerInput } from "react-native-paper-dates";
import DropDown from "react-native-paper-dropdown";

export function NewRecordScreen({
  navigation,
  route: {
    params: { account },
  },
}: ScreenProps<"NewRecord">) {
  const createRecordMutation = useNewRecordMutation({
    onSuccess: () => {
      ToastAndroid.show("Record created successfully", ToastAndroid.SHORT);
      navigation.navigate("AccountRecords", { account });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const formik = useFormik({
    initialValues: { description: "", amount: 0, date: new Date(), accountId: account.id },
    onSubmit: (values) => createRecordMutation.mutate(values),
  });

  const { handleChange, handleBlur, handleSubmit, setFieldValue, values } = formik;

  return (
    <View style={{ padding: 24, gap: 12 }}>
      <TextInput
        label="Amount"
        onChangeText={(value) => setFieldValue("amount", parseFloat(value))}
        onBlur={handleBlur("amount")}
        value={values.amount.toString()}
        editable={!createRecordMutation.isPending}
        keyboardType="numeric"
      />
      <View style={{ paddingTop: 24, paddingBottom: 24 }}>
        <DatePickerInput
          locale="en-GB"
          label="Date"
          value={values.date}
          onChange={(d) => setFieldValue("date", d)}
          inputMode="start"
        />
      </View>
      <TextInput
        label="Description"
        onChangeText={handleChange("description")}
        onBlur={handleBlur("description")}
        value={values.description}
        editable={!createRecordMutation.isPending}
      />
      <DropDown
        label={"Account"}
        visible={false}
        showDropDown={() => {}}
        onDismiss={() => {}}
        value={3}
        setValue={(value) => setFieldValue("accountId", value)}
        list={[{ value: account.id, label: "Account Name" }]}
      />
      <Button onPress={() => handleSubmit()} disabled={createRecordMutation.isPending}>
        Submit
      </Button>

      {createRecordMutation.isError && <Text style={{ color: "red" }}>An error occurred, please try again later</Text>}
      <ActivityIndicator animating={createRecordMutation.isPending} />
    </View>
  );
}
