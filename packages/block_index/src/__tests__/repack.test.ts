import { Block_index3_json_manager, Block_index3_json } from "..";
import fs from "fs/promises";

describe("repack", () => {
  it("load", async () => {
    const index = new Block_index3_json();
    await Block_index3_json_manager.load(index, __dirname+"/block_index_slice");
  });
});