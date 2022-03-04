import { Block_index3_json_manager, Block_index3_json } from "block_index";
import { chunk_from_json, validate_tx_path, validate_data_path, Chunk } from "..";
import fs from "fs";

describe("chunk validate", () => {
  const index = new Block_index3_json();
  it("load", async () => {
    await Block_index3_json_manager.load(index, __dirname+"/../../../block_index/src/__tests__/block_index_slice");
  });
  let chunk1_unpacked : Chunk | undefined;
  let chunk2_unpacked : Chunk | undefined;
  let chunk1_offset = BigInt(1);
  let chunk2_offset = BigInt(599059);
  it("chunk_from_json", async () => {
    {
      const chunk_json = JSON.parse(fs.readFileSync(__dirname+`/chunk_${chunk1_offset}.json`, "utf8"));
      chunk1_unpacked = chunk_from_json(chunk_json as any);
    }
    {
      const chunk_json = JSON.parse(fs.readFileSync(__dirname+`/chunk_${chunk2_offset}.json`, "utf8"));
      chunk2_unpacked = chunk_from_json(chunk_json as any);
    }
  });
  it("validate_tx_path", async () => {
    {
      const tx_val_res = validate_tx_path(chunk1_unpacked!.tx_path, chunk1_offset, index);
      
      if (!tx_val_res) {
        throw new Error("!tx_val_res")
      }
      expect(tx_val_res).toMatchObject({
        data_root: Buffer.from("92e30b39224a1bb3b836648163d299d8f8d4fb93b850134597ffa417d1675bbc", "hex"),
        tx_start: BigInt(0),
        tx_end: BigInt(599058),
        recall_bucket_offset: BigInt(-599057) // it's ok for block 0
      })
    }
    {
      const tx_val_res = validate_tx_path(chunk2_unpacked!.tx_path, chunk2_offset, index);
      
      if (!tx_val_res) {
        throw new Error("!tx_val_res")
      }
      expect(tx_val_res).toMatchObject({
        data_root: Buffer.from("9f218f077d0532ad81c7b4d135722797aaca1523785b99daf51c9ca466d3e480", "hex"),
        tx_start: BigInt(0),
        tx_end: BigInt(439971),
        recall_bucket_offset: BigInt(-439970) // it's NOT ok for block N
      })
    }
  });
  it("validate_data_path", async () => {
    {
      const tx_val_res = validate_tx_path(chunk1_unpacked!.tx_path, chunk1_offset, index);
      if (!tx_val_res) {
        throw new Error("!tx_val_res")
      }
      const data_val_res = validate_data_path(chunk1_unpacked!.data_path, tx_val_res);
      if (!data_val_res) {
        throw new Error("!data_val_res")
      }
      expect(data_val_res).toMatchObject({
        chunk_size: BigInt(262144),
        offset_diff: BigInt(599057)
      })
    }
    {
      const tx_val_res = validate_tx_path(chunk2_unpacked!.tx_path, chunk2_offset, index);
      if (!tx_val_res) {
        throw new Error("!tx_val_res")
      }
      const data_val_res = validate_data_path(chunk2_unpacked!.data_path, tx_val_res);
      if (!data_val_res) {
        throw new Error("!data_val_res")
      }
      console.log(data_val_res);
      expect(data_val_res).toMatchObject({
        chunk_size: BigInt(262144),
        offset_diff: BigInt(439970)
      })
    }
  });
});
