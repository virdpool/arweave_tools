/**
 * @jest-environment node
 */
// this stupid stuff is required for bypass `Error: Cross origin http://localhost forbidden`
import { Block_index3_json_manager, Block_index3_json } from "..";
import fs from "fs";
import express from "express";

let port = 1338;
if (process.env.TEST_PORT) {
  port = +process.env.TEST_PORT;
}

describe("Block_index3_json", () => {
  const block_0_orig = {
    tx_root: "P_OiqMNN1s4ltcaq0HXb9VFos_Zz6LFjM8ogUG0vJek",
    weave_size:"0",
    hash:"7wIU7KolICAjClMlcZ38LZzshhI7xGkm2tDCJR7Wvhe3ESUo2-Z4-y0x1uaglRJE"
  };  
  const block_4307 = {
    tx_root: Buffer.alloc(0),
    weave_size: BigInt("1039029"),
    indep_hash: Buffer.from("d2e29cba8a21555fd957dd4277be8f6db4fc77cff30a7086c22811b6f2758406ba056d11cea3e7e0e392bfcd166d1173", "hex")
  }
  const block_4307_orig = {
    tx_root   : "",
    weave_size: "1039029",
    hash: "0uKcuoohVV_ZV91Cd76PbbT8d8_zCnCGwigRtvJ1hAa6BW0RzqPn4OOSv80WbRFz"
  }
  const block_0 = {
    tx_root: Buffer.alloc(0),
    weave_size: BigInt("1039029"),
    indep_hash: Buffer.from("d2e29cba8a21555fd957dd4277be8f6db4fc77cff30a7086c22811b6f2758406ba056d11cea3e7e0e392bfcd166d1173", "hex")
  }
  
  const index = new Block_index3_json();
  it("load", async () => {
    await Block_index3_json_manager.load(index, __dirname+"/block_index_slice");
  });
  it("save", async () => {
    const target_file = __dirname+"/block_index_slice_re";
    if (fs.existsSync(target_file)) {
      fs.unlinkSync(target_file);
    }
    await Block_index3_json_manager.save(index, target_file);
    expect(fs.existsSync(target_file)).toBe(true);
    const buf1 = fs.readFileSync(__dirname+"/block_index_slice");
    const buf2 = fs.readFileSync(target_file);
    expect(buf1.equals(buf2)).toBe(true);
    fs.unlinkSync(target_file);
  });
  it("load_sync", async () => {
    await Block_index3_json_manager.load_sync(index, __dirname+"/block_index_slice");
  });
  it("save_sync", () => {
    const target_file = __dirname+"/block_index_slice_re";
    if (fs.existsSync(target_file)) {
      fs.unlinkSync(target_file);
    }
    Block_index3_json_manager.save_sync(index, target_file);
    expect(fs.existsSync(target_file)).toBe(true);
    const buf1 = fs.readFileSync(__dirname+"/block_index_slice");
    const buf2 = fs.readFileSync(target_file);
    expect(buf1.equals(buf2)).toBe(true);
    fs.unlinkSync(target_file);
  });
  let app : any;
  let server : any;
  it("test express start", async ():Promise<void> => {
    return new Promise((resolve, reject)=> {
      try {
        app = express()
        app.use('/block_index', express.static(__dirname+"/block_index_slice"));
        server = app.listen(port, () => {
          resolve()
          // setTimeout(resolve, 10000);
        });
      } catch (err) {
        reject(err);
      }
    });
  });
  
  it("download", async () => {
    const index = await Block_index3_json_manager.download([`http://localhost:${port}`]);
    expect(index.block_list[4307]).toMatchObject(block_0_orig);
    expect(index.block_list[0]).toMatchObject(block_4307_orig);
  });
  
  it("good download 2", async () => {
    await Block_index3_json_manager.download([`http://localhost:${port+1}`,`http://localhost:${port}`]);
  });
  // NOTE. expect(fn).rejects.toThrow doesn't cover properly
  it("bad download", async () => {
    try {
      await Block_index3_json_manager.download([`http://localhost:${port+1}`, `http://localhost:${port+2}`]);
    } catch (err: any) {
      expect(err.message).toBe(`connect ECONNREFUSED 127.0.0.1:${port+2}`);
      return
    }
    throw new Error("error expected");
  });
  
  it("test express stop", async ():Promise<void> => {
    return new Promise((resolve, reject)=>{
      server.close((err:any)=>{
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
  
  it("get_by_height_full", () => {
    expect(index.get_by_height_full(-1)).toBe(undefined);
    expect(index.get_by_height_full(4308)).toBe(undefined);
    expect(index.get_by_height_full(4307)).toMatchObject(block_4307);
  });
  it("get_by_height_indep_hash", () => {
    expect(index.get_by_height_indep_hash(-1)).toBe(undefined);
    expect(index.get_by_height_indep_hash(4308)).toBe(undefined);
    expect(index.get_by_height_indep_hash(4307)).toMatchObject(block_4307.indep_hash);
  });
  it("get_by_height_weave_size", () => {
    expect(index.get_by_height_weave_size(-1)).toBe(undefined);
    expect(index.get_by_height_weave_size(4308)).toBe(undefined);
    expect(index.get_by_height_weave_size(4307)).toBe(block_4307.weave_size);
  });
  it("get_by_height_tx_root", () => {
    expect(index.get_by_height_tx_root(-1)).toBe(undefined);
    expect(index.get_by_height_tx_root(4308)).toBe(undefined);
    expect(index.get_by_height_tx_root(4307)).toMatchObject(block_4307.tx_root);
  });
  it("get_by_height_indep_hash_orig", () => {
    expect(index.get_by_height_indep_hash_orig(-1)).toBe(undefined);
    expect(index.get_by_height_indep_hash_orig(4308)).toBe(undefined);
    expect(index.get_by_height_indep_hash_orig(4307)).toBe(block_4307_orig.hash);
  });
  it("get_by_height_weave_size_orig", () => {
    expect(index.get_by_height_weave_size_orig(-1)).toBe(undefined);
    expect(index.get_by_height_weave_size_orig(4308)).toBe(undefined);
    expect(index.get_by_height_weave_size_orig(4307)).toBe(block_4307_orig.weave_size);
  });
  it("get_by_height_tx_root_orig", () => {
    expect(index.get_by_height_tx_root_orig(-1)).toBe(undefined);
    expect(index.get_by_height_tx_root_orig(4308)).toBe(undefined);
    expect(index.get_by_height_tx_root_orig(4307)).toBe(block_4307_orig.tx_root);
  });
  
  it("_get_block_idx_by_chunk_offset", () => {
    expect(index._get_block_idx_by_chunk_offset(BigInt(-1))).toBe(undefined);
    expect(index._get_block_idx_by_chunk_offset(BigInt(1039029+1))).toBe(undefined);
    const fn = (idx: number)=> {
      return {
        idx,
        block : index.block_list[idx]
      }
    }
    expect(index._get_block_idx_by_chunk_offset(BigInt(1039029))).toMatchObject(fn(780));
    expect(index._get_block_idx_by_chunk_offset(BigInt(0))).toMatchObject(fn(4307));
    expect(index._get_block_idx_by_chunk_offset(BigInt(1))).toMatchObject(fn(4225));
    expect(index._get_block_idx_by_chunk_offset(BigInt(599058-1))).toMatchObject(fn(4225));
    expect(index._get_block_idx_by_chunk_offset(BigInt(599058  ))).toMatchObject(fn(4225));
    expect(index._get_block_idx_by_chunk_offset(BigInt(599058+1))).toMatchObject(fn(780));
  });
  const block_780 = {
    tx_root   : Buffer.from("fa8a00c99511e3d853e407d745ca32ab4002e4b0f2437717ba4e64a11a0f2016", "hex"),
    weave_size: BigInt("1039029"),
    indep_hash: Buffer.from("dbe155af0929bbe7e7df2e3de61d81870dcc4b9261a5830041cffc0b591ef70845c01d53f9a8dd6f6023936896124d2a", "hex")
  }
  const block_780_orig = {
    tx_root   :"-ooAyZUR49hT5AfXRcoyq0AC5LDyQ3cXuk5koRoPIBY",
    weave_size:"1039029",
    indep_hash:"2-FVrwkpu-fn3y495h2Bhw3MS5JhpYMAQc_8C1ke9whFwB1T-ajdb2Ajk2iWEk0q"
  }
  it("get_by_chunk_offset_full", () => {
    expect(index.get_by_chunk_offset_full(BigInt(-1))).toBe(undefined);
    expect(index.get_by_chunk_offset_full(BigInt(1039029))).toMatchObject(block_780);
  });
  it("get_by_chunk_offset_indep_hash", () => {
    expect(index.get_by_chunk_offset_indep_hash(BigInt(-1))).toBe(undefined);
    expect(index.get_by_chunk_offset_indep_hash(BigInt(1039029))).toMatchObject(block_780.indep_hash);
  });
  it("get_by_chunk_offset_weave_size", () => {
    expect(index.get_by_chunk_offset_weave_size(BigInt(-1))).toBe(undefined);
    expect(index.get_by_chunk_offset_weave_size(BigInt(1039029))).toBe(block_780.weave_size);
  });
  it("get_by_chunk_offset_tx_root", () => {
    expect(index.get_by_chunk_offset_tx_root(BigInt(-1))).toBe(undefined);
    expect(index.get_by_chunk_offset_tx_root(BigInt(1039029))).toMatchObject(block_780.tx_root);
  });
  it("get_by_chunk_offset_indep_hash_orig", () => {
    expect(index.get_by_chunk_offset_indep_hash_orig(BigInt(-1))).toBe(undefined);
    expect(index.get_by_chunk_offset_indep_hash_orig(BigInt(1039029))).toBe(block_780_orig.indep_hash);
  });
  it("get_by_chunk_offset_weave_size_orig", () => {
    expect(index.get_by_chunk_offset_weave_size_orig(BigInt(-1))).toBe(undefined);
    expect(index.get_by_chunk_offset_weave_size_orig(BigInt(1039029))).toBe(block_780_orig.weave_size);
  });
  it("get_by_chunk_offset_tx_root_orig", () => {
    expect(index.get_by_chunk_offset_tx_root_orig(BigInt(-1))).toBe(undefined);
    expect(index.get_by_chunk_offset_tx_root_orig(BigInt(1039029))).toBe(block_780_orig.tx_root);
  });
  
  
  
  const good_ent = block_0_orig;
  it("orig_format3_json_check not array", async () => {
    expect(()=>index.load_from_original_format(1)).toThrow("!(json instanceof Array)"); 
  });
  it("orig_format3_json_check !tx_root string", async () => {
    let bad_ent = Object.assign({}, good_ent) as any;
    delete bad_ent.tx_root;
    expect(()=>index.load_from_original_format([bad_ent])).toThrow("typeof json[0].tx_root !== string"); 
  });
  it("orig_format3_json_check !weave_size string", async () => {
    let bad_ent = Object.assign({}, good_ent) as any;
    delete bad_ent.weave_size;
    expect(()=>index.load_from_original_format([bad_ent])).toThrow("typeof json[0].weave_size !== string"); 
  });
  it("orig_format3_json_check !hash  string", async () => {
    let bad_ent = Object.assign({}, good_ent) as any;
    delete bad_ent.hash;
    expect(()=>index.load_from_original_format([bad_ent])).toThrow("typeof json[0].hash !== string"); 
  });
  
  it("orig_format3_json_check bad tx_root len", async () => {
    const bad_ent = Object.assign({}, good_ent);
    bad_ent.tx_root = "wtf";
    expect(()=>index.load_from_original_format([bad_ent])).toThrow("json[0].tx_root is not base64url with length 43"); 
  });
  it("orig_format3_json_check bad weave_size", async () => {
    const bad_ent = Object.assign({}, good_ent);
    bad_ent.weave_size = "wtf";
    expect(()=>index.load_from_original_format([bad_ent])).toThrow("json[0].weave_size is not decimal"); 
  });
  it("orig_format3_json_check bad hash len", async () => {
    const bad_ent = Object.assign({}, good_ent);
    bad_ent.hash = "wtf";
    expect(()=>index.load_from_original_format([bad_ent])).toThrow("json[0].hash is not base64url with length 64"); 
  });
  it("orig_format3_json_check bad weave_size order", async () => {
    const bad_ent = Object.assign({}, good_ent);
    bad_ent.weave_size = "1";
    expect(()=>index.load_from_original_format([good_ent,bad_ent])).toThrow("json[0] prev_weave_size > weave_size; 1 > 0"); 
  });
});
