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
exports.__esModule = true;
var __1 = require("..");
describe("base64url", function () {
    it("unpack", function () { return __awaiter(void 0, void 0, void 0, function () {
        var real, expd;
        return __generator(this, function (_a) {
            real = (0, __1.unpack)("aDZDgFX-prCtvJX1_OJtqw3q3vEVUhSEx2j9JAFvr8x4yXuAcNAa4b8VhhBXnpF9");
            expd = Buffer.from("6836438055fea6b0adbc95f5fce26dab0deadef115521484c768fd24016fafcc78c97b8070d01ae1bf158610579e917d", "hex");
            expect(real.equals(expd)).toBe(true);
            return [2 /*return*/];
        });
    }); });
    it("pack", function () { return __awaiter(void 0, void 0, void 0, function () {
        var buf, real, expd;
        return __generator(this, function (_a) {
            buf = Buffer.from("6836438055fea6b0adbc95f5fce26dab0deadef115521484c768fd24016fafcc78c97b8070d01ae1bf158610579e917d", "hex");
            real = (0, __1.pack)(buf);
            expd = "aDZDgFX-prCtvJX1_OJtqw3q3vEVUhSEx2j9JAFvr8x4yXuAcNAa4b8VhhBXnpF9";
            expect(real).toBe(expd);
            return [2 /*return*/];
        });
    }); });
    it("unpack pack", function () { return __awaiter(void 0, void 0, void 0, function () {
        var str;
        return __generator(this, function (_a) {
            str = "aDZDgFX-prCtvJX1_OJtqw3q3vEVUhSEx2j9JAFvr8x4yXuAcNAa4b8VhhBXnpF9";
            expect((0, __1.pack)((0, __1.unpack)(str))).toBe(str);
            return [2 /*return*/];
        });
    }); });
    it("pack unpack", function () { return __awaiter(void 0, void 0, void 0, function () {
        var buf;
        return __generator(this, function (_a) {
            buf = Buffer.from("6836438055fea6b0adbc95f5fce26dab0deadef115521484c768fd24016fafcc78c97b8070d01ae1bf158610579e917d", "hex");
            expect((0, __1.unpack)((0, __1.pack)(buf)).equals(buf)).toBe(true);
            return [2 /*return*/];
        });
    }); });
});
