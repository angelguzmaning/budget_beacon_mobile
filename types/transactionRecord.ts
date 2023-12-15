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
