import { Decoder, number, object, string } from "decoders";
import { dateDecoder } from "./date";

export interface TransactionRecord {
  id: number;
  date: Date;
  description: string;
  amount: number;
  accountId: number;
}

export const recordDecoder: Decoder<TransactionRecord> = object({
  id: number,
  date: dateDecoder,
  description: string,
  amount: number,
  accountId: number,
});

export function partitionByDateOrdered(records: TransactionRecord[]) {
  const partitionedByDate = records.reduce(
    (acc, record) => {
      const dateKey = record.date.toISOString().split("T")[0];
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(record);
      return acc;
    },
    {} as Record<string, TransactionRecord[]>,
  );

  return Object.fromEntries(
    Object.entries(partitionedByDate).sort((a, b) => {
      return new Date(b[0]).getTime() - new Date(a[0]).getTime();
    }),
  );
}
