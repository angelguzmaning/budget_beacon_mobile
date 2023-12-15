import { SERVER_URL } from "@env";
import axios from "axios";
import { Account, accountDecoder } from "../../types/account";
import { array } from "decoders";
import { UseMutationOptions, useMutation, useQuery } from "@tanstack/react-query";

export function useAccounts() {
  return useQuery({ queryKey: ["accounts"], queryFn: getAccounts });
}

async function getAccounts(): Promise<Account[]> {
  const response = await axios.get(`${SERVER_URL}/accounts/`);

  return array(accountDecoder).verify(response.data);
}

export function useNewAccountMutation(options?: UseMutationOptions<Account, Error, string>) {
  return useMutation({
    mutationFn: (name: string) => createAccount(name),
    ...options,
  });
}

async function createAccount(accountName: string) {
  const response = await axios.post(`${SERVER_URL}/accounts/`, { accountName });

  return accountDecoder.verify(response.data);
}
