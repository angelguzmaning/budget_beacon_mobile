import { SERVER_URL } from "@env";
import { UseMutationOptions, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { recordDecoder, TransactionRecord } from "../../types/transactionRecord";
import { array } from "decoders";
import { NewItem } from "../../types/db";
import { format } from "date-fns";

export function useRecordsByAccount(accountId: number) {
  return useQuery({
    queryKey: ["records", accountId],
    queryFn: () => getRecordsByAccount(accountId),
  });
}

async function getRecordsByAccount(accountId: number) {
  const response = await axios.get(`${SERVER_URL}/accounts/${accountId}/records/`);

  return array(recordDecoder).verify(response.data);
}

export function useNewRecordMutation(
  options?: UseMutationOptions<TransactionRecord, Error, NewItem<TransactionRecord>>,
) {
  return useMutation({
    mutationFn: (record: NewItem<TransactionRecord>) => createRecord(record),
    ...options,
  });
}

async function createRecord(record: NewItem<TransactionRecord>) {
  console.log({ ...record, date: format(record.date, "yyyy-MM-dd") });
  const response = await axios.post(`${SERVER_URL}/records/`, { ...record, date: format(record.date, "yyyy-MM-dd") });

  return recordDecoder.verify(response.data);
}
