import { FormGroup } from '../FormGroup';
export const FormControl = FormGroup;
// 一部スタイリングが内部的に FormGroup という名前に依存しているため置き換え
FormControl.displayName = 'FormGroup';
//# sourceMappingURL=FormControl.js.map