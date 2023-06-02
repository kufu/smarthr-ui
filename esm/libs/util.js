import React from 'react';
export const includeDisabledTrigger = (trigger) => React.Children.map(trigger, (t) => React.isValidElement(t) && t.props.disabled)?.some((bool) => bool);
//# sourceMappingURL=util.js.map