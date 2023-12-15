import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Account } from "./account";

export type RootStackParamList = {
  NewAccount: undefined;
  Accounts: undefined;
  AccountRecords: { account: Account };
  NewRecord: { account: Account };
};

export type ScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;
