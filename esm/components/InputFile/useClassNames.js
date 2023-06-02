import { useMemo } from 'react';
import { useClassNameGenerator } from '../../hooks/useClassNameGenerator';
import { InputFile } from './InputFile';
export function useClassNames() {
    const generate = useClassNameGenerator(InputFile.displayName || 'InputFile');
    return useMemo(() => ({
        wrapper: generate(),
        input: generate('input'),
        button: generate('button'),
        fileList: generate('fileList'),
        fileName: generate('fileName'),
        deleteButton: generate('deleteButton'),
    }), [generate]);
}
//# sourceMappingURL=useClassNames.js.map