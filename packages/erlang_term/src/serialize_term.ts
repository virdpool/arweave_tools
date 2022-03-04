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
import { sprintf } from "sprintf-js"

// TODO ES2020
const zero = BigInt(0);
const n8 = BigInt(8);
const nFF = BigInt(0xFF);

export function serialize_term_get_size(t: Parse_result):number {
  const type = t.type;
  switch(type) {
    case "NEW_FLOAT_EXT":     return 1+8;
    case "SMALL_INTEGER_EXT": return 1+1;
    case "INTEGER_EXT":       return 1+4;
    case "FLOAT_EXT":         return 1+31;
    case "ATOM_EXT":            return 1+2+Buffer.byteLength(t.value, "utf8");
    case "ATOM_UTF8_EXT":       return 1+2+Buffer.byteLength(t.value, "utf8");
    case "SMALL_ATOM_UTF8_EXT": return 1+1+Buffer.byteLength(t.value, "utf8");
    case "LIST_EXT":
      {
        let ret = 1+4;
        let value = t.value;
        for(let i=0,len=value.length;i<len;i++) {
          ret += serialize_term_get_size(value[i]);
        }
        ret += serialize_term_get_size(t.tail);
        return ret;
      }
    case "SMALL_TUPLE_EXT":
      {
        let ret = 1+1;
        let value = t.value;
        for(let i=0,len=value.length;i<len;i++) {
          ret += serialize_term_get_size(value[i]);
        }
        return ret;
      }
    case "LARGE_TUPLE_EXT":
      {
        let ret = 1+4;
        let value = t.value;
        for(let i=0,len=value.length;i<len;i++) {
          ret += serialize_term_get_size(value[i]);
        }
        return ret;
      }
    case "MAP_EXT":
      {
        let ret = 1+4;
        let value = t.value;
        for(let i=0,len=value.length;i<len;i++) {
          ret += serialize_term_get_size(value[i]);
        }
        return ret;
      }
    case "NIL_EXT":       return 1;
    
    case "SMALL_BIG_EXT":
      {
        let byte_size = 1;
        let value = t.value;
        if (value < zero) {
          value = -value;
        }
        value >>= n8;
        while(value > zero) {
          value >>= n8;
          byte_size++;
        }
        return 1+1+1+byte_size;
      }
    case "LARGE_BIG_EXT":
      {
        let byte_size = 1;
        let value = t.value;
        if (value < zero) {
          value = -value;
        }
        value >>= n8;
        while(value > zero) {
          value >>= n8;
          byte_size++;
        }
        return 1+4+1+byte_size;
      }
    case "BINARY_EXT":    return 1+4+t.value.length;
    case "STRING_EXT":    return 1+2+t.value.length;
    
    default:
      throw new Error(`unexpected type ${type}`);
  }
}

export function _serialize_term(t: Parse_result, buf: Buffer, offset: number):number {
  const type = t.type;
  switch(type) {
    case "NEW_FLOAT_EXT":
      buf[offset++] = 70;
      buf.writeDoubleBE(t.value, offset);
      offset += 8;
      return offset;
    
    case "SMALL_INTEGER_EXT":
      buf[offset++] = 97;
      buf[offset++] = t.value;
      return offset;
      
    case "INTEGER_EXT":
      buf[offset++] = 98;
      buf.writeInt32BE(t.value, offset);
      offset += 4;
      return offset;
    
    case "FLOAT_EXT":
      buf[offset++] = 99;
      {
        const tmp = Buffer.from(sprintf("%.20e", t.value).padEnd(31))
        tmp.copy(buf, offset);
        offset += 31
      }
      return offset;
    
    case "ATOM_EXT":
      buf[offset++] = 100;
      // TODO investigate utf8 encode directly to buffer offset
      {
        const tmp = Buffer.from(t.value, "latin1");
        buf.writeUInt16BE(tmp.length, offset);
        offset += 2;
        tmp.copy(buf, offset);
        offset += tmp.length;
      }
      return offset;
    
    case "ATOM_UTF8_EXT":
      buf[offset++] = 118;
      // TODO investigate utf8 encode directly to buffer offset
      {
        const tmp = Buffer.from(t.value, "utf8");
        buf.writeUInt16BE(tmp.length, offset);
        offset += 2;
        tmp.copy(buf, offset);
        offset += tmp.length;
      }
      return offset;
      
    case "SMALL_ATOM_UTF8_EXT":
      buf[offset++] = 119;
      // TODO investigate utf8 encode directly to buffer offset
      {
        const tmp = Buffer.from(t.value, "utf8");
        buf[offset++] = tmp.length;
        tmp.copy(buf, offset);
        offset += tmp.length;
      }
      return offset;
      
    case "LIST_EXT":
      buf[offset++] = 108;
      {
        let value = t.value;
        buf.writeUInt32BE(value.length, offset);
        offset += 4
        for(let i=0,len=value.length;i<len;i++) {
          offset = _serialize_term(value[i], buf, offset);
        }
        offset = _serialize_term(t.tail, buf, offset);
      }
      return offset;
      
    case "SMALL_TUPLE_EXT":
      buf[offset++] = 104;
      {
        let value = t.value;
        buf[offset++] = value.length;
        for(let i=0,len=value.length;i<len;i++) {
          offset = _serialize_term(value[i], buf, offset);
        }
      }
      return offset;
    
    case "LARGE_TUPLE_EXT":
      buf[offset++] = 105;
      {
        let value = t.value;
        buf.writeUInt32BE(value.length, offset);
        offset += 4
        for(let i=0,len=value.length;i<len;i++) {
          offset = _serialize_term(value[i], buf, offset);
        }
      }
      return offset;
    
    case "MAP_EXT":
      buf[offset++] = 116;
      {
        let value = t.value;
        if (value.length % 2 === 1) {
          throw new Error(`malformed map t.value.length=${value.length} should be divisible by 2`)
        }
        
        buf.writeUInt32BE(value.length/2, offset);
        offset += 4
        for(let i=0,len=value.length;i<len;i++) {
          offset = _serialize_term(value[i], buf, offset);
        }
      }
      return offset;
    
    case "NIL_EXT":
      buf[offset++] = 106;
      return offset;
    
    case "SMALL_BIG_EXT":
      buf[offset++] = 110;
      {
        const byte_list = [];
        let value = t.value;
        let sign = 0;
        if (value < zero) {
          value = -value;
          sign = 1;
        }
        let write_value = value;
        while(true) {
          byte_list.push(+(value & nFF).toString())
          value >>= n8;
          if (value <= zero) break;
        }
        const byte_size = byte_list.length;
        buf[offset++] = byte_size;
        buf[offset++] = sign;
        byte_list.reverse();
        for(var i=0;i<byte_size;i++) {
          buf[offset++] = byte_list[i];
        }
      }
      return offset;
    
    case "LARGE_BIG_EXT":
      buf[offset++] = 111;
      {
        const byte_list = [];
        let value = t.value;
        let sign = 0;
        if (value < zero) {
          value = -value;
          sign = 1;
        }
        let write_value = value;
        while(true) {
          byte_list.push(+(value & nFF).toString())
          value >>= n8;
          if (value <= zero) break;
        }
        const byte_size = byte_list.length;
        buf.writeUInt32BE(byte_size, offset);
        offset += 4
        buf[offset++] = sign;
        byte_list.reverse();
        for(var i=0;i<byte_size;i++) {
          buf[offset++] = byte_list[i];
        }
      }
      return offset;
    
    case "BINARY_EXT":
      buf[offset++] = 109;
      {
        let value = t.value;
        buf.writeUInt32BE(value.length, offset);
        offset += 4
        value.copy(buf, offset);
        offset += value.length;
      }
      return offset;
    
    case "STRING_EXT":
      buf[offset++] = 107;
      {
        let value = t.value;
        buf.writeUInt16BE(value.length, offset);
        offset += 2
        value.copy(buf, offset);
        offset += value.length;
      }
      return offset;
    
    /* istanbul ignore next */
    default:
      throw new Error(`unexpected type ${type}`);
  }
}

export function serialize_term(t: Parse_result):Buffer {
  const size = serialize_term_get_size(t)
  const buf = Buffer.alloc(size+1);
  buf[0] = 131;
  const offset = _serialize_term(t, buf, 1);
  /* istanbul ignore next */
  if (offset !== buf.length) {
    throw new Error(`consistency check failed: offset !== buf.length; ${offset} !== ${buf.length}`)
  }
  return buf;
}
