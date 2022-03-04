import { parse } from "..";
import { sprintf } from "sprintf-js"

describe("parse", () => {
  it("NEW_FLOAT_EXT", () => {
    const value = 10.5;
    const buf = Buffer.from([131, 70, 0,0,0,0, 0,0,0,0]);
    buf.writeDoubleBE(value, 2);
    
    const ret = parse(buf);
    expect(ret).toMatchObject({
      type  : "NEW_FLOAT_EXT",
      value : value
    });
  });
  // TODO 77 BIT_BINARY_EXT
  it("SMALL_INTEGER_EXT", () => {
    const value = 10;
    const buf = Buffer.from([131, 97, value]);
    
    const ret = parse(buf);
    expect(ret).toMatchObject({
      type  : "SMALL_INTEGER_EXT",
      value : value
    });
  });
  it("INTEGER_EXT", () => {
    const value = 0xFFFFFF;
    const buf = Buffer.from([131, 98, 0,0,0,0]);
    buf.writeUInt32BE(value, 2);
    
    const ret = parse(buf);
    expect(ret).toMatchObject({
      type  : "INTEGER_EXT",
      value : value
    });
  });
  it("FLOAT_EXT", () => {
    const value = 10.5;
    const value_buf = Buffer.from(sprintf("%.20e", value).padEnd(31));
    const head = Buffer.from([131, 99]);
    const buf = Buffer.concat([head, value_buf]);
    
    const ret = parse(buf);
    expect(ret).toMatchObject({
      type  : "FLOAT_EXT",
      value : value
    });
  });
  it("SMALL_TUPLE_EXT 0", () => {
    const buf = Buffer.from([131, 104, 0]);
    
    const ret = parse(buf);
    expect(ret).toMatchObject({
      type  : "SMALL_TUPLE_EXT",
      value : []
    });
  });
  it("SMALL_TUPLE_EXT 1", () => {
    const buf = Buffer.from([131, 104, 1, 97, 10]);
    
    const ret = parse(buf);
    expect(ret).toMatchObject({
      type  : "SMALL_TUPLE_EXT",
      value : [
        {
          type : "SMALL_INTEGER_EXT",
          value: 10
        }
      ]
    });
  });
  it("SMALL_TUPLE_EXT 2", () => {
    const buf = Buffer.from([131, 104, 2, 97, 10, 97, 20]);
    
    const ret = parse(buf);
    expect(ret).toMatchObject({
      type  : "SMALL_TUPLE_EXT",
      value : [
        {
          type : "SMALL_INTEGER_EXT",
          value: 10
        },
        {
          type : "SMALL_INTEGER_EXT",
          value: 20
        }
      ]
    });
  });
  it("LARGE_TUPLE_EXT 0", () => {
    const buf = Buffer.from([131, 105, 0,0,0,0]);
    
    const ret = parse(buf);
    expect(ret).toMatchObject({
      type  : "LARGE_TUPLE_EXT",
      value : []
    });
  });
  it("LARGE_TUPLE_EXT 1", () => {
    const buf = Buffer.from([131, 105, 0,0,0,1, 97, 10]);
    
    const ret = parse(buf);
    expect(ret).toMatchObject({
      type  : "LARGE_TUPLE_EXT",
      value : [
        {
          type : "SMALL_INTEGER_EXT",
          value: 10
        }
      ]
    });
  });
  it("LARGE_TUPLE_EXT 2", () => {
    const buf = Buffer.from([131, 105, 0,0,0,2, 97, 10, 97, 20]);
    
    const ret = parse(buf);
    expect(ret).toMatchObject({
      type  : "LARGE_TUPLE_EXT",
      value : [
        {
          type : "SMALL_INTEGER_EXT",
          value: 10
        },
        {
          type : "SMALL_INTEGER_EXT",
          value: 20
        }
      ]
    });
  });
  it("NIL_EXT", () => {
    const buf = Buffer.from([131, 106]);
    
    const ret = parse(buf);
    expect(ret).toMatchObject({
      type  : "NIL_EXT",
      value : null
    });
  });
  it("STRING_EXT", () => {
    const value = Buffer.from("0123");;
    const head = Buffer.from([131, 107, 0,value.length])
    const buf = Buffer.concat([head, value]);
    
    const ret = parse(buf);
    expect(ret).toMatchObject({
      type  : "STRING_EXT",
      value
    });
  });
  // invalid list
  it("LIST_EXT 0", () => {
    const buf = Buffer.from([131, 108, 0,0,0,0, 106]);
    
    const ret = parse(buf);
    expect(ret).toMatchObject({
      type  : "LIST_EXT",
      value : [],
      tail  : {
        type  : "NIL_EXT",
        value : null
      }
    });
  });
  // invalid list
  it("LIST_EXT 1 tail", () => {
    const buf = Buffer.from([131, 108, 0,0,0,0, 97, 10]);
    
    const ret = parse(buf);
    expect(ret).toMatchObject({
      type  : "LIST_EXT",
      value : [],
      tail  : {
        type : "SMALL_INTEGER_EXT",
        value: 10
      },
    });
  });
  it("LIST_EXT 1", () => {
    const buf = Buffer.from([131, 108, 0,0,0,1, 107, 0, 1, 10, 106]);
    
    const ret = parse(buf);
    expect(ret).toMatchObject({
      type  : "LIST_EXT",
      value : [
        {
          type : "STRING_EXT",
          value: Buffer.from([10])
        },
      ],
      tail  : {
        type  : "NIL_EXT",
        value : null
      }
    });
  });
  it("LIST_EXT 2", () => {
    const buf = Buffer.from([131, 108, 0,0,0,2, 107, 0, 1, 10, 107, 0, 1, 11, 106]);
    
    const ret = parse(buf);
    expect(ret).toMatchObject({
      type  : "LIST_EXT",
      value : [
        {
          type : "STRING_EXT",
          value: Buffer.from([10])
        },
        {
          type : "STRING_EXT",
          value: Buffer.from([11])
        },
      ],
      tail  : {
        type  : "NIL_EXT",
        value : null
      }
    });
  });
  it("BINARY_EXT", () => {
    const value = Buffer.from([0, 1, 2, 3]);;
    const head = Buffer.from([131, 109, 0,0,0,value.length])
    const buf = Buffer.concat([head, value]);
    
    const ret = parse(buf);
    expect(ret).toMatchObject({
      type  : "BINARY_EXT",
      value
    });
  });
  it("SMALL_BIG_EXT", () => {
    const value = Buffer.alloc(8);
    // const value_bn = 0xFFFFFFFFFFFFn; // TODO ES2020
    const value_bn = BigInt("0xFFFFFFFFFFFF");
    value.writeBigInt64BE(value_bn, 0);
    const head = Buffer.from([131, 110, value.length, 0])
    const buf = Buffer.concat([head, value]);
    
    const ret = parse(buf);
    expect(ret).toMatchObject({
      type  : "SMALL_BIG_EXT",
      value : value_bn,
      sign  : 0
    });
  });
  it("SMALL_BIG_EXT negative", () => {
    const value = Buffer.alloc(8);
    // const value_bn = 0xFFFFFFFFFFFFn; // TODO ES2020
    const value_bn = BigInt("0xFFFFFFFFFFFF");
    value.writeBigInt64BE(value_bn, 0);
    const head = Buffer.from([131, 110, value.length, 1])
    const buf = Buffer.concat([head, value]);
    
    const ret = parse(buf);
    expect(ret).toMatchObject({
      type  : "SMALL_BIG_EXT",
      value : -value_bn,
      sign  : 1
    });
  });
  it("LARGE_BIG_EXT", () => {
    const value = Buffer.alloc(8);
    // const value_bn = 0xFFFFFFFFFFFFn; // TODO ES2020
    const value_bn = BigInt("0xFFFFFFFFFFFF");
    value.writeBigInt64BE(value_bn, 0);
    const head = Buffer.from([131, 111, 0,0,0,value.length, 0])
    const buf = Buffer.concat([head, value]);
    
    const ret = parse(buf);
    expect(ret).toMatchObject({
      type  : "LARGE_BIG_EXT",
      value : value_bn,
      sign  : 0
    });
  });
  it("LARGE_BIG_EXT negative", () => {
    const value = Buffer.alloc(8);
    // const value_bn = 0xFFFFFFFFFFFFn; // TODO ES2020
    const value_bn = BigInt("0xFFFFFFFFFFFF");
    value.writeBigInt64BE(value_bn, 0);
    const head = Buffer.from([131, 111, 0,0,0,value.length, 1])
    const buf = Buffer.concat([head, value]);
    
    const ret = parse(buf);
    expect(ret).toMatchObject({
      type  : "LARGE_BIG_EXT",
      value : -value_bn,
      sign  : 1
    });
  });
  it("MAP_EXT 0", () => {
    const buf = Buffer.from([131, 116, 0,0,0,0]);
    
    const ret = parse(buf);
    expect(ret).toMatchObject({
      type  : "MAP_EXT",
      value : []
    });
  });
  it("MAP_EXT 1", () => {
    const buf = Buffer.from([131, 116, 0,0,0,1, 97, 0, 97, 1]);
    
    const ret = parse(buf);
    expect(ret).toMatchObject({
      type  : "MAP_EXT",
      value : [
        {
          type : "SMALL_INTEGER_EXT",
          value: 0
        },
        {
          type : "SMALL_INTEGER_EXT",
          value: 1
        },
      ]
    });
  });
  it("MAP_EXT 2", () => {
    const buf = Buffer.from([131, 116, 0,0,0,2, 97, 0, 97, 1, 97, 2, 97, 3]);
    
    const ret = parse(buf);
    expect(ret).toMatchObject({
      type  : "MAP_EXT",
      value : [
        {
          type : "SMALL_INTEGER_EXT",
          value: 0
        },
        {
          type : "SMALL_INTEGER_EXT",
          value: 1
        },
        {
          type : "SMALL_INTEGER_EXT",
          value: 2
        },
        {
          type : "SMALL_INTEGER_EXT",
          value: 3
        },
      ]
    });
  });
  it("ATOM_UTF8_EXT", () => {
    const value = "hello";
    const value_buf = Buffer.from(value, "utf8");
    const head = Buffer.from([131, 118, 0,value_buf.length]);
    const buf = Buffer.concat([head, value_buf]);
    
    const ret = parse(buf);
    expect(ret).toMatchObject({
      type  : "ATOM_UTF8_EXT",
      value
    });
  });
  it("SMALL_ATOM_UTF8_EXT", () => {
    const value = "hello";
    const value_buf = Buffer.from(value, "utf8");
    const head = Buffer.from([131, 119, value_buf.length]);
    const buf = Buffer.concat([head, value_buf]);
    
    const ret = parse(buf);
    expect(ret).toMatchObject({
      type  : "SMALL_ATOM_UTF8_EXT",
      value
    });
  });
});

describe("bad parse", () => {
  it("bad head", () => {
    const buf = Buffer.from([70, 0,0,0,0, 0,0,0,0]);
    const value = 10.5;
    buf.writeDoubleBE(value, 1);
    
    expect(()=>parse(buf)).toThrow("bad erlang tag != 131 offset=0");
  });
  it("bad type", () => {
    const buf = Buffer.from([131, 131]);
    
    expect(()=>parse(buf)).toThrow("unkonwn erlang type 131 offset=1");
  });
  it("bad tail NEW_FLOAT_EXT", () => {
    const buf = Buffer.from([131, 70, 0,0,0,0, 0,0,0,0, 0]);
    const value = 10.5;
    buf.writeDoubleBE(value, 2);
    
    expect(()=>parse(buf)).toThrow("not parsed fully 10 != 11");
  });
  it("bad tail FLOAT_EXT", () => {
    const buf = Buffer.from([131, 99, 0]);
    
    expect(()=>parse(buf)).toThrow("offset overflow 33 != 3");
  });
});