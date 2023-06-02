"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormControl = void 0;
const FormGroup_1 = require("../FormGroup");
exports.FormControl = FormGroup_1.FormGroup;
// 一部スタイリングが内部的に FormGroup という名前に依存しているため置き換え
exports.FormControl.displayName = 'FormGroup';
//# sourceMappingURL=FormControl.js.map