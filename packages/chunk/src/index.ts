import crypto from "crypto"
import * as base64url from "base64url"
import { Block_index3 } from "block_index"

function sha256 (buf: Buffer) {
  return  crypto.createHash("sha256").update(buf).digest()
}
function sha256_list(list: Buffer[]): Buffer {
  const ctx = crypto.createHash("sha256");
  for(const buf of list) {
    ctx.update(buf)
  }
  return ctx.digest()
}

// TODO move to util
function min_bn(a: bigint, b: bigint): bigint {
  return (a < b) ? a : b;
}
function max_bn(a: bigint, b: bigint): bigint {
  return (a > b) ? a : b;
}

function buf2bn(buf: Buffer):bigint {
  let hex = buf.toString("hex").padStart(2, "0")
  if (hex.length % 2 === 1) {
    hex = `0${hex}`;
  }
  return BigInt(`0x${hex}`);
}

export type Chunk_json = {
  tx_path   : string;
  data_path : string;
  chunk     : string;
  packing   : string;
}
export type Chunk = {
  tx_path   : Buffer;
  data_path : Buffer;
  chunk     : Buffer;
  packing   : "unpacked" | "spora_2_5";
}

export function chunk_from_json(chunk_json: Chunk_json): Chunk {
  const tx_path = base64url.unpack(chunk_json.tx_path);
  const data_path = base64url.unpack(chunk_json.data_path);
  const chunk = base64url.unpack(chunk_json.chunk);
  const packing = chunk_json.packing;
  if (packing !== "unpacked" && packing !== "spora_2_5") {
    throw new Error(`unknown packing ${packing}`);
  }
  return {
    tx_path,
    data_path,
    chunk,
    packing
  }
}

export type Validate_tx_path_res = {
  data_root : Buffer;
  tx_start  : bigint;
  tx_end    : bigint;
  recall_bucket_offset : bigint;
}

export type Validate_data_path_res = {
  chunk_size  : bigint;
  offset_diff : bigint;
}

export type Validate_res = {
  root  : Buffer;
  start : bigint;
  end   : bigint;
}

export const default_strict_data_split_threshold= BigInt("30607159107830");
export const DATA_CHUNK_SIZE_BN = BigInt(256*1024);
export const HASH_SIZE = 32
export const NOTE_SIZE = 32


export function validate_tx_path(tx_path: Buffer, _chunk_offset: bigint, block_index3: Block_index3, strict_data_split_threshold: bigint = default_strict_data_split_threshold): Validate_tx_path_res | undefined {
  let chunk_offset = _chunk_offset;
  const block_index_entity = block_index3.get_by_chunk_offset_full(chunk_offset)
  if (!block_index_entity) {
    throw new Error(`no block_index_entity for chunk_offset ${chunk_offset}`);
  }
  if (chunk_offset >= strict_data_split_threshold) {
    const diff = chunk_offset - strict_data_split_threshold
    chunk_offset = strict_data_split_threshold + (diff / DATA_CHUNK_SIZE_BN) * DATA_CHUNK_SIZE_BN
  }
  
  const recall_bucket_offset = chunk_offset - block_index_entity.weave_size
  const ret = validate_path(block_index_entity.tx_root, recall_bucket_offset, block_index_entity.block_size, tx_path);
  if (!ret) {
    return undefined;
  }
  
  return {
    data_root : ret.root,
    tx_start  : ret.start,
    tx_end    : ret.end,
    recall_bucket_offset
  };
}

export function validate_data_path(data_path: Buffer, val_res: Validate_tx_path_res): Validate_data_path_res | undefined {
  const tx_size = val_res.tx_end - val_res.tx_start;
  const recall_chunk_offset = val_res.recall_bucket_offset - val_res.tx_start;
  const ret = validate_path(val_res.data_root, recall_chunk_offset, tx_size, data_path);
  if (!ret) {
    return undefined;
  }
  return {
    chunk_size  : ret.end - ret.start,
    offset_diff : ret.start - recall_chunk_offset
  }
}

export function validate_path(root: Buffer, _offset: bigint, block_size: bigint, any_path: Buffer): Validate_res | undefined {
  let offset = _offset;
  if (block_size <= 0) {
    return undefined
  }
  if (offset >= block_size) {
    offset = block_size - BigInt(1);
  }
  if (offset < 0) {
    offset = BigInt(0)
  }
  const left = BigInt(0)
  const right = block_size
  return _validate_path_lr(root, offset, left, right, any_path);
}

// TODO tx_path/root -> any_path/root
function _validate_path_lr(tx_root: Buffer, offset: bigint, left: bigint, right: bigint, tx_path: Buffer): Validate_res | undefined {
  if (tx_path.length === HASH_SIZE + NOTE_SIZE) {
    const data = tx_path.slice(0, HASH_SIZE)
    const note = tx_path.slice(HASH_SIZE);
    const expd_id = sha256_list([sha256(data), sha256(note)]);
    
    if (!tx_root.equals(expd_id)) {
      return undefined;
    }
    const note_bn = buf2bn(note);
    return {
      root  : data,
      start : left,
      end   : max_bn(min_bn(right, note_bn), left + BigInt(1))
    }
  } else {
    const L   = tx_path.slice(0, HASH_SIZE)
    const R   = tx_path.slice(HASH_SIZE, 2*HASH_SIZE)
    const note= tx_path.slice(2*HASH_SIZE, 2*HASH_SIZE + NOTE_SIZE)
    const rest= tx_path.slice(2*HASH_SIZE + NOTE_SIZE)
    const expd_id = sha256_list([
      sha256(L),
      sha256(R),
      sha256(note)
    ]);
    if (!tx_root.equals(expd_id)) {
      return undefined;
    }
    
    const note_bn = buf2bn(note);
    if (offset < note_bn) {
      return _validate_path_lr(L, offset, left, min_bn(right, note_bn), rest)
    } else {
      return _validate_path_lr(R, offset, max_bn(left, note_bn), right, rest)
    }
  }
}
