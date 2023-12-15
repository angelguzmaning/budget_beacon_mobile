import { parse } from "date-fns";
import { Decoder, string } from "decoders";

export const dateDecoder: Decoder<Date> = string.transform((s) => parse(s, "yyyy-MM-dd", new Date()));
