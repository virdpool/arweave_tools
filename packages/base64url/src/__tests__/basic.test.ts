import { pack, unpack } from "..";

describe("base64url", () => {
  it("unpack", async () => {
    const real = unpack("aDZDgFX-prCtvJX1_OJtqw3q3vEVUhSEx2j9JAFvr8x4yXuAcNAa4b8VhhBXnpF9")
    const expd = Buffer.from("6836438055fea6b0adbc95f5fce26dab0deadef115521484c768fd24016fafcc78c97b8070d01ae1bf158610579e917d", "hex")
    expect(real.equals(expd)).toBe(true)
  });
  it("pack", async () => {
    const buf = Buffer.from("6836438055fea6b0adbc95f5fce26dab0deadef115521484c768fd24016fafcc78c97b8070d01ae1bf158610579e917d", "hex")
    const real = pack(buf);
    const expd = "aDZDgFX-prCtvJX1_OJtqw3q3vEVUhSEx2j9JAFvr8x4yXuAcNAa4b8VhhBXnpF9";
    expect(real).toBe(expd)
  });
  it("unpack pack", async () => {
    const str = "aDZDgFX-prCtvJX1_OJtqw3q3vEVUhSEx2j9JAFvr8x4yXuAcNAa4b8VhhBXnpF9";
    expect(pack(unpack(str))).toBe(str);
  });
  it("pack unpack", async () => {
    const buf = Buffer.from("6836438055fea6b0adbc95f5fce26dab0deadef115521484c768fd24016fafcc78c97b8070d01ae1bf158610579e917d", "hex");
    expect(unpack(pack(buf)).equals(buf)).toBe(true);
  });
});
