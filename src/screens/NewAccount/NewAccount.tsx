import { Formik } from "formik";
import { ToastAndroid, View } from "react-native";
import { ActivityIndicator, Button, TextInput, Text } from "react-native-paper";
import { ScreenProps } from "../../../types/navigation";
import { useNewAccountMutation } from "../../services/accountService";

export function NewAccountScreen({ navigation }: ScreenProps) {
  const createAccountMutation = useNewAccountMutation({
    onSuccess: () => {
      ToastAndroid.show("Account created successfully", ToastAndroid.SHORT);
      navigation.navigate("Accounts");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <Formik
      initialValues={{ name: "" }}
      onSubmit={(values) => {
        console.log("mutating", values);
        createAccountMutation.mutate(values.name);
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <View style={{ padding: 24, gap: 12 }}>
          <TextInput
            label="Name"
            onChangeText={handleChange("name")}
            onBlur={handleBlur("name")}
            value={values.name}
            editable={!createAccountMutation.isPending}
          />
          <Button onPress={() => handleSubmit()} disabled={createAccountMutation.isPending}>
            Submit
          </Button>

          {createAccountMutation.isError && (
            <Text style={{ color: "red" }}>An error occurred, please try again later</Text>
          )}
          <ActivityIndicator animating={createAccountMutation.isPending} />
        </View>
      )}
    </Formik>
  );
}
