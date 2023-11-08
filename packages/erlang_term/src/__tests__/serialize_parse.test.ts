import { parse, serialize_term, serialize_term_get_size } from "..";
import { Parse_result } from "../type";

describe("serialize", () => {
  it("NEW_FLOAT_EXT", () => {
    const value = {
      type  : "NEW_FLOAT_EXT",
      value : 10.5
    } as Parse_result
    const ret = parse(serialize_term(value));
    
    expect(ret).toMatchObject(value);
  });
  // TODO 77 BIT_BINARY_EXT
  it("SMALL_INTEGER_EXT", () => {
    const value = {
      type  : "SMALL_INTEGER_EXT",
      value : 10
    } as Parse_result
    const ret = parse(serialize_term(value));
    
    expect(ret).toMatchObject(value);
  });
  it("INTEGER_EXT", () => {
    const value = {
      type  : "INTEGER_EXT",
      value : 0xAABBFF
    } as Parse_result
    const ret = parse(serialize_term(value));
  });
  it("FLOAT_EXT", () => {
    const value = {
      type  : "FLOAT_EXT",
      value : 10.5
    } as Parse_result
    const ret = parse(serialize_term(value));
    
    expect(ret).toMatchObject(value);
  });
  it("SMALL_TUPLE_EXT 0", () => {
    const value = {
      type  : "SMALL_TUPLE_EXT",
      value : [] as Parse_result[]
    } as Parse_result
    const ret = parse(serialize_term(value));
    
    expect(ret).toMatchObject(value);
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
    const ret = parse(serialize_term(value));
    
    expect(ret).toMatchObject(value);
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
    const ret = parse(serialize_term(value));
    
    expect(ret).toMatchObject(value);
  });
  it("LARGE_TUPLE_EXT 0", () => {
    const value = {
      type  : "LARGE_TUPLE_EXT",
      value : []
    } as Parse_result
    const ret = parse(serialize_term(value));
    
    expect(ret).toMatchObject(value);
  });
  it("LARGE_TUPLE_EXT 1", () => {
    const value = {
      type  : "LARGE_TUPLE_EXT",
      value : [
        {
          type : "SMALL_INTEGER_EXT",
          value: 10
        } as Parse_result
      ]
    } as Parse_result
    const ret = parse(serialize_term(value));
    
    expect(ret).toMatchObject(value);
  });
  it("LARGE_TUPLE_EXT 2", () => {
    const value = {
      type  : "LARGE_TUPLE_EXT",
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
    const ret = parse(serialize_term(value));
    
    expect(ret).toMatchObject(value);
  });
  it("NIL_EXT", () => {
    const value = {
      type  : "NIL_EXT",
      value : null
    } as Parse_result
    const ret = parse(serialize_term(value));
    
    expect(ret).toMatchObject(value);
  });
  // TODO 107 STRING_EXT
  it("LIST_EXT 0", () => {
    const value = {
      type  : "LIST_EXT",
      value : [],
      tail  : {
        type  : "NIL_EXT",
        value : null
      } as Parse_result
    } as Parse_result
    const ret = parse(serialize_term(value));
    
    expect(ret).toMatchObject(value);
  });
  it("LIST_EXT 1 tail", () => {
    const value = {
      type  : "LIST_EXT",
      value : [],
      tail  : {
        type : "SMALL_INTEGER_EXT",
        value: 10
      } as Parse_result,
    } as Parse_result
    const ret = parse(serialize_term(value));
    
    expect(ret).toMatchObject(value);
  });
  it("LIST_EXT 1", () => {
    const value = {
      type  : "LIST_EXT",
      value : [
        {
          type : "SMALL_INTEGER_EXT",
          value: 10
        } as Parse_result,
      ],
      tail  : {
        type  : "NIL_EXT",
        value : null
      } as Parse_result
    } as Parse_result
    const ret = parse(serialize_term(value));
    
    expect(ret).toMatchObject(value);
  });
  it("LIST_EXT 2", () => {
    const value = {
      type  : "LIST_EXT",
      value : [
        {
          type : "SMALL_INTEGER_EXT",
          value: 10
        } as Parse_result,
        {
          type : "SMALL_INTEGER_EXT",
          value: 10
        } as Parse_result,
      ],
      tail  : {
        type  : "NIL_EXT",
        value : null
      } as Parse_result
    } as Parse_result
    const ret = parse(serialize_term(value));
    
    expect(ret).toMatchObject(value);
  });
  it("BINARY_EXT", () => {
    const value = {
      type  : "BINARY_EXT",
      value : Buffer.from([0, 1, 2, 3])
    } as Parse_result
    const ret = parse(serialize_term(value));
    
    expect(ret).toMatchObject(value);
  });
  it("SMALL_BIG_EXT", () => {
    const value = {
      type  : "SMALL_BIG_EXT",
      value : BigInt("0xAABBCCDDEEFF"),
      sign  : 0
    } as Parse_result
    const ret = parse(serialize_term(value));
    
    expect(ret).toMatchObject(value);
  });
  it("SMALL_BIG_EXT negative 1", () => {
    const value = {
      type  : "SMALL_BIG_EXT",
      value : -BigInt("0xAABBCCDDEEFF"),
      sign  : 1
    } as Parse_result
    const ret = parse(serialize_term(value));
    
    expect(ret).toMatchObject(value);
  });
  it("SMALL_BIG_EXT negative 2", () => {
    const value = {
      type  : "SMALL_BIG_EXT",
      value : -BigInt("0xAABBCCDDEEFF"),
      sign  : 0
    } as Parse_result
    const ret = parse(serialize_term(value));
    
    const expd_value = {
      type  : "SMALL_BIG_EXT",
      value : -BigInt("0xAABBCCDDEEFF"),
      sign  : 1
    } as Parse_result
    expect(ret).toMatchObject(expd_value);
  });
  it("LARGE_BIG_EXT", () => {
    const value = {
      type  : "LARGE_BIG_EXT",
      value : BigInt("0xAABBCCDDEEFF"),
      sign  : 0
    } as Parse_result
    const ret = parse(serialize_term(value));
    
    expect(ret).toMatchObject(value);
  });
  it("LARGE_BIG_EXT negative 1", () => {
    const value = {
      type  : "LARGE_BIG_EXT",
      value : -BigInt("0xAABBCCDDEEFF"),
      sign  : 1
    } as Parse_result
    const ret = parse(serialize_term(value));
    
    expect(ret).toMatchObject(value);
  });
  it("LARGE_BIG_EXT negative 2", () => {
    const value = {
      type  : "LARGE_BIG_EXT",
      value : -BigInt("0xAABBCCDDEEFF"),
      sign  : 0
    } as Parse_result
    const ret = parse(serialize_term(value));
    const expd_value = {
      type  : "LARGE_BIG_EXT",
      value : -BigInt("0xAABBCCDDEEFF"),
      sign  : 1
    } as Parse_result
    
    expect(ret).toMatchObject(expd_value);
  });
  it("MAP_EXT 0", () => {
    const value = {
      type  : "MAP_EXT",
      value : [] as Parse_result[]
    } as Parse_result
    const ret = parse(serialize_term(value));
    
    expect(ret).toMatchObject(value);
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
    const ret = parse(serialize_term(value));
    
    expect(ret).toMatchObject(value);
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
    const ret = parse(serialize_term(value));
    
    expect(ret).toMatchObject(value);
  });
  it("ATOM_UTF8_EXT", () => {
    const value = {
      type  : "ATOM_UTF8_EXT",
      value : "hello"
    } as Parse_result
    const ret = parse(serialize_term(value));
    
    expect(ret).toMatchObject(value);
  });
  it("SMALL_ATOM_UTF8_EXT", () => {
    const value = {
      type  : "SMALL_ATOM_UTF8_EXT",
      value : "hello"
    } as Parse_result
    const ret = parse(serialize_term(value));
    
    expect(ret).toMatchObject(value);
  });
});

describe("bad serialize", () => {
  it("bad map", () => {
    const value = {
      type  : "MAP_EXT",
      value : [
        {
          type : "SMALL_INTEGER_EXT",
          value: 0
        } as Parse_result
      ]
    } as Parse_result
    
    expect(()=>serialize_term(value)).toThrow("malformed map t.value.length=1 should be divisible by 2");
  });
  it("bad type (bypass with any)", () => {
    const value = {
      type  : "WTF",
      value : null
    } as any;
    expect(()=>serialize_term(value)).toThrow("unexpected type WTF");
    expect(()=>serialize_term_get_size(value)).toThrow("unexpected type WTF");
  });
});