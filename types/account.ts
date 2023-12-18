import { Decoder, number, object, string } from "decoders";

export interface Account {
  id: number;
  name: string;
  balance: number;
}

export const accountDecoder: Decoder<Account> = object({
  id: number,
  name: string,
  balance: number,
});
