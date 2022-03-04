import axios from "axios"
import fs from "fs"
import fsp from "fs/promises"
import * as base64url from "base64url"

type Hash_type = Buffer;
type Tx_root_type = Hash_type;
type Weave_size_type = bigint;
type Indep_hash_type = Hash_type;

// TODO move to util

// nodejs impl

// browser impl pending

export type Block_index_entity = {
  indep_hash  : Indep_hash_type;
  weave_size  : Weave_size_type;
  tx_root     : Tx_root_type;
  block_size  : bigint;
}

export abstract class Block_index {
  // NOTE will be implemented as separated class-service for download/save/load
  // it's important to split that because browser can not have some capabilities
  // LATER
  // abstract async download(peer_url_list: string[]): void;
  // abstract async download_save(peer_url_list: string[], path:string): void;
  
  // abstract async save(path: string): void;
  // abstract async load(path: string): void;
  // abstract save_sync(path: string): void;
  // abstract load_sync(path: string): void;
}

// 3 means indep_hash, weave_size, tx_root
export abstract class Block_index3 extends Block_index {
  // get block data by height
  
  // JSDoc types can only be used inside documentation comments.
  // typescript...
  // abstract get_by_height_full(height: number): Block_index_entity?;
  abstract get_by_height_full(height: number): Block_index_entity | undefined;
  abstract get_by_height_indep_hash(height: number): Indep_hash_type | undefined;
  abstract get_by_height_weave_size(height: number): Weave_size_type | undefined;
  abstract get_by_height_tx_root(height: number): Tx_root_type | undefined;
  abstract get_by_height_indep_hash_orig(height: number): string | undefined;
  abstract get_by_height_weave_size_orig(height: number): string | undefined;
  abstract get_by_height_tx_root_orig(height: number): string | undefined;
  
  // get block data by chunk_offset (e.g. block_validate)
  abstract get_by_chunk_offset_full(chunk_offset: bigint): Block_index_entity | undefined;
  abstract get_by_chunk_offset_indep_hash(chunk_offset: bigint): Indep_hash_type | undefined;
  abstract get_by_chunk_offset_weave_size(chunk_offset: bigint): Weave_size_type | undefined;
  abstract get_by_chunk_offset_tx_root(chunk_offset: bigint): Tx_root_type | undefined;
  abstract get_by_chunk_offset_indep_hash_orig(chunk_offset: bigint): string | undefined;
  abstract get_by_chunk_offset_weave_size_orig(chunk_offset: bigint): string | undefined;
  abstract get_by_chunk_offset_tx_root_orig(chunk_offset: bigint): string | undefined;
}

// save_other_type for other implementations
// convert_other_type for other implementations
// partial block index - just other implementation


function orig_format3_json_check(json:any) {
  if (!(json instanceof Array)) {
    throw new Error("!(json instanceof Array)");
  }
  if (json.length) {
    for(let i=0,len=json.length;i<len;i++){
      const el = json[i];
      if (typeof el.tx_root !== "string") {
        throw new Error(`typeof json[${i}].tx_root !== string`);
      }
      if (typeof el.weave_size !== "string") {
        throw new Error(`typeof json[${i}].weave_size !== string`);
      }
      if (typeof el.hash !== "string") {
        throw new Error(`typeof json[${i}].hash !== string`);
      }
      // NOTE. empty tx_root is also ok
      if (el.tx_root !== "") {
        if (!/^[-_a-z0-9]{43}$/i.test(el.tx_root)) {
          throw new Error(`json[${i}].tx_root is not base64url with length 43`);
        }
      }
      if (!/^\d+$/.test(el.weave_size)) {
        throw new Error(`json[${i}].weave_size is not decimal`);
      }
      if (!/^[-_a-z0-9]{64}$/i.test(el.hash)) {
        throw new Error(`json[${i}].hash is not base64url with length 64`);
      }
    }
    let prev_weave_size = BigInt(json[json.length-1].weave_size);
    for(let i=json.length-2;i>=0;i--){
      const el = json[i];
      const weave_size = BigInt(el.weave_size);
      if (prev_weave_size > weave_size) {
        throw new Error(`json[${i}] prev_weave_size > weave_size; ${prev_weave_size} > ${weave_size}`);
      }
      prev_weave_size = weave_size;
    }
  }
}

// just match original json format
type Block_index3_json_entity = {
  tx_root     : string;
  weave_size  : string;
  hash        : string;
}

type Block_idx_ret = {
  idx : number,
  block : Block_index3_json_entity
}

export class Block_index3_json extends Block_index3 {
  // NOTE 0 is last block
  block_list : Block_index3_json_entity[] = []
  // for binary search
  chunk_offset_a : bigint = BigInt(0)
  chunk_offset_b : bigint = BigInt(0)
  
  load_from_original_format(json: any) {
    orig_format3_json_check(json);
    this.block_list = json
    this.chunk_offset_a = BigInt(this.block_list[this.block_list.length-1].weave_size);
    this.chunk_offset_b = BigInt(this.block_list[0].weave_size);
  }
  
  get_by_height_full(height: number): Block_index_entity | undefined {
    const idx = this.block_list.length - height - 1;
    const block_index_entity = this.block_list[idx];
    if (!block_index_entity) {
      return undefined;
    }
    const prev_block_index_entity = this.block_list[idx+1];
    const weave_size = BigInt(block_index_entity.weave_size);
    let prev_weave_size = BigInt(0);
    if (prev_block_index_entity) {
      prev_weave_size = BigInt(prev_block_index_entity.weave_size);
    }
    
    return {
      indep_hash  : base64url.unpack(block_index_entity.hash),
      weave_size,
      tx_root     : base64url.unpack(block_index_entity.tx_root),
      block_size  : weave_size - prev_weave_size
    }
  }
  get_by_height_indep_hash(height: number):Indep_hash_type | undefined {
    const block_index_entity = this.block_list[this.block_list.length - height - 1]
    if (!block_index_entity) {
      return undefined;
    }
    return base64url.unpack(block_index_entity.hash)
  }
  get_by_height_weave_size(height: number): Weave_size_type | undefined {
    const block_index_entity = this.block_list[this.block_list.length - height - 1]
    if (!block_index_entity) {
      return undefined;
    }
    return BigInt(block_index_entity.weave_size);
  }
  get_by_height_tx_root(height: number): Tx_root_type | undefined {
    const block_index_entity = this.block_list[this.block_list.length - height - 1]
    if (!block_index_entity) {
      return undefined;
    }
    return base64url.unpack(block_index_entity.tx_root)
  }
  get_by_height_indep_hash_orig(height: number): string | undefined {
    return this.block_list[this.block_list.length - height - 1]?.hash;
  }
  get_by_height_weave_size_orig(height: number): string | undefined {
    return this.block_list[this.block_list.length - height - 1]?.weave_size;
  }
  get_by_height_tx_root_orig(height: number): string | undefined {
    return this.block_list[this.block_list.length - height - 1]?.tx_root;
  }
  
  _get_block_idx_by_chunk_offset(chunk_offset: bigint): Block_idx_ret | undefined {
    if (this.chunk_offset_a > chunk_offset) return undefined;
    if (this.chunk_offset_b < chunk_offset) return undefined;
    const block_list = this.block_list;
    let co_a : bigint = this.chunk_offset_a;
    let co_b : bigint = this.chunk_offset_b;
    const last_idx = block_list.length-1;
    let idx_a = last_idx;
    let idx_b = 0;
    let idx_c = Math.floor((idx_b+idx_a)/2);
    let co_c = BigInt(block_list[idx_c].weave_size);
    
    let ret_block_idx = 0;
    while(true) {
      if (co_c === chunk_offset) {
        // need get prev block
        ret_block_idx = idx_c-1;
        break
      }
      if (idx_c === idx_b) {
        ret_block_idx = idx_b;
        break
      }
      
      if (co_c > chunk_offset) {
        idx_b = idx_c;
        idx_c = Math.floor((idx_b+idx_a)/2)
      } else {
        idx_a = idx_c;
        idx_c = Math.floor((idx_b+idx_a)/2)
      }
      
      co_c = BigInt(block_list[idx_c].weave_size);
    }
    
    // TODO rework with refined index without gaps
    let ret = block_list[ret_block_idx];
    while(ret_block_idx < last_idx) {
      const probe_block = block_list[ret_block_idx+1];
      if (ret.weave_size !== probe_block.weave_size) {
        break
      }
      ret_block_idx++;
      ret = probe_block;
    }
    return {
      idx   : ret_block_idx,
      block : ret
    }
  }
  
  get_by_chunk_offset_full(chunk_offset: bigint): Block_index_entity | undefined {
    const ret = this._get_block_idx_by_chunk_offset(chunk_offset)
    if (!ret) {
      return undefined;
    }
    const block_index_entity = ret.block;
    
    const prev_block_index_entity = this.block_list[ret.idx+1];
    const weave_size = BigInt(block_index_entity.weave_size);
    let prev_weave_size = BigInt(0);
    if (prev_block_index_entity) {
      prev_weave_size = BigInt(prev_block_index_entity.weave_size);
    }
    
    return {
      indep_hash  : base64url.unpack(block_index_entity.hash),
      weave_size,
      tx_root     : base64url.unpack(block_index_entity.tx_root),
      block_size  : weave_size - prev_weave_size
    }
  }
  get_by_chunk_offset_indep_hash(chunk_offset: bigint): Indep_hash_type | undefined {
    const ret = this._get_block_idx_by_chunk_offset(chunk_offset)
    if (!ret) {
      return undefined;
    }
    const block_index_entity = ret.block;
    return base64url.unpack(block_index_entity.hash)
  }
  get_by_chunk_offset_weave_size(chunk_offset: bigint): Weave_size_type | undefined {
    const ret = this._get_block_idx_by_chunk_offset(chunk_offset)
    if (!ret) {
      return undefined;
    }
    const block_index_entity = ret.block;
    return BigInt(block_index_entity.weave_size)
  }
  get_by_chunk_offset_tx_root(chunk_offset: bigint): Tx_root_type | undefined {
    const ret = this._get_block_idx_by_chunk_offset(chunk_offset)
    if (!ret) {
      return undefined;
    }
    const block_index_entity = ret.block;
    return base64url.unpack(block_index_entity.tx_root)
  }
  get_by_chunk_offset_indep_hash_orig(chunk_offset: bigint): string | undefined {
    const ret = this._get_block_idx_by_chunk_offset(chunk_offset)
    if (!ret) {
      return undefined;
    }
    const block_index_entity = ret.block;
    return block_index_entity.hash;
  }
  get_by_chunk_offset_weave_size_orig(chunk_offset: bigint): string | undefined {
    const ret = this._get_block_idx_by_chunk_offset(chunk_offset)
    if (!ret) {
      return undefined;
    }
    const block_index_entity = ret.block;
    return block_index_entity.weave_size;
  }
  get_by_chunk_offset_tx_root_orig(chunk_offset: bigint): string | undefined {
    const ret = this._get_block_idx_by_chunk_offset(chunk_offset)
    if (!ret) {
      return undefined;
    }
    const block_index_entity = ret.block;
    return block_index_entity.tx_root;
  }
}

// NOTE. block 0 does NOT have weave_size 0
// TODO fix it LATER
export class Block_index3_json_manager {
  static async save(block_index: Block_index3_json, path: string) {
    await fsp.writeFile(path, JSON.stringify(block_index.block_list));
  }
  static async load(block_index: Block_index3_json, path: string) {
    const cont = await fsp.readFile(path, "utf8");
    block_index.load_from_original_format(JSON.parse(cont));
  }
  static save_sync(block_index: Block_index3_json, path: string):void {
    fs.writeFileSync(path, JSON.stringify(block_index.block_list));
  }
  static load_sync(block_index: Block_index3_json, path: string):void {
    const cont = fs.readFileSync(path, "utf8");
    block_index.load_from_original_format(JSON.parse(cont));
  }
  
  static async download(peer_url_list: string[]): Promise<Block_index3_json> {
    const block_index = new Block_index3_json();
    const axios_opt = {
      timeout: 60000, // for slow internet should be more, add to options???
      // responseType : "arraybuffer",
      // typescript...
      responseType : "arraybuffer" as any,
      // headers: {
        // "x-block-format": 1
      // }
    }
    let last_err = null;
    for(var i=0,len=peer_url_list.length;i<len;i++) {
      const perr_url = peer_url_list[i];
      try {
        const res = await axios.get(`${perr_url}/block_index`, axios_opt);
        const json = JSON.parse(res.data);
        block_index.load_from_original_format(json);
        return block_index;
      } catch (err) {
        last_err = err;
      }
    }
    throw last_err;
  }
  
  // // async download_save(peer_url_list: string[], path:string): void {
  // //   // dumb TEMP implementation
  // //   const block_index = await download(peer_url_list);
  // //   block_index.save(path);
  // // }
  // 
  // async download_save(peer_url_list: string[], path:string): void {
  //   // dumb TEMP implementation
  //   // TODO impl without intermediate Block_index3_json
  //   const block_index = new Block_index3_json();
  //   const axios_opt = {
  //     timeout: 60000, // for slow internet should be more, add to options???
  //     responseType : "arraybuffer"
  //     headers: {
  //       "x-block-format": 1
  //     }
  //   }
  //   let last_err = null;
  //   for(var i=0,len=peer_url_list.length;i<len;i++) {
  //     const perr_url = peer_url_list[i];
  //     try {
  //       // TODO download directly to file
  //       // e.g. wget or redirected curl or streaming http(s) client or streaming axios
  //       const result = await axios.get(`${perr_url}/block_index`, axios_opt)
  //       // questionable validation
  //       // Look https://stackoverflow.com/questions/3710204/how-to-check-if-a-string-is-a-valid-json-string-in-javascript-without-using-try
  //       // https://github.com/douglascrockford/JSON-js/blob/master/json2.js
  //       // if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
  //       // replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
  //       // replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
  //       // 
  //       //   //the json is ok
  //       // 
  //       // }else{
  //       // 
  //       //   //the json is not ok
  //       // 
  //       // }
  //       
  //       // fastest, but eats extra memory
  //       JSON.parse(res.data);
  //       // actual validation for each res.data part
  //       
  //       await fsp.writeFile(path, res.data);
  //     } catch (err) {
  //       last_err = err;
  //     }
  //   }
  //   throw last_err;
  // }
}

// TODO Block_index3_compact. Use Buffer instead of JSON (less disk use, less memory use)
// TODO Block_index3_compact_prune. Use only blocks with block_size (difference in weave_size with prev)
// TODO Block_index3_compact_prune_split. weave_size is stored in separate Buffer (and separate file). Loaded as BigInt list. This will cause better CPU cache use
// TODO Block_index3_compact_prune_split_napi. Nodejs only, weave_size is not loaded as BigInt list, napi accelerated search function is used (no extra BigInt allocation, even better cache use, more performance, because no BigInt overhead)
// TODO Block_index3_compact_prune_split_wasm. For potential browser use
