import React, { forwardRef, useMemo } from 'react';
import { FaSearchIcon } from '../../Icon';
import { InputWithTooltip } from '../InputWithTooltip';
const ICON_ALT = '検索';
export const SearchInput = forwardRef(({ decorators, ...props }, ref) => {
    const iconAlt = useMemo(() => decorators?.iconAlt?.(ICON_ALT) || ICON_ALT, [decorators]);
    return (React.createElement("label", null,
        React.createElement(InputWithTooltip, { ...props, ref: ref, prefix: React.createElement(FaSearchIcon, { alt: iconAlt, color: "TEXT_GREY" }) })));
});
//# sourceMappingURL=SearchInput.js.map