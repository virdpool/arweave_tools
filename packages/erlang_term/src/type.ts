export type Parse_result_number = {
  type : "NEW_FLOAT_EXT" | "SMALL_INTEGER_EXT" | "INTEGER_EXT" | "FLOAT_EXT",
  value: number
}
export type Parse_result_string = {
  type : "ATOM_EXT" | "ATOM_UTF8_EXT" | "SMALL_ATOM_UTF8_EXT",
  value: string
}
export type Parse_result_list = {
  type : "LIST_EXT",
  value: Parse_result[],
  tail : Parse_result
}
export type Parse_result_collection = {
  type : "SMALL_TUPLE_EXT" | "LARGE_TUPLE_EXT" | "MAP_EXT",
  value: Parse_result[]
}
export type Parse_result_nil = {
  type : "NIL_EXT",
  value: null
}
export type Parse_result_bigint = {
  type : "SMALL_BIG_EXT" | "LARGE_BIG_EXT",
  value: bigint,
  sign : number,
}
export type Parse_result_buffer = {
  type : "BINARY_EXT" | "STRING_EXT",
  value: Buffer
}

export type Parse_result =
  Parse_result_nil |
  Parse_result_list |
  Parse_result_collection |
  Parse_result_number |
  Parse_result_string |
  Parse_result_bigint |
  Parse_result_buffer;