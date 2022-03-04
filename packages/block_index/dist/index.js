"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Block_index3_json_manager = exports.Block_index3_json = exports.Block_index3 = exports.Block_index = void 0;
var axios_1 = __importDefault(require("axios"));
var fs_1 = __importDefault(require("fs"));
var promises_1 = __importDefault(require("fs/promises"));
var base64url = __importStar(require("base64url"));
var Block_index = /** @class */ (function () {
    function Block_index() {
    }
    return Block_index;
}());
exports.Block_index = Block_index;
// 3 means indep_hash, weave_size, tx_root
var Block_index3 = /** @class */ (function (_super) {
    __extends(Block_index3, _super);
    function Block_index3() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Block_index3;
}(Block_index));
exports.Block_index3 = Block_index3;
// save_other_type for other implementations
// convert_other_type for other implementations
// partial block index - just other implementation
function orig_format3_json_check(json) {
    if (!(json instanceof Array)) {
        throw new Error("!(json instanceof Array)");
    }
    if (json.length) {
        for (var i = 0, len = json.length; i < len; i++) {
            var el = json[i];
            if (typeof el.tx_root !== "string") {
                throw new Error("typeof json[".concat(i, "].tx_root !== string"));
            }
            if (typeof el.weave_size !== "string") {
                throw new Error("typeof json[".concat(i, "].weave_size !== string"));
            }
            if (typeof el.hash !== "string") {
                throw new Error("typeof json[".concat(i, "].hash !== string"));
            }
            // NOTE. empty tx_root is also ok
            if (el.tx_root !== "") {
                if (!/^[-_a-z0-9]{43}$/i.test(el.tx_root)) {
                    throw new Error("json[".concat(i, "].tx_root is not base64url with length 43"));
                }
            }
            if (!/^\d+$/.test(el.weave_size)) {
                throw new Error("json[".concat(i, "].weave_size is not decimal"));
            }
            if (!/^[-_a-z0-9]{64}$/i.test(el.hash)) {
                throw new Error("json[".concat(i, "].hash is not base64url with length 64"));
            }
        }
        var prev_weave_size = BigInt(json[json.length - 1].weave_size);
        for (var i = json.length - 2; i >= 0; i--) {
            var el = json[i];
            var weave_size = BigInt(el.weave_size);
            if (prev_weave_size > weave_size) {
                throw new Error("json[".concat(i, "] prev_weave_size > weave_size; ").concat(prev_weave_size, " > ").concat(weave_size));
            }
            prev_weave_size = weave_size;
        }
    }
}
var Block_index3_json = /** @class */ (function (_super) {
    __extends(Block_index3_json, _super);
    function Block_index3_json() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // NOTE 0 is last block
        _this.block_list = [];
        // for binary search
        _this.chunk_offset_a = BigInt(0);
        _this.chunk_offset_b = BigInt(0);
        return _this;
    }
    Block_index3_json.prototype.load_from_original_format = function (json) {
        orig_format3_json_check(json);
        this.block_list = json;
        this.chunk_offset_a = BigInt(this.block_list[this.block_list.length - 1].weave_size);
        this.chunk_offset_b = BigInt(this.block_list[0].weave_size);
    };
    Block_index3_json.prototype.get_by_height_full = function (height) {
        var idx = this.block_list.length - height - 1;
        var block_index_entity = this.block_list[idx];
        if (!block_index_entity) {
            return undefined;
        }
        var prev_block_index_entity = this.block_list[idx + 1];
        var weave_size = BigInt(block_index_entity.weave_size);
        var prev_weave_size = BigInt(0);
        if (prev_block_index_entity) {
            prev_weave_size = BigInt(prev_block_index_entity.weave_size);
        }
        return {
            indep_hash: base64url.unpack(block_index_entity.hash),
            weave_size: weave_size,
            tx_root: base64url.unpack(block_index_entity.tx_root),
            block_size: weave_size - prev_weave_size
        };
    };
    Block_index3_json.prototype.get_by_height_indep_hash = function (height) {
        var block_index_entity = this.block_list[this.block_list.length - height - 1];
        if (!block_index_entity) {
            return undefined;
        }
        return base64url.unpack(block_index_entity.hash);
    };
    Block_index3_json.prototype.get_by_height_weave_size = function (height) {
        var block_index_entity = this.block_list[this.block_list.length - height - 1];
        if (!block_index_entity) {
            return undefined;
        }
        return BigInt(block_index_entity.weave_size);
    };
    Block_index3_json.prototype.get_by_height_tx_root = function (height) {
        var block_index_entity = this.block_list[this.block_list.length - height - 1];
        if (!block_index_entity) {
            return undefined;
        }
        return base64url.unpack(block_index_entity.tx_root);
    };
    Block_index3_json.prototype.get_by_height_indep_hash_orig = function (height) {
        var _a;
        return (_a = this.block_list[this.block_list.length - height - 1]) === null || _a === void 0 ? void 0 : _a.hash;
    };
    Block_index3_json.prototype.get_by_height_weave_size_orig = function (height) {
        var _a;
        return (_a = this.block_list[this.block_list.length - height - 1]) === null || _a === void 0 ? void 0 : _a.weave_size;
    };
    Block_index3_json.prototype.get_by_height_tx_root_orig = function (height) {
        var _a;
        return (_a = this.block_list[this.block_list.length - height - 1]) === null || _a === void 0 ? void 0 : _a.tx_root;
    };
    Block_index3_json.prototype._get_block_idx_by_chunk_offset = function (chunk_offset) {
        if (this.chunk_offset_a > chunk_offset)
            return undefined;
        if (this.chunk_offset_b < chunk_offset)
            return undefined;
        var block_list = this.block_list;
        var co_a = this.chunk_offset_a;
        var co_b = this.chunk_offset_b;
        var last_idx = block_list.length - 1;
        var idx_a = last_idx;
        var idx_b = 0;
        var idx_c = Math.floor((idx_b + idx_a) / 2);
        var co_c = BigInt(block_list[idx_c].weave_size);
        var ret_block_idx = 0;
        while (true) {
            if (co_c === chunk_offset) {
                // need get prev block
                ret_block_idx = idx_c - 1;
                break;
            }
            if (idx_c === idx_b) {
                ret_block_idx = idx_b;
                break;
            }
            if (co_c > chunk_offset) {
                idx_b = idx_c;
                idx_c = Math.floor((idx_b + idx_a) / 2);
            }
            else {
                idx_a = idx_c;
                idx_c = Math.floor((idx_b + idx_a) / 2);
            }
            co_c = BigInt(block_list[idx_c].weave_size);
        }
        // TODO rework with refined index without gaps
        var ret = block_list[ret_block_idx];
        while (ret_block_idx < last_idx) {
            var probe_block = block_list[ret_block_idx + 1];
            if (ret.weave_size !== probe_block.weave_size) {
                break;
            }
            ret_block_idx++;
            ret = probe_block;
        }
        return {
            idx: ret_block_idx,
            block: ret
        };
    };
    Block_index3_json.prototype.get_by_chunk_offset_full = function (chunk_offset) {
        var ret = this._get_block_idx_by_chunk_offset(chunk_offset);
        if (!ret) {
            return undefined;
        }
        var block_index_entity = ret.block;
        var prev_block_index_entity = this.block_list[ret.idx + 1];
        var weave_size = BigInt(block_index_entity.weave_size);
        var prev_weave_size = BigInt(0);
        if (prev_block_index_entity) {
            prev_weave_size = BigInt(prev_block_index_entity.weave_size);
        }
        return {
            indep_hash: base64url.unpack(block_index_entity.hash),
            weave_size: weave_size,
            tx_root: base64url.unpack(block_index_entity.tx_root),
            block_size: weave_size - prev_weave_size
        };
    };
    Block_index3_json.prototype.get_by_chunk_offset_indep_hash = function (chunk_offset) {
        var ret = this._get_block_idx_by_chunk_offset(chunk_offset);
        if (!ret) {
            return undefined;
        }
        var block_index_entity = ret.block;
        return base64url.unpack(block_index_entity.hash);
    };
    Block_index3_json.prototype.get_by_chunk_offset_weave_size = function (chunk_offset) {
        var ret = this._get_block_idx_by_chunk_offset(chunk_offset);
        if (!ret) {
            return undefined;
        }
        var block_index_entity = ret.block;
        return BigInt(block_index_entity.weave_size);
    };
    Block_index3_json.prototype.get_by_chunk_offset_tx_root = function (chunk_offset) {
        var ret = this._get_block_idx_by_chunk_offset(chunk_offset);
        if (!ret) {
            return undefined;
        }
        var block_index_entity = ret.block;
        return base64url.unpack(block_index_entity.tx_root);
    };
    Block_index3_json.prototype.get_by_chunk_offset_indep_hash_orig = function (chunk_offset) {
        var ret = this._get_block_idx_by_chunk_offset(chunk_offset);
        if (!ret) {
            return undefined;
        }
        var block_index_entity = ret.block;
        return block_index_entity.hash;
    };
    Block_index3_json.prototype.get_by_chunk_offset_weave_size_orig = function (chunk_offset) {
        var ret = this._get_block_idx_by_chunk_offset(chunk_offset);
        if (!ret) {
            return undefined;
        }
        var block_index_entity = ret.block;
        return block_index_entity.weave_size;
    };
    Block_index3_json.prototype.get_by_chunk_offset_tx_root_orig = function (chunk_offset) {
        var ret = this._get_block_idx_by_chunk_offset(chunk_offset);
        if (!ret) {
            return undefined;
        }
        var block_index_entity = ret.block;
        return block_index_entity.tx_root;
    };
    return Block_index3_json;
}(Block_index3));
exports.Block_index3_json = Block_index3_json;
// NOTE. block 0 does NOT have weave_size 0
// TODO fix it LATER
var Block_index3_json_manager = /** @class */ (function () {
    function Block_index3_json_manager() {
    }
    Block_index3_json_manager.save = function (block_index, path) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, promises_1["default"].writeFile(path, JSON.stringify(block_index.block_list))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Block_index3_json_manager.load = function (block_index, path) {
        return __awaiter(this, void 0, void 0, function () {
            var cont;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, promises_1["default"].readFile(path, "utf8")];
                    case 1:
                        cont = _a.sent();
                        block_index.load_from_original_format(JSON.parse(cont));
                        return [2 /*return*/];
                }
            });
        });
    };
    Block_index3_json_manager.save_sync = function (block_index, path) {
        fs_1["default"].writeFileSync(path, JSON.stringify(block_index.block_list));
    };
    Block_index3_json_manager.load_sync = function (block_index, path) {
        var cont = fs_1["default"].readFileSync(path, "utf8");
        block_index.load_from_original_format(JSON.parse(cont));
    };
    Block_index3_json_manager.download = function (peer_url_list) {
        return __awaiter(this, void 0, void 0, function () {
            var block_index, axios_opt, last_err, i, len, perr_url, res, json, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        block_index = new Block_index3_json();
                        axios_opt = {
                            timeout: 60000,
                            // responseType : "arraybuffer",
                            // typescript...
                            responseType: "arraybuffer"
                        };
                        last_err = null;
                        i = 0, len = peer_url_list.length;
                        _a.label = 1;
                    case 1:
                        if (!(i < len)) return [3 /*break*/, 6];
                        perr_url = peer_url_list[i];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, axios_1["default"].get("".concat(perr_url, "/block_index"), axios_opt)];
                    case 3:
                        res = _a.sent();
                        json = JSON.parse(res.data);
                        block_index.load_from_original_format(json);
                        return [2 /*return*/, block_index];
                    case 4:
                        err_1 = _a.sent();
                        last_err = err_1;
                        return [3 /*break*/, 5];
                    case 5:
                        i++;
                        return [3 /*break*/, 1];
                    case 6: throw last_err;
                }
            });
        });
    };
    return Block_index3_json_manager;
}());
exports.Block_index3_json_manager = Block_index3_json_manager;
// TODO Block_index3_compact. Use Buffer instead of JSON (less disk use, less memory use)
// TODO Block_index3_compact_prune. Use only blocks with block_size (difference in weave_size with prev)
// TODO Block_index3_compact_prune_split. weave_size is stored in separate Buffer (and separate file). Loaded as BigInt list. This will cause better CPU cache use
// TODO Block_index3_compact_prune_split_napi. Nodejs only, weave_size is not loaded as BigInt list, napi accelerated search function is used (no extra BigInt allocation, even better cache use, more performance, because no BigInt overhead)
// TODO Block_index3_compact_prune_split_wasm. For potential browser use
