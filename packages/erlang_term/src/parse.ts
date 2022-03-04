import {
  Parse_result,
  Parse_result_collection,
  Parse_result_list
} from "./type";

class Erlang_parse_context {
  buf   : Buffer
  offset: number = 0
  constructor(buf: Buffer) {
    this.buf = buf;
  }
  
  head_check() {
    if (this.buf[this.offset] !== 131) {
      throw new Error(`bad erlang tag != 131 offset=${this.offset}`);
    }
    this.offset++
  }
  
  // TODO better typing over this
  parse():Parse_result {
    const buf = this.buf;
    
    const type = buf[this.offset++];
    // https://erlang.org/doc/apps/erts/erl_ext_dist.html
    switch(type) {
      case 70:
        // NEW_FLOAT_EXT
        {
          const value = buf.readDoubleBE(this.offset);
          this.offset += 8;
          return {
            type : "NEW_FLOAT_EXT",
            value
          }
        }
      // 77 BIT_BINARY_EXT TODO
      // 82 ATOM_CACHE_REF
      // 88 NEW_PID_EXT
      // 89 NEW_PORT_EXT
      // 90 NEWER_REFERENCE_EXT
      case 97:
        // SMALL_INTEGER_EXT
        {
          const value = buf[this.offset++];
          return {
            type : "SMALL_INTEGER_EXT",
            value
          }
        }
      case 98:
        // INTEGER_EXT
        {
          const value = buf.readInt32BE(this.offset);
          this.offset += 4
          return {
            type : "INTEGER_EXT",
            value
          }
        }
      case 99:
        // FLOAT_EXT
        {
          const value = buf.slice(this.offset, this.offset + 31);
          this.offset += 31;
          return {
            type : "FLOAT_EXT",
            value: parseFloat(value.toString("utf8"))
          }
        }
      // 100 ATOM_EXT (deprecated) == ATOM_UTF8_EXT but latin1
      case 100:
        // ATOM_EXT
        {
          const chunk_len = buf.readUInt16BE(this.offset);
          this.offset += 2;
          const value = buf.slice(this.offset, this.offset + chunk_len).toString("latin1");
          this.offset += chunk_len;
          
          return {
            type : "ATOM_EXT",
            value
          }
        }
      // 101 REFERENCE_EXT (deprecated)
      // 102 PORT_EXT
      // 103 PID_EXT
      
      case 104:
        // SMALL_TUPLE_EXT
        {
          const arity = buf[this.offset++]
          const value = [];
          for(let i=0;i<arity;i++) {
            value.push(this.parse());
          }
          
          return {
            type : "SMALL_TUPLE_EXT",
            value
          } as Parse_result_collection
        }
      
      case 105:
        // LARGE_TUPLE_EXT
        {
          const arity = buf.readUInt32BE(this.offset);
          this.offset += 4
          const value = [];
          for(let i=0;i<arity;i++) {
            value.push(this.parse());
          }
          
          return {
            type : "LARGE_TUPLE_EXT",
            value
          } as Parse_result_collection
        }
      
      case 106:
        // NIL_EXT
        return {
          type : "NIL_EXT",
          value: null
        }
      
      case 107:
        // STRING_EXT
        {
          const chunk_len = buf.readUInt16BE(this.offset);
          this.offset += 2
          const value = buf.slice(this.offset, this.offset + chunk_len);
          this.offset += chunk_len;
          
          return {
            type : "STRING_EXT",
            value
          }
        }
      
      case 108:
        // LIST_EXT
        {
          const arity = buf.readUInt32BE(this.offset);
          this.offset += 4
          
          const value = []
          for(let i=0;i<arity;i++) {
            value.push(this.parse())
          }
          // TAIL
          const tail = this.parse();
          
          return {
            type : "LIST_EXT",
            value,
            tail
          } as Parse_result_list
        }
      
      case 109:
        // BINARY_EXT
        {
          const chunk_len = buf.readUInt32BE(this.offset);
          this.offset += 4
          const value = buf.slice(this.offset, this.offset + chunk_len);
          this.offset += chunk_len;
          return {
            type : "BINARY_EXT",
            value
          }
        }
      
      case 110:
        {
          const chunk_len = buf[this.offset++]
          const sign      = buf[this.offset++]
          const value_orig= buf.slice(this.offset, this.offset + chunk_len);
          this.offset += chunk_len
          
          let value = BigInt("0x"+value_orig.toString("hex"))
          if (sign) {
            value = -value
          }
          return {
            type : "SMALL_BIG_EXT",
            value,
            sign
          }
        }
      case 111:
        {
          const chunk_len = buf.readUInt32BE(this.offset);
          this.offset += 4
          const sign      = buf[this.offset++]
          const value_orig= buf.slice(this.offset, this.offset + chunk_len);
          this.offset += chunk_len
          
          let value = BigInt("0x"+value_orig.toString("hex"))
          if (sign) {
            value = -value
          }
          return {
            type : "LARGE_BIG_EXT",
            value,
            sign
          }
        }
      // 112 NEW_FUN_EXT
      // 113 EXPORT_EXT
      // 114 NEW_REFERENCE_EXT
      // 115 SMALL_ATOM_EXT (deprecated)
      
      case 116:
        // MAP_EXT
        {
          const arity = 2*buf.readUInt32BE(this.offset);
          this.offset += 4;
          
          const value = []
          
          for(let i=0;i<arity;i++) {
            value.push(this.parse())
          }
          return {
            type : "MAP_EXT",
            value
          } as Parse_result_collection
        }
      // 117 FUN_EXT
      case 118:
        // ATOM_UTF8_EXT
        {
          const chunk_len = buf.readUInt16BE(this.offset);
          this.offset += 2;
          const value = buf.slice(this.offset, this.offset + chunk_len).toString("utf8");
          this.offset += chunk_len;
          
          return {
            type : "ATOM_UTF8_EXT",
            value
          }
        }
      
      case 119:
        // SMALL_ATOM_UTF8_EXT
        {
          const chunk_len = buf[this.offset++];
          const value = buf.slice(this.offset, this.offset + chunk_len).toString("utf8");
          this.offset += chunk_len;
          
          return {
            type : "SMALL_ATOM_UTF8_EXT",
            value
          }
        }
      // 120 V4_PORT_EXT
      
      default:
        throw new Error(`unkonwn erlang type ${type} offset=${this.offset-1}`)
    }
  }
  
  tail_check() {
    if (this.offset < this.buf.length) {
      throw new Error(`not parsed fully ${this.offset} != ${this.buf.length}`)
    }
    if (this.offset > this.buf.length) {
      throw new Error(`offset overflow ${this.offset} != ${this.buf.length}`)
    }
  }
}

export function parse(buf: Buffer):Parse_result {
  const ctx = new Erlang_parse_context(buf);
  
  ctx.head_check()
  const ret = ctx.parse()
  ctx.tail_check()
  
  return ret;
}
