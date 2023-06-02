"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBulkActionRowClassNames = exports.useTdClassNames = exports.useThClassNames = exports.useClassNames = void 0;
const react_1 = require("react");
const useClassNameGenerator_1 = require("../../hooks/useClassNameGenerator");
const _1 = require(".");
function useClassNames() {
    const generateForTable = (0, useClassNameGenerator_1.useClassNameGenerator)(_1.Table.displayName || 'Table');
    const generateForBody = (0, useClassNameGenerator_1.useClassNameGenerator)(_1.Body.displayName || 'Body');
    const generateForHead = (0, useClassNameGenerator_1.useClassNameGenerator)(_1.Head.displayName || 'Head');
    const generateForRow = (0, useClassNameGenerator_1.useClassNameGenerator)(_1.Row.displayName || 'Row');
    const generateForCell = (0, useClassNameGenerator_1.useClassNameGenerator)(_1.Cell.displayName || 'Cell');
    const generateForTableReel = (0, useClassNameGenerator_1.useClassNameGenerator)(_1.TableReel.displayName || 'TableReel');
    return (0, react_1.useMemo)(() => ({
        table: {
            wrapper: generateForTable(),
        },
        head: {
            wrapper: generateForHead(),
            bulkActionArea: generateForHead('bulkActionArea'),
        },
        body: {
            wrapper: generateForBody(),
        },
        row: {
            wrapper: generateForRow(),
        },
        cell: {
            wrapper: generateForCell(),
        },
        tableReel: {
            wrapper: generateForTableReel(),
            inner: generateForTableReel('inner'),
        },
    }), [
        generateForBody,
        generateForCell,
        generateForHead,
        generateForRow,
        generateForTable,
        generateForTableReel,
    ]);
}
exports.useClassNames = useClassNames;
function useThClassNames() {
    const generate = (0, useClassNameGenerator_1.useClassNameGenerator)(_1.Th.displayName || 'Th');
    return (0, react_1.useMemo)(() => ({
        wrapper: generate(),
    }), [generate]);
}
exports.useThClassNames = useThClassNames;
function useTdClassNames() {
    const generate = (0, useClassNameGenerator_1.useClassNameGenerator)(_1.Td.displayName || 'Td');
    return (0, react_1.useMemo)(() => ({
        wrapper: generate(),
    }), [generate]);
}
exports.useTdClassNames = useTdClassNames;
function useBulkActionRowClassNames() {
    const generate = (0, useClassNameGenerator_1.useClassNameGenerator)(_1.BulkActionRow.displayName || 'BulkActionRow');
    return (0, react_1.useMemo)(() => ({
        wrapper: generate(),
    }), [generate]);
}
exports.useBulkActionRowClassNames = useBulkActionRowClassNames;
//# sourceMappingURL=useClassNames.js.map