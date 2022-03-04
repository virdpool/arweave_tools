import {
  Parse_result,
  Parse_result_nil,
  Parse_result_list,
  Parse_result_collection,
  Parse_result_number,
  Parse_result_string,
  Parse_result_bigint,
  Parse_result_buffer
} from "./type";

// TODO ES2020
const zero = BigInt(0);

/* istanbul ignore next */
function fix_float(t:string):string {
  if (!t.includes(".")) {
    const parts = t.split("e");
    parts[0] += ".0";
    t = parts.join("");
  }
  return t;
}

/* istanbul ignore next */
export function serialize_term_debug(t: Parse_result):string {
  const type = t.type;
  switch(type) {
    case "NEW_FLOAT_EXT":
      return fix_float(t.value.toString());
    
    case "SMALL_INTEGER_EXT":
      return t.value.toString();
      
    case "INTEGER_EXT":
      return t.value.toString();
    
    case "FLOAT_EXT":
      return fix_float(t.value.toString());
    
    case "ATOM_EXT":
      return t.value;
    
    // slightly distinguishable (size > 2**8)
    case "ATOM_UTF8_EXT":
      return t.value;
      
    case "SMALL_ATOM_UTF8_EXT":
      return t.value;
      
    case "LIST_EXT":
      {
        const ret_list = [];
        const value = t.value;
        for(let i=0,len=value.length;i<len;i++) {
          ret_list.push(serialize_term_debug(value[i]));
        }
        if (t.tail.type !== "NIL_EXT") {
          ret_list.push(serialize_term_debug(t.tail));
        }
        return "["+ret_list.join(",")+"]";
      }
    
    // slightly distinguishable (size > 2**8)
    case "SMALL_TUPLE_EXT":
      {
        const ret_list = [];
        const value = t.value;
        for(let i=0,len=value.length;i<len;i++) {
          ret_list.push(serialize_term_debug(value[i]));
        }
        return "{"+ret_list.join(",")+"}";
      }
    
    case "LARGE_TUPLE_EXT":
      {
        const ret_list = [];
        const value = t.value;
        for(let i=0,len=value.length;i<len;i++) {
          ret_list.push(serialize_term_debug(value[i]));
        }
        return "{"+ret_list.join(",")+"}";
      }
    
    case "MAP_EXT":
      {
        const ret_list = [];
        const value = t.value;
        for(let i=0,len=value.length;i<len;) {
          const key = serialize_term_debug(value[i++]);
          const val = serialize_term_debug(value[i++]);
          ret_list.push(`${key} => ${val}`);
        }
        return "#{"+ret_list.join(",")+"}";
      }
    
    case "NIL_EXT":
      return "[]";
    
    // slightly distinguishable (size > 2**8)
    case "SMALL_BIG_EXT":
      return t.value.toString();
    
    case "LARGE_BIG_EXT":
      return t.value.toString();
    
    case "BINARY_EXT":
      {
        const ret_list = [];
        let value = t.value;
        for(let i=0,len=value.length;i<len;i++) {
          ret_list.push(value[i]);
        }
        return "<<"+ret_list.join(",")+">>";
      }
    
    case "STRING_EXT":
      {
        return JSON.stringify(t.value.toString("utf8"));
      }
    
    default:
      throw new Error(`unexpected type ${type}`);
  }
}

