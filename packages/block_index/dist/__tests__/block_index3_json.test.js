"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
/**
 * @jest-environment node
 */
// this stupid stuff is required for bypass `Error: Cross origin http://localhost forbidden`
var __1 = require("..");
var fs_1 = __importDefault(require("fs"));
var express_1 = __importDefault(require("express"));
var port = 1338;
if (process.env.TEST_PORT) {
    port = +process.env.TEST_PORT;
}
describe("Block_index3_json", function () {
    var block_0_orig = {
        tx_root: "P_OiqMNN1s4ltcaq0HXb9VFos_Zz6LFjM8ogUG0vJek",
        weave_size: "0",
        hash: "7wIU7KolICAjClMlcZ38LZzshhI7xGkm2tDCJR7Wvhe3ESUo2-Z4-y0x1uaglRJE"
    };
    var block_4307 = {
        tx_root: Buffer.alloc(0),
        weave_size: BigInt("1039029"),
        indep_hash: Buffer.from("d2e29cba8a21555fd957dd4277be8f6db4fc77cff30a7086c22811b6f2758406ba056d11cea3e7e0e392bfcd166d1173", "hex")
    };
    var block_4307_orig = {
        tx_root: "",
        weave_size: "1039029",
        hash: "0uKcuoohVV_ZV91Cd76PbbT8d8_zCnCGwigRtvJ1hAa6BW0RzqPn4OOSv80WbRFz"
    };
    var block_0 = {
        tx_root: Buffer.alloc(0),
        weave_size: BigInt("1039029"),
        indep_hash: Buffer.from("d2e29cba8a21555fd957dd4277be8f6db4fc77cff30a7086c22811b6f2758406ba056d11cea3e7e0e392bfcd166d1173", "hex")
    };
    var index = new __1.Block_index3_json();
    it("load", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, __1.Block_index3_json_manager.load(index, __dirname + "/block_index_slice")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("save", function () { return __awaiter(void 0, void 0, void 0, function () {
        var target_file, buf1, buf2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    target_file = __dirname + "/block_index_slice_re";
                    if (fs_1["default"].existsSync(target_file)) {
                        fs_1["default"].unlinkSync(target_file);
                    }
                    return [4 /*yield*/, __1.Block_index3_json_manager.save(index, target_file)];
                case 1:
                    _a.sent();
                    expect(fs_1["default"].existsSync(target_file)).toBe(true);
                    buf1 = fs_1["default"].readFileSync(__dirname + "/block_index_slice");
                    buf2 = fs_1["default"].readFileSync(target_file);
                    expect(buf1.equals(buf2)).toBe(true);
                    fs_1["default"].unlinkSync(target_file);
                    return [2 /*return*/];
            }
        });
    }); });
    it("load_sync", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, __1.Block_index3_json_manager.load_sync(index, __dirname + "/block_index_slice")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("save_sync", function () {
        var target_file = __dirname + "/block_index_slice_re";
        if (fs_1["default"].existsSync(target_file)) {
            fs_1["default"].unlinkSync(target_file);
        }
        __1.Block_index3_json_manager.save_sync(index, target_file);
        expect(fs_1["default"].existsSync(target_file)).toBe(true);
        var buf1 = fs_1["default"].readFileSync(__dirname + "/block_index_slice");
        var buf2 = fs_1["default"].readFileSync(target_file);
        expect(buf1.equals(buf2)).toBe(true);
        fs_1["default"].unlinkSync(target_file);
    });
    var app;
    var server;
    it("test express start", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    try {
                        app = (0, express_1["default"])();
                        app.use('/block_index', express_1["default"].static(__dirname + "/block_index_slice"));
                        server = app.listen(port, function () {
                            resolve();
                            // setTimeout(resolve, 10000);
                        });
                    }
                    catch (err) {
                        reject(err);
                    }
                })];
        });
    }); });
    it("download", function () { return __awaiter(void 0, void 0, void 0, function () {
        var index;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, __1.Block_index3_json_manager.download(["http://localhost:".concat(port)])];
                case 1:
                    index = _a.sent();
                    expect(index.block_list[4307]).toMatchObject(block_0_orig);
                    expect(index.block_list[0]).toMatchObject(block_4307_orig);
                    return [2 /*return*/];
            }
        });
    }); });
    it("good download 2", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, __1.Block_index3_json_manager.download(["http://localhost:".concat(port + 1), "http://localhost:".concat(port)])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    // NOTE. expect(fn).rejects.toThrow doesn't cover properly
    it("bad download", function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, __1.Block_index3_json_manager.download(["http://localhost:".concat(port + 1), "http://localhost:".concat(port + 2)])];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    expect(err_1.message).toBe("connect ECONNREFUSED 127.0.0.1:".concat(port + 2));
                    return [2 /*return*/];
                case 3: throw new Error("error expected");
            }
        });
    }); });
    it("test express stop", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    server.close(function (err) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve();
                        }
                    });
                })];
        });
    }); });
    it("get_by_height_full", function () {
        expect(index.get_by_height_full(-1)).toBe(undefined);
        expect(index.get_by_height_full(4308)).toBe(undefined);
        expect(index.get_by_height_full(4307)).toMatchObject(block_4307);
    });
    it("get_by_height_indep_hash", function () {
        expect(index.get_by_height_indep_hash(-1)).toBe(undefined);
        expect(index.get_by_height_indep_hash(4308)).toBe(undefined);
        expect(index.get_by_height_indep_hash(4307)).toMatchObject(block_4307.indep_hash);
    });
    it("get_by_height_weave_size", function () {
        expect(index.get_by_height_weave_size(-1)).toBe(undefined);
        expect(index.get_by_height_weave_size(4308)).toBe(undefined);
        expect(index.get_by_height_weave_size(4307)).toBe(block_4307.weave_size);
    });
    it("get_by_height_tx_root", function () {
        expect(index.get_by_height_tx_root(-1)).toBe(undefined);
        expect(index.get_by_height_tx_root(4308)).toBe(undefined);
        expect(index.get_by_height_tx_root(4307)).toMatchObject(block_4307.tx_root);
    });
    it("get_by_height_indep_hash_orig", function () {
        expect(index.get_by_height_indep_hash_orig(-1)).toBe(undefined);
        expect(index.get_by_height_indep_hash_orig(4308)).toBe(undefined);
        expect(index.get_by_height_indep_hash_orig(4307)).toBe(block_4307_orig.hash);
    });
    it("get_by_height_weave_size_orig", function () {
        expect(index.get_by_height_weave_size_orig(-1)).toBe(undefined);
        expect(index.get_by_height_weave_size_orig(4308)).toBe(undefined);
        expect(index.get_by_height_weave_size_orig(4307)).toBe(block_4307_orig.weave_size);
    });
    it("get_by_height_tx_root_orig", function () {
        expect(index.get_by_height_tx_root_orig(-1)).toBe(undefined);
        expect(index.get_by_height_tx_root_orig(4308)).toBe(undefined);
        expect(index.get_by_height_tx_root_orig(4307)).toBe(block_4307_orig.tx_root);
    });
    it("_get_block_idx_by_chunk_offset", function () {
        expect(index._get_block_idx_by_chunk_offset(BigInt(-1))).toBe(undefined);
        expect(index._get_block_idx_by_chunk_offset(BigInt(1039029 + 1))).toBe(undefined);
        var fn = function (idx) {
            return {
                idx: idx,
                block: index.block_list[idx]
            };
        };
        expect(index._get_block_idx_by_chunk_offset(BigInt(1039029))).toMatchObject(fn(780));
        expect(index._get_block_idx_by_chunk_offset(BigInt(0))).toMatchObject(fn(4307));
        expect(index._get_block_idx_by_chunk_offset(BigInt(1))).toMatchObject(fn(4225));
        expect(index._get_block_idx_by_chunk_offset(BigInt(599058 - 1))).toMatchObject(fn(4225));
        expect(index._get_block_idx_by_chunk_offset(BigInt(599058))).toMatchObject(fn(4225));
        expect(index._get_block_idx_by_chunk_offset(BigInt(599058 + 1))).toMatchObject(fn(780));
    });
    var block_780 = {
        tx_root: Buffer.from("fa8a00c99511e3d853e407d745ca32ab4002e4b0f2437717ba4e64a11a0f2016", "hex"),
        weave_size: BigInt("1039029"),
        indep_hash: Buffer.from("dbe155af0929bbe7e7df2e3de61d81870dcc4b9261a5830041cffc0b591ef70845c01d53f9a8dd6f6023936896124d2a", "hex")
    };
    var block_780_orig = {
        tx_root: "-ooAyZUR49hT5AfXRcoyq0AC5LDyQ3cXuk5koRoPIBY",
        weave_size: "1039029",
        indep_hash: "2-FVrwkpu-fn3y495h2Bhw3MS5JhpYMAQc_8C1ke9whFwB1T-ajdb2Ajk2iWEk0q"
    };
    it("get_by_chunk_offset_full", function () {
        expect(index.get_by_chunk_offset_full(BigInt(-1))).toBe(undefined);
        expect(index.get_by_chunk_offset_full(BigInt(1039029))).toMatchObject(block_780);
    });
    it("get_by_chunk_offset_indep_hash", function () {
        expect(index.get_by_chunk_offset_indep_hash(BigInt(-1))).toBe(undefined);
        expect(index.get_by_chunk_offset_indep_hash(BigInt(1039029))).toMatchObject(block_780.indep_hash);
    });
    it("get_by_chunk_offset_weave_size", function () {
        expect(index.get_by_chunk_offset_weave_size(BigInt(-1))).toBe(undefined);
        expect(index.get_by_chunk_offset_weave_size(BigInt(1039029))).toBe(block_780.weave_size);
    });
    it("get_by_chunk_offset_tx_root", function () {
        expect(index.get_by_chunk_offset_tx_root(BigInt(-1))).toBe(undefined);
        expect(index.get_by_chunk_offset_tx_root(BigInt(1039029))).toMatchObject(block_780.tx_root);
    });
    it("get_by_chunk_offset_indep_hash_orig", function () {
        expect(index.get_by_chunk_offset_indep_hash_orig(BigInt(-1))).toBe(undefined);
        expect(index.get_by_chunk_offset_indep_hash_orig(BigInt(1039029))).toBe(block_780_orig.indep_hash);
    });
    it("get_by_chunk_offset_weave_size_orig", function () {
        expect(index.get_by_chunk_offset_weave_size_orig(BigInt(-1))).toBe(undefined);
        expect(index.get_by_chunk_offset_weave_size_orig(BigInt(1039029))).toBe(block_780_orig.weave_size);
    });
    it("get_by_chunk_offset_tx_root_orig", function () {
        expect(index.get_by_chunk_offset_tx_root_orig(BigInt(-1))).toBe(undefined);
        expect(index.get_by_chunk_offset_tx_root_orig(BigInt(1039029))).toBe(block_780_orig.tx_root);
    });
    var good_ent = block_0_orig;
    it("orig_format3_json_check not array", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            expect(function () { return index.load_from_original_format(1); }).toThrow("!(json instanceof Array)");
            return [2 /*return*/];
        });
    }); });
    it("orig_format3_json_check !tx_root string", function () { return __awaiter(void 0, void 0, void 0, function () {
        var bad_ent;
        return __generator(this, function (_a) {
            bad_ent = Object.assign({}, good_ent);
            delete bad_ent.tx_root;
            expect(function () { return index.load_from_original_format([bad_ent]); }).toThrow("typeof json[0].tx_root !== string");
            return [2 /*return*/];
        });
    }); });
    it("orig_format3_json_check !weave_size string", function () { return __awaiter(void 0, void 0, void 0, function () {
        var bad_ent;
        return __generator(this, function (_a) {
            bad_ent = Object.assign({}, good_ent);
            delete bad_ent.weave_size;
            expect(function () { return index.load_from_original_format([bad_ent]); }).toThrow("typeof json[0].weave_size !== string");
            return [2 /*return*/];
        });
    }); });
    it("orig_format3_json_check !hash  string", function () { return __awaiter(void 0, void 0, void 0, function () {
        var bad_ent;
        return __generator(this, function (_a) {
            bad_ent = Object.assign({}, good_ent);
            delete bad_ent.hash;
            expect(function () { return index.load_from_original_format([bad_ent]); }).toThrow("typeof json[0].hash !== string");
            return [2 /*return*/];
        });
    }); });
    it("orig_format3_json_check bad tx_root len", function () { return __awaiter(void 0, void 0, void 0, function () {
        var bad_ent;
        return __generator(this, function (_a) {
            bad_ent = Object.assign({}, good_ent);
            bad_ent.tx_root = "wtf";
            expect(function () { return index.load_from_original_format([bad_ent]); }).toThrow("json[0].tx_root is not base64url with length 43");
            return [2 /*return*/];
        });
    }); });
    it("orig_format3_json_check bad weave_size", function () { return __awaiter(void 0, void 0, void 0, function () {
        var bad_ent;
        return __generator(this, function (_a) {
            bad_ent = Object.assign({}, good_ent);
            bad_ent.weave_size = "wtf";
            expect(function () { return index.load_from_original_format([bad_ent]); }).toThrow("json[0].weave_size is not decimal");
            return [2 /*return*/];
        });
    }); });
    it("orig_format3_json_check bad hash len", function () { return __awaiter(void 0, void 0, void 0, function () {
        var bad_ent;
        return __generator(this, function (_a) {
            bad_ent = Object.assign({}, good_ent);
            bad_ent.hash = "wtf";
            expect(function () { return index.load_from_original_format([bad_ent]); }).toThrow("json[0].hash is not base64url with length 64");
            return [2 /*return*/];
        });
    }); });
    it("orig_format3_json_check bad weave_size order", function () { return __awaiter(void 0, void 0, void 0, function () {
        var bad_ent;
        return __generator(this, function (_a) {
            bad_ent = Object.assign({}, good_ent);
            bad_ent.weave_size = "1";
            expect(function () { return index.load_from_original_format([good_ent, bad_ent]); }).toThrow("json[0] prev_weave_size > weave_size; 1 > 0");
            return [2 /*return*/];
        });
    }); });
});
