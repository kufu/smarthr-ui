export function convertMatchableString(original) {
    return (original
        .replace(/\s/g, ' ')
        .replace(/’/g, "'")
        .replace(/[”“]/g, '"')
        .replace(/｀/g, '`')
        .replace(/￥/g, '¥')
        .replace(/−/g, '-')
        .replace(/〜/g, '~')
        // unicode で [！] から [｝] の間に定義されている英数・記号を半角に変換
        .replace(/[！-｝]/g, (str) => String.fromCharCode(str.charCodeAt(0) - 0xfee0))
        .toLowerCase());
}
//# sourceMappingURL=comboBoxHelper.js.map