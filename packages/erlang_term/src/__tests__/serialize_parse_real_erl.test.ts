import { parse, serialize_term, serialize_term_get_size } from "..";
import { serialize_term_debug } from "../serialize_term_debug";
import { Parse_result } from "../type";
import shell_escape from "shell-escape";
import { execSync } from "child_process";

// erl serialize, our parse
function serialize_test(value: Parse_result) {
  const expd_buf = serialize_term(value);
  
  const ret = serialize_term_debug(value);
  const erlang_code = `io:format("~p",[erlang:term_to_binary(${ret})])`;
  const cmd = `erl -noshell -eval ${shell_escape([erlang_code])} -run init stop`;
  let str = execSync(cmd).toString();
  str = str.replace("<<", "");
  str = str.replace(">>", "");
  
  const real_buf = Buffer.from(str.split(",").map((t)=>+t));
  if (!real_buf.equals(expd_buf)) {
    // TODO right pad
    console.log("cmd", cmd);
    console.log("real_buf", Array.from(real_buf).map(t=>t.toString().padEnd(3)).join(" "));
    console.log("expd_buf", Array.from(expd_buf).map(t=>t.toString().padEnd(3)).join(" "));
    expect(real_buf).toEqual(expd_buf);
  }
  
  var real_value = parse(expd_buf);
  expect(real_value).toMatchObject(value);
}

if (process.env.ERL) {
  describe("serialize parse real erlang", () => {
    // speed up develop
    it("NEW_FLOAT_EXT", () => {
      const value = {
        type  : "NEW_FLOAT_EXT",
        value : 10.5
      } as Parse_result
      serialize_test(value)
    });
    // // TODO 77 BIT_BINARY_EXT
    it("SMALL_INTEGER_EXT", () => {
      const value = {
        type  : "SMALL_INTEGER_EXT",
        value : 10
      } as Parse_result
      serialize_test(value)
    });
    it("INTEGER_EXT", () => {
      const value = {
        type  : "INTEGER_EXT",
        value : 0xFFFFFF
      } as Parse_result
      serialize_test(value)
    });
    // serialize will make NEW_FLOAT_EXT
    // it("FLOAT_EXT", () => {
    //   const value = {
    //     type  : "FLOAT_EXT",
    //     value : 10.5
    //   } as Parse_result
    //   serialize_test(value)
    // });
    it("SMALL_TUPLE_EXT 0", () => {
      const value = {
        type  : "SMALL_TUPLE_EXT",
        value : [] as Parse_result[]
      } as Parse_result
      serialize_test(value)
    });
    it("SMALL_TUPLE_EXT 1", () => {
      const value = {
        type  : "SMALL_TUPLE_EXT",
        value : [
          {
            type : "SMALL_INTEGER_EXT",
            value: 10
          } as Parse_result
        ]
      } as Parse_result
      serialize_test(value)
    });
    it("SMALL_TUPLE_EXT 2", () => {
      const value = {
        type  : "SMALL_TUPLE_EXT",
        value : [
          {
            type : "SMALL_INTEGER_EXT",
            value: 10
          } as Parse_result,
          {
            type : "SMALL_INTEGER_EXT",
            value: 20
          } as Parse_result
        ]
      } as Parse_result
      serialize_test(value)
    });
    // LARGE_TUPLE_EXT 0 Can't be represented -> SMALL_TUPLE_EXT
    it("LARGE_TUPLE_EXT 256", () => {
      const value_list : Parse_result[] = []
      for(let i=0;i<256;i++) {
        value_list.push({
          type : "SMALL_INTEGER_EXT",
          value: 10
        });
      }
      const value = {
        type  : "LARGE_TUPLE_EXT",
        value : value_list
      } as Parse_result
      serialize_test(value)
    });
    it("NIL_EXT", () => {
      const value = {
        type  : "NIL_EXT",
        value : null
      } as Parse_result
      serialize_test(value)
    });
    it("STRING_EXT", () => {
      const value = {
        type  : "STRING_EXT",
        value : Buffer.from("0123")
      } as Parse_result
      serialize_test(value)
    });
    // // LIST_EXT 0 Can't be represented -> NIL_EXT
    it("LIST_EXT 1", () => {
      const value = {
        type  : "LIST_EXT",
        value : [
          {
            type : "STRING_EXT",
            value: Buffer.from("123")
          } as Parse_result
        ],
        tail  : {
          type : "NIL_EXT"
        } as Parse_result,
      } as Parse_result
      serialize_test(value)
    });
    it("LIST_EXT 2", () => {
      const value = {
        type  : "LIST_EXT",
        value : [
          {
            type : "STRING_EXT",
            value: Buffer.from("123")
          } as Parse_result,
          {
            type : "STRING_EXT",
            value: Buffer.from("456")
          } as Parse_result
        ],
        tail  : {
          type : "NIL_EXT"
        } as Parse_result,
      } as Parse_result
      serialize_test(value)
    });
    it("BINARY_EXT", () => {
      const value = {
        type  : "BINARY_EXT",
        value : Buffer.from([0, 1, 2, 3])
      } as Parse_result
      serialize_test(value)
    });
    it("SMALL_BIG_EXT", () => {
      const value = {
        type  : "SMALL_BIG_EXT",
        value : BigInt("0xFFFFFFFFFFFF"),
        sign  : 0
      } as Parse_result
      serialize_test(value)
    });
    it("SMALL_BIG_EXT negative", () => {
      const value = {
        type  : "SMALL_BIG_EXT",
        value : -BigInt("0xFFFFFFFFFFFF"),
        sign  : 1
      } as Parse_result
      serialize_test(value)
    });
    it("LARGE_BIG_EXT", () => {
      const value = {
        type  : "LARGE_BIG_EXT",
        value : BigInt("0x".padEnd(2+2*256,"F")),
        sign  : 0
      } as Parse_result
      serialize_test(value)
    });
    it("LARGE_BIG_EXT negative", () => {
      const value = {
        type  : "LARGE_BIG_EXT",
        value : -BigInt("0x".padEnd(2+2*256,"F")),
        sign  : 1
      } as Parse_result
      serialize_test(value)
    });
    it("MAP_EXT 0", () => {
      const value = {
        type  : "MAP_EXT",
        value : [] as Parse_result[]
      } as Parse_result
      serialize_test(value)
    });
    it("MAP_EXT 1", () => {
      const value = {
        type  : "MAP_EXT",
        value : [
          {
            type : "SMALL_INTEGER_EXT",
            value: 0
          } as Parse_result,
          {
            type : "SMALL_INTEGER_EXT",
            value: 1
          } as Parse_result,
        ]
      } as Parse_result
      serialize_test(value)
    });
    it("MAP_EXT 2", () => {
      const value = {
        type  : "MAP_EXT",
        value : [
          {
            type : "SMALL_INTEGER_EXT",
            value: 0
          } as Parse_result,
          {
            type : "SMALL_INTEGER_EXT",
            value: 1
          } as Parse_result,
          {
            type : "SMALL_INTEGER_EXT",
            value: 2
          } as Parse_result,
          {
            type : "SMALL_INTEGER_EXT",
            value: 3
          } as Parse_result,
        ]
      } as Parse_result
      serialize_test(value)
    });
    
    // untestable
    // it("ATOM_UTF8_EXT", () => {
      // const value = {
        // type  : "ATOM_UTF8_EXT",
        // value : "hello"
      // } as Parse_result
      // serialize_test(value)
    // });
    // it("SMALL_ATOM_UTF8_EXT", () => {
      // const value = {
        // type  : "SMALL_ATOM_UTF8_EXT",
        // value : "hello"
      // } as Parse_result
      // serialize_test(value)
    // });
    it("ATOM_EXT", () => {
      const value = {
        type  : "ATOM_EXT",
        value : "hello"
      } as Parse_result
      serialize_test(value)
    });
  });
  
  // describe("bad serialize", () => {
    // it("bad map", () => {
    //   const value = {
    //     type  : "MAP_EXT",
    //     value : [
    //       {
    //         type : "SMALL_INTEGER_EXT",
    //         value: 0
    //       } as Parse_result
    //     ]
    //   } as Parse_result
    //   
    //   expect(()=>serialize_term(value)).toThrow("malformed map t.value.length=1 should be divisible by 2");
    // });
    // it("bad type (bypass with any)", () => {
    //   const value = {
    //     type  : "WTF",
    //     value : null
    //   } as any;
    //   expect(()=>serialize_term(value)).toThrow("unexpected type WTF");
    //   expect(()=>serialize_term_get_size(value)).toThrow("unexpected type WTF");
    // });
  // });
} else {
  describe("serialize parse real erlang", () => {
    it("noop", ()=>{});
  });
}