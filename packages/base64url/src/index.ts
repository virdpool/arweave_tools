export function pack(t:Buffer):string {
  let res = t.toString("base64")
  
  // https://github.com/brianloveswords/base64url/blob/master/src/base64url.ts
  res = res.replace(`/=/g`, "")
  res = res.replace(/\+/g, "-")
  res = res.replace(/\//g, "_")
  return res;
}

export function unpack(t:string):Buffer {
  return Buffer.from(t, "base64")
}
