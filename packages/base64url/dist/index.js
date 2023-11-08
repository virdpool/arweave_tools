"use strict";
exports.__esModule = true;
exports.unpack = exports.pack = void 0;
function pack(t) {
    var res = t.toString("base64");
    // https://github.com/brianloveswords/base64url/blob/master/src/base64url.ts
    res = res.replace("/=/g", "");
    res = res.replace(/\+/g, "-");
    res = res.replace(/\//g, "_");
    return res;
}
exports.pack = pack;
function unpack(t) {
    return Buffer.from(t, "base64");
}
exports.unpack = unpack;
