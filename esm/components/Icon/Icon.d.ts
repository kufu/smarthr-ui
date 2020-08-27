import * as React from 'react';
export interface IconProps {
    color?: string;
    size?: number;
}
export interface Props extends IconProps {
    name: keyof typeof iconMap;
    className?: string;
}
export declare const iconMap: {
    'fa-address-book': import("react-icons/lib").IconType;
    'fa-address-card': import("react-icons/lib").IconType;
    'fa-angle-double-down': import("react-icons/lib").IconType;
    'fa-angle-double-left': import("react-icons/lib").IconType;
    'fa-angle-double-right': import("react-icons/lib").IconType;
    'fa-angle-down': import("react-icons/lib").IconType;
    'fa-angle-left': import("react-icons/lib").IconType;
    'fa-angle-right': import("react-icons/lib").IconType;
    'fa-angle-up': import("react-icons/lib").IconType;
    'fa-archive': import("react-icons/lib").IconType;
    'fa-arrow-circle-down': import("react-icons/lib").IconType;
    'fa-arrow-alt-circle-down': import("react-icons/lib").IconType;
    'fa-arrow-alt-circle-left': import("react-icons/lib").IconType;
    'fa-arrow-alt-circle-right': import("react-icons/lib").IconType;
    'fa-arrow-alt-circle-up': import("react-icons/lib").IconType;
    'fa-arrow-down': import("react-icons/lib").IconType;
    'fa-arrow-left': import("react-icons/lib").IconType;
    'fa-arrow-right': import("react-icons/lib").IconType;
    'fa-arrow-up': import("react-icons/lib").IconType;
    'fa-arrows-alt': import("react-icons/lib").IconType;
    'fa-arrows-alt-h': import("react-icons/lib").IconType;
    'fa-arrows-alt-v': import("react-icons/lib").IconType;
    'fa-asterisk': import("react-icons/lib").IconType;
    'fa-ban': import("react-icons/lib").IconType;
    'fa-bars': import("react-icons/lib").IconType;
    'fa-bell': import("react-icons/lib").IconType;
    'fa-bell-slash': import("react-icons/lib").IconType;
    'fa-birthday-cake': import("react-icons/lib").IconType;
    'fa-bolt': import("react-icons/lib").IconType;
    'fa-book': import("react-icons/lib").IconType;
    'fa-book-open': import("react-icons/lib").IconType;
    'fa-bookmark': import("react-icons/lib").IconType;
    'fa-box': import("react-icons/lib").IconType;
    'fa-box-open': import("react-icons/lib").IconType;
    'fa-boxes': import("react-icons/lib").IconType;
    'fa-briefcase': import("react-icons/lib").IconType;
    'fa-building': import("react-icons/lib").IconType;
    'fa-bullhorn': import("react-icons/lib").IconType;
    'fa-bus': import("react-icons/lib").IconType;
    'fa-bus-alt': import("react-icons/lib").IconType;
    'fa-business-time': import("react-icons/lib").IconType;
    'fa-calculator': import("react-icons/lib").IconType;
    'fa-calendar': import("react-icons/lib").IconType;
    'fa-calendar-alt': import("react-icons/lib").IconType;
    'fa-calendar-check': import("react-icons/lib").IconType;
    'fa-calendar-day': import("react-icons/lib").IconType;
    'fa-calendar-minus': import("react-icons/lib").IconType;
    'fa-calendar-plus': import("react-icons/lib").IconType;
    'fa-calendar-times': import("react-icons/lib").IconType;
    'fa-calendar-week': import("react-icons/lib").IconType;
    'fa-camera': import("react-icons/lib").IconType;
    'fa-car': import("react-icons/lib").IconType;
    'fa-car-alt': import("react-icons/lib").IconType;
    'fa-car-side': import("react-icons/lib").IconType;
    'fa-caret-down': import("react-icons/lib").IconType;
    'fa-caret-left': import("react-icons/lib").IconType;
    'fa-caret-right': import("react-icons/lib").IconType;
    'fa-caret-square-down': import("react-icons/lib").IconType;
    'fa-caret-square-left': import("react-icons/lib").IconType;
    'fa-caret-square-right': import("react-icons/lib").IconType;
    'fa-caret-square-up': import("react-icons/lib").IconType;
    'fa-caret-up': import("react-icons/lib").IconType;
    'fa-chart-area': import("react-icons/lib").IconType;
    'fa-chart-bar': import("react-icons/lib").IconType;
    'fa-chart-line': import("react-icons/lib").IconType;
    'fa-chart-pie': import("react-icons/lib").IconType;
    'fa-check': import("react-icons/lib").IconType;
    'fa-check-circle': import("react-icons/lib").IconType;
    'fa-check-square': import("react-icons/lib").IconType;
    'fa-chevron-circle-down': import("react-icons/lib").IconType;
    'fa-chevron-circle-left': import("react-icons/lib").IconType;
    'fa-chevron-circle-right': import("react-icons/lib").IconType;
    'fa-chevron-circle-up': import("react-icons/lib").IconType;
    'fa-chevron-down': import("react-icons/lib").IconType;
    'fa-chevron-left': import("react-icons/lib").IconType;
    'fa-chevron-right': import("react-icons/lib").IconType;
    'fa-chevron-up': import("react-icons/lib").IconType;
    'fa-circle': import("react-icons/lib").IconType;
    'fa-clipboard': import("react-icons/lib").IconType;
    'fa-clipboard-check': import("react-icons/lib").IconType;
    'fa-clipboard-list': import("react-icons/lib").IconType;
    'fa-clock': import("react-icons/lib").IconType;
    'fa-clone': import("react-icons/lib").IconType;
    'fa-cloud': import("react-icons/lib").IconType;
    'fa-cloud-download-alt': import("react-icons/lib").IconType;
    'fa-cloud-upload-alt': import("react-icons/lib").IconType;
    'fa-code': import("react-icons/lib").IconType;
    'fa-cog': import("react-icons/lib").IconType;
    'fa-cogs': import("react-icons/lib").IconType;
    'fa-coins': import("react-icons/lib").IconType;
    'fa-columns': import("react-icons/lib").IconType;
    'fa-comment': import("react-icons/lib").IconType;
    'fa-comment-alt': import("react-icons/lib").IconType;
    'fa-comment-dots': import("react-icons/lib").IconType;
    'fa-comment-slash': import("react-icons/lib").IconType;
    'fa-comments': import("react-icons/lib").IconType;
    'fa-compress': import("react-icons/lib").IconType;
    'fa-copy': import("react-icons/lib").IconType;
    'fa-credit-card': import("react-icons/lib").IconType;
    'fa-cube': import("react-icons/lib").IconType;
    'fa-cubes': import("react-icons/lib").IconType;
    'fa-database': import("react-icons/lib").IconType;
    'fa-door-closed': import("react-icons/lib").IconType;
    'fa-door-open': import("react-icons/lib").IconType;
    'fa-edit': import("react-icons/lib").IconType;
    'fa-ellipsis-h': import("react-icons/lib").IconType;
    'fa-ellipsis-v': import("react-icons/lib").IconType;
    'fa-envelope': import("react-icons/lib").IconType;
    'fa-envelope-open': import("react-icons/lib").IconType;
    'fa-envelope-open-text': import("react-icons/lib").IconType;
    'fa-exchange-alt': import("react-icons/lib").IconType;
    'fa-exclamation': import("react-icons/lib").IconType;
    'fa-exclamation-circle': import("react-icons/lib").IconType;
    'fa-exclamation-triangle': import("react-icons/lib").IconType;
    'fa-expand': import("react-icons/lib").IconType;
    'fa-expand-arrows-alt': import("react-icons/lib").IconType;
    'fa-external-link-alt': import("react-icons/lib").IconType;
    'fa-eye': import("react-icons/lib").IconType;
    'fa-eye-slash': import("react-icons/lib").IconType;
    'fa-file': import("react-icons/lib").IconType;
    'fa-file-alt': import("react-icons/lib").IconType;
    'fa-file-archive': import("react-icons/lib").IconType;
    'fa-file-download': import("react-icons/lib").IconType;
    'fa-file-export': import("react-icons/lib").IconType;
    'fa-file-import': import("react-icons/lib").IconType;
    'fa-file-upload': import("react-icons/lib").IconType;
    'fa-filter': import("react-icons/lib").IconType;
    'fa-flag': import("react-icons/lib").IconType;
    'fa-folder': import("react-icons/lib").IconType;
    'fa-folder-minus': import("react-icons/lib").IconType;
    'fa-folder-open': import("react-icons/lib").IconType;
    'fa-folder-plus': import("react-icons/lib").IconType;
    'fa-font': import("react-icons/lib").IconType;
    'fa-forward': import("react-icons/lib").IconType;
    'fa-gift': import("react-icons/lib").IconType;
    'fa-globe': import("react-icons/lib").IconType;
    'fa-graduation-cap': import("react-icons/lib").IconType;
    'fa-grip-horizontal': import("react-icons/lib").IconType;
    'fa-grip-lines': import("react-icons/lib").IconType;
    'fa-grip-lines-vertical': import("react-icons/lib").IconType;
    'fa-grip-vertical': import("react-icons/lib").IconType;
    'fa-hand-paper': import("react-icons/lib").IconType;
    'fa-hand-point-down': import("react-icons/lib").IconType;
    'fa-hand-point-left': import("react-icons/lib").IconType;
    'fa-hand-point-right': import("react-icons/lib").IconType;
    'fa-hand-point-up': import("react-icons/lib").IconType;
    'fa-hands': import("react-icons/lib").IconType;
    'fa-handshake': import("react-icons/lib").IconType;
    'fa-heart': import("react-icons/lib").IconType;
    'fa-history': import("react-icons/lib").IconType;
    'fa-home': import("react-icons/lib").IconType;
    'fa-hospital': import("react-icons/lib").IconType;
    'fa-hospital-alt': import("react-icons/lib").IconType;
    'fa-hourglass': import("react-icons/lib").IconType;
    'fa-hourglass-end': import("react-icons/lib").IconType;
    'fa-hourglass-half': import("react-icons/lib").IconType;
    'fa-hourglass-start': import("react-icons/lib").IconType;
    'fa-id-badge': import("react-icons/lib").IconType;
    'fa-id-card': import("react-icons/lib").IconType;
    'fa-id-card-alt': import("react-icons/lib").IconType;
    'fa-image': import("react-icons/lib").IconType;
    'fa-images': import("react-icons/lib").IconType;
    'fa-inbox': import("react-icons/lib").IconType;
    'fa-info': import("react-icons/lib").IconType;
    'fa-info-circle': import("react-icons/lib").IconType;
    'fa-key': import("react-icons/lib").IconType;
    'fa-keyboard': import("react-icons/lib").IconType;
    'fa-lightbulb': import("react-icons/lib").IconType;
    'fa-link': import("react-icons/lib").IconType;
    'fa-list': import("react-icons/lib").IconType;
    'fa-list-alt': import("react-icons/lib").IconType;
    'fa-list-ol': import("react-icons/lib").IconType;
    'fa-list-ul': import("react-icons/lib").IconType;
    'fa-lock': import("react-icons/lib").IconType;
    'fa-lock-open': import("react-icons/lib").IconType;
    'fa-long-arrow-alt-down': import("react-icons/lib").IconType;
    'fa-long-arrow-alt-left': import("react-icons/lib").IconType;
    'fa-long-arrow-alt-right': import("react-icons/lib").IconType;
    'fa-long-arrow-alt-up': import("react-icons/lib").IconType;
    'fa-medkit': import("react-icons/lib").IconType;
    'fa-minus': import("react-icons/lib").IconType;
    'fa-minus-circle': import("react-icons/lib").IconType;
    'fa-minus-square': import("react-icons/lib").IconType;
    'fa-mobile': import("react-icons/lib").IconType;
    'fa-mobile-alt': import("react-icons/lib").IconType;
    'fa-money-bill': import("react-icons/lib").IconType;
    'fa-money-bill-alt': import("react-icons/lib").IconType;
    'fa-money-bill-wave': import("react-icons/lib").IconType;
    'fa-money-bill-wave-alt': import("react-icons/lib").IconType;
    'fa-money-check': import("react-icons/lib").IconType;
    'fa-money-check-alt': import("react-icons/lib").IconType;
    'fa-paper-plane': import("react-icons/lib").IconType;
    'fa-paperclip': import("react-icons/lib").IconType;
    'fa-paste': import("react-icons/lib").IconType;
    'fa-pen': import("react-icons/lib").IconType;
    'fa-pencil-alt': import("react-icons/lib").IconType;
    'fa-phone': import("react-icons/lib").IconType;
    'fa-phone-slash': import("react-icons/lib").IconType;
    'fa-piggy-bank': import("react-icons/lib").IconType;
    'fa-plane': import("react-icons/lib").IconType;
    'fa-play': import("react-icons/lib").IconType;
    'fa-play-circle': import("react-icons/lib").IconType;
    'fa-plus': import("react-icons/lib").IconType;
    'fa-plus-circle': import("react-icons/lib").IconType;
    'fa-plus-square': import("react-icons/lib").IconType;
    'fa-poll': import("react-icons/lib").IconType;
    'fa-poll-h': import("react-icons/lib").IconType;
    'fa-portrait': import("react-icons/lib").IconType;
    'fa-power-off': import("react-icons/lib").IconType;
    'fa-print': import("react-icons/lib").IconType;
    'fa-qrcode': import("react-icons/lib").IconType;
    'fa-question': import("react-icons/lib").IconType;
    'fa-question-circle': import("react-icons/lib").IconType;
    'fa-random': import("react-icons/lib").IconType;
    'fa-receipt': import("react-icons/lib").IconType;
    'fa-redo': import("react-icons/lib").IconType;
    'fa-redo-alt': import("react-icons/lib").IconType;
    'fa-reg-dot-circle': import("react-icons/lib").IconType;
    'fa-reply': import("react-icons/lib").IconType;
    'fa-reply-all': import("react-icons/lib").IconType;
    'fa-rocket': import("react-icons/lib").IconType;
    'fa-save': import("react-icons/lib").IconType;
    'fa-search': import("react-icons/lib").IconType;
    'fa-search-minus': import("react-icons/lib").IconType;
    'fa-search-plus': import("react-icons/lib").IconType;
    'fa-share': import("react-icons/lib").IconType;
    'fa-share-alt': import("react-icons/lib").IconType;
    'fa-share-square': import("react-icons/lib").IconType;
    'fa-shield-alt': import("react-icons/lib").IconType;
    'fa-shopping-bag': import("react-icons/lib").IconType;
    'fa-shopping-basket': import("react-icons/lib").IconType;
    'fa-shopping-cart': import("react-icons/lib").IconType;
    'fa-sign-in-alt': import("react-icons/lib").IconType;
    'fa-sign-out-alt': import("react-icons/lib").IconType;
    'fa-sliders-h': import("react-icons/lib").IconType;
    'fa-sort': import("react-icons/lib").IconType;
    'fa-sort-alpha-down': import("react-icons/lib").IconType;
    'fa-sort-alpha-up': import("react-icons/lib").IconType;
    'fa-sort-amount-down': import("react-icons/lib").IconType;
    'fa-sort-amount-up': import("react-icons/lib").IconType;
    'fa-sort-down': import("react-icons/lib").IconType;
    'fa-sort-numeric-down': import("react-icons/lib").IconType;
    'fa-sort-numeric-up': import("react-icons/lib").IconType;
    'fa-sort-up': import("react-icons/lib").IconType;
    'fa-star': import("react-icons/lib").IconType;
    'fa-step-backward': import("react-icons/lib").IconType;
    'fa-step-forward': import("react-icons/lib").IconType;
    'fa-sticky-note': import("react-icons/lib").IconType;
    'fa-stop': import("react-icons/lib").IconType;
    'fa-stop-circle': import("react-icons/lib").IconType;
    'fa-stream': import("react-icons/lib").IconType;
    'fa-subway': import("react-icons/lib").IconType;
    'fa-sync': import("react-icons/lib").IconType;
    'fa-sync-alt': import("react-icons/lib").IconType;
    'fa-table': import("react-icons/lib").IconType;
    'fa-tablet': import("react-icons/lib").IconType;
    'fa-tablet-alt': import("react-icons/lib").IconType;
    'fa-tachometer-alt': import("react-icons/lib").IconType;
    'fa-tag': import("react-icons/lib").IconType;
    'fa-tags': import("react-icons/lib").IconType;
    'fa-task': import("react-icons/lib").IconType;
    'fa-taxi': import("react-icons/lib").IconType;
    'fa-th': import("react-icons/lib").IconType;
    'fa-th-large': import("react-icons/lib").IconType;
    'fa-th-list': import("react-icons/lib").IconType;
    'fa-times': import("react-icons/lib").IconType;
    'fa-times-circle': import("react-icons/lib").IconType;
    'fa-toolbox': import("react-icons/lib").IconType;
    'fa-tools': import("react-icons/lib").IconType;
    'fa-trash': import("react-icons/lib").IconType;
    'fa-trash-alt': import("react-icons/lib").IconType;
    'fa-trash-restore': import("react-icons/lib").IconType;
    'fa-trash-restore-alt': import("react-icons/lib").IconType;
    'fa-undo': import("react-icons/lib").IconType;
    'fa-undo-alt': import("react-icons/lib").IconType;
    'fa-unlink': import("react-icons/lib").IconType;
    'fa-unlock': import("react-icons/lib").IconType;
    'fa-unlock-alt': import("react-icons/lib").IconType;
    'fa-user': import("react-icons/lib").IconType;
    'fa-user-alt': import("react-icons/lib").IconType;
    'fa-user-alt-slash': import("react-icons/lib").IconType;
    'fa-user-check': import("react-icons/lib").IconType;
    'fa-user-circle': import("react-icons/lib").IconType;
    'fa-user-cog': import("react-icons/lib").IconType;
    'fa-user-edit': import("react-icons/lib").IconType;
    'fa-user-minus': import("react-icons/lib").IconType;
    'fa-user-plus': import("react-icons/lib").IconType;
    'fa-user-slash': import("react-icons/lib").IconType;
    'fa-users': import("react-icons/lib").IconType;
    'fa-users-cog': import("react-icons/lib").IconType;
    'fa-video': import("react-icons/lib").IconType;
    'fa-video-slash': import("react-icons/lib").IconType;
    'fa-volume-down': import("react-icons/lib").IconType;
    'fa-volume-mute': import("react-icons/lib").IconType;
    'fa-volume-off': import("react-icons/lib").IconType;
    'fa-volume-up': import("react-icons/lib").IconType;
    'fa-wallet': import("react-icons/lib").IconType;
    'fa-window-close': import("react-icons/lib").IconType;
    'fa-window-maximize': import("react-icons/lib").IconType;
    'fa-window-minimize': import("react-icons/lib").IconType;
    'fa-window-restore': import("react-icons/lib").IconType;
    'fa-wrench': import("react-icons/lib").IconType;
    'fa-yen-sign': import("react-icons/lib").IconType;
};
export declare const Icon: React.FC<Props>;
