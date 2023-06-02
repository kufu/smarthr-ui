import { useMemo } from 'react';
import { useClassNameGenerator } from '../../hooks/useClassNameGenerator';
import { Body, BulkActionRow, Cell, Head, Row, Table, TableReel, Td, Th } from '.';
export function useClassNames() {
    const generateForTable = useClassNameGenerator(Table.displayName || 'Table');
    const generateForBody = useClassNameGenerator(Body.displayName || 'Body');
    const generateForHead = useClassNameGenerator(Head.displayName || 'Head');
    const generateForRow = useClassNameGenerator(Row.displayName || 'Row');
    const generateForCell = useClassNameGenerator(Cell.displayName || 'Cell');
    const generateForTableReel = useClassNameGenerator(TableReel.displayName || 'TableReel');
    return useMemo(() => ({
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
export function useThClassNames() {
    const generate = useClassNameGenerator(Th.displayName || 'Th');
    return useMemo(() => ({
        wrapper: generate(),
    }), [generate]);
}
export function useTdClassNames() {
    const generate = useClassNameGenerator(Td.displayName || 'Td');
    return useMemo(() => ({
        wrapper: generate(),
    }), [generate]);
}
export function useBulkActionRowClassNames() {
    const generate = useClassNameGenerator(BulkActionRow.displayName || 'BulkActionRow');
    return useMemo(() => ({
        wrapper: generate(),
    }), [generate]);
}
//# sourceMappingURL=useClassNames.js.map