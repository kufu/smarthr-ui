import * as React from 'react'
import {
  FaAddressBook,
  FaAddressCard,
  FaAngleDoubleDown,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleDown,
  FaAngleLeft,
  FaAngleRight,
  FaAngleUp,
  FaArchive,
  FaArrowAltCircleDown,
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaArrowAltCircleUp,
  FaArrowCircleDown,
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
  FaArrowUp,
  FaArrowsAlt,
  FaArrowsAltH,
  FaArrowsAltV,
  FaAsterisk,
  FaBan,
  FaBars,
  FaBell,
  FaBellSlash,
  FaBirthdayCake,
  FaBolt,
  FaBook,
  FaBookOpen,
  FaBookmark,
  FaBox,
  FaBoxOpen,
  FaBoxes,
  FaBriefcase,
  FaBuilding,
  FaBullhorn,
  FaBus,
  FaBusAlt,
  FaBusinessTime,
  FaCalculator,
  FaCalendar,
  FaCalendarAlt,
  FaCalendarCheck,
  FaCalendarDay,
  FaCalendarMinus,
  FaCalendarPlus,
  FaCalendarTimes,
  FaCalendarWeek,
  FaCamera,
  FaCar,
  FaCarAlt,
  FaCarSide,
  FaCaretDown,
  FaCaretLeft,
  FaCaretRight,
  FaCaretSquareDown,
  FaCaretSquareLeft,
  FaCaretSquareRight,
  FaCaretSquareUp,
  FaCaretUp,
  FaChartArea,
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaCheck,
  FaCheckCircle,
  FaCheckSquare,
  FaChevronCircleDown,
  FaChevronCircleLeft,
  FaChevronCircleRight,
  FaChevronCircleUp,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaChevronUp,
  FaCircle,
  FaClipboard,
  FaClipboardCheck,
  FaClipboardList,
  FaClock,
  FaClone,
  FaCloud,
  FaCloudDownloadAlt,
  FaCloudUploadAlt,
  FaCode,
  FaCog,
  FaCogs,
  FaCoins,
  FaColumns,
  FaComment,
  FaCommentAlt,
  FaCommentDots,
  FaCommentSlash,
  FaComments,
  FaCompress,
  FaCopy,
  FaCreditCard,
  FaCube,
  FaCubes,
  FaDatabase,
  FaDoorClosed,
  FaDoorOpen,
  FaEdit,
  FaEllipsisH,
  FaEllipsisV,
  FaEnvelope,
  FaEnvelopeOpen,
  FaEnvelopeOpenText,
  FaExchangeAlt,
  FaExclamation,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaExpand,
  FaExpandArrowsAlt,
  FaExternalLinkAlt,
  FaEye,
  FaEyeSlash,
  FaFile,
  FaFileAlt,
  FaFileArchive,
  FaFileDownload,
  FaFileExport,
  FaFileImport,
  FaFileUpload,
  FaFilter,
  FaFlag,
  FaFolder,
  FaFolderMinus,
  FaFolderOpen,
  FaFolderPlus,
  FaFont,
  FaForward,
  FaGift,
  FaGlobe,
  FaGraduationCap,
  FaGripHorizontal,
  FaGripLines,
  FaGripLinesVertical,
  FaGripVertical,
  FaHandPaper,
  FaHandPointDown,
  FaHandPointLeft,
  FaHandPointRight,
  FaHandPointUp,
  FaHands,
  FaHandshake,
  FaHeart,
  FaHistory,
  FaHome,
  FaHospital,
  FaHospitalAlt,
  FaHourglass,
  FaHourglassEnd,
  FaHourglassHalf,
  FaHourglassStart,
  FaIdBadge,
  FaIdCard,
  FaIdCardAlt,
  FaImage,
  FaImages,
  FaInbox,
  FaInfo,
  FaInfoCircle,
  FaKey,
  FaKeyboard,
  FaLightbulb,
  FaLink,
  FaList,
  FaListAlt,
  FaListOl,
  FaListUl,
  FaLock,
  FaLockOpen,
  FaLongArrowAltDown,
  FaLongArrowAltLeft,
  FaLongArrowAltRight,
  FaLongArrowAltUp,
  FaMinus,
  FaMinusCircle,
  FaMinusSquare,
  FaMobile,
  FaMobileAlt,
  FaMoneyBill,
  FaMoneyBillAlt,
  FaMoneyBillWave,
  FaMoneyBillWaveAlt,
  FaMoneyCheck,
  FaMoneyCheckAlt,
  FaPaperPlane,
  FaPaperclip,
  FaPaste,
  FaPen,
  FaPencilAlt,
  FaPhone,
  FaPhoneSlash,
  FaPiggyBank,
  FaPlane,
  FaPlay,
  FaPlayCircle,
  FaPlus,
  FaPlusCircle,
  FaPlusSquare,
  FaPoll,
  FaPollH,
  FaPortrait,
  FaPowerOff,
  FaPrint,
  FaQrcode,
  FaQuestion,
  FaQuestionCircle,
  FaRandom,
  FaReceipt,
  FaRedo,
  FaRedoAlt,
  FaRegDotCircle,
  FaReply,
  FaReplyAll,
  FaRocket,
  FaSave,
  FaSearch,
  FaSearchMinus,
  FaSearchPlus,
  FaShare,
  FaShareAlt,
  FaShareSquare,
  FaShieldAlt,
  FaShoppingBag,
  FaShoppingBasket,
  FaShoppingCart,
  FaSignInAlt,
  FaSignOutAlt,
  FaSlidersH,
  FaSort,
  FaSortAlphaDown,
  FaSortAlphaUp,
  FaSortAmountDown,
  FaSortAmountUp,
  FaSortDown,
  FaSortNumericDown,
  FaSortNumericUp,
  FaSortUp,
  FaStar,
  FaStepBackward,
  FaStepForward,
  FaStickyNote,
  FaStop,
  FaStopCircle,
  FaStream,
  FaSubway,
  FaSync,
  FaSyncAlt,
  FaTable,
  FaTablet,
  FaTabletAlt,
  FaTag,
  FaTags,
  FaTasks,
  FaTaxi,
  FaTh,
  FaThLarge,
  FaThList,
  FaTimes,
  FaTimesCircle,
  FaToolbox,
  FaTools,
  FaTrash,
  FaTrashAlt,
  FaTrashRestore,
  FaTrashRestoreAlt,
  FaUndo,
  FaUndoAlt,
  FaUnlink,
  FaUnlock,
  FaUnlockAlt,
  FaUser,
  FaUserAlt,
  FaUserAltSlash,
  FaUserCheck,
  FaUserCircle,
  FaUserCog,
  FaUserEdit,
  FaUserMinus,
  FaUserPlus,
  FaUserSlash,
  FaUsers,
  FaUsersCog,
  FaVideo,
  FaVideoSlash,
  FaVolumeDown,
  FaVolumeMute,
  FaVolumeOff,
  FaVolumeUp,
  FaWallet,
  FaWindowClose,
  FaWindowMaximize,
  FaWindowMinimize,
  FaWindowRestore,
  FaWrench,
  FaYenSign,
} from 'react-icons/fa'
import styled from 'styled-components'
import { VISUALLY_HIDDEN_STYLE } from '../../constants'

export interface IconProps {
  color?: string
  size?: number
}

export interface Props extends IconProps, React.SVGAttributes<SVGAElement> {
  name: keyof typeof iconMap
  visuallyHiddenText?: string
  className?: string
}

export const iconMap = {
  'fa-address-book': FaAddressBook,
  'fa-address-card': FaAddressCard,
  'fa-angle-double-down': FaAngleDoubleDown,
  'fa-angle-double-left': FaAngleDoubleLeft,
  'fa-angle-double-right': FaAngleDoubleRight,
  'fa-angle-down': FaAngleDown,
  'fa-angle-left': FaAngleLeft,
  'fa-angle-right': FaAngleRight,
  'fa-angle-up': FaAngleUp,
  'fa-archive': FaArchive,
  'fa-arrow-circle-down': FaArrowCircleDown,
  'fa-arrow-alt-circle-down': FaArrowAltCircleDown,
  'fa-arrow-alt-circle-left': FaArrowAltCircleLeft,
  'fa-arrow-alt-circle-right': FaArrowAltCircleRight,
  'fa-arrow-alt-circle-up': FaArrowAltCircleUp,
  'fa-arrow-down': FaArrowDown,
  'fa-arrow-left': FaArrowLeft,
  'fa-arrow-right': FaArrowRight,
  'fa-arrow-up': FaArrowUp,
  'fa-arrows-alt': FaArrowsAlt,
  'fa-arrows-alt-h': FaArrowsAltH,
  'fa-arrows-alt-v': FaArrowsAltV,
  'fa-asterisk': FaAsterisk,
  'fa-ban': FaBan,
  'fa-bars': FaBars,
  'fa-bell': FaBell,
  'fa-bell-slash': FaBellSlash,
  'fa-birthday-cake': FaBirthdayCake,
  'fa-bolt': FaBolt,
  'fa-book': FaBook,
  'fa-book-open': FaBookOpen,
  'fa-bookmark': FaBookmark,
  'fa-box': FaBox,
  'fa-box-open': FaBoxOpen,
  'fa-boxes': FaBoxes,
  'fa-briefcase': FaBriefcase,
  'fa-building': FaBuilding,
  'fa-bullhorn': FaBullhorn,
  'fa-bus': FaBus,
  'fa-bus-alt': FaBusAlt,
  'fa-business-time': FaBusinessTime,
  'fa-calculator': FaCalculator,
  'fa-calendar': FaCalendar,
  'fa-calendar-alt': FaCalendarAlt,
  'fa-calendar-check': FaCalendarCheck,
  'fa-calendar-day': FaCalendarDay,
  'fa-calendar-minus': FaCalendarMinus,
  'fa-calendar-plus': FaCalendarPlus,
  'fa-calendar-times': FaCalendarTimes,
  'fa-calendar-week': FaCalendarWeek,
  'fa-camera': FaCamera,
  'fa-car': FaCar,
  'fa-car-alt': FaCarAlt,
  'fa-car-side': FaCarSide,
  'fa-caret-down': FaCaretDown,
  'fa-caret-left': FaCaretLeft,
  'fa-caret-right': FaCaretRight,
  'fa-caret-square-down': FaCaretSquareDown,
  'fa-caret-square-left': FaCaretSquareLeft,
  'fa-caret-square-right': FaCaretSquareRight,
  'fa-caret-square-up': FaCaretSquareUp,
  'fa-caret-up': FaCaretUp,
  'fa-chart-area': FaChartArea,
  'fa-chart-bar': FaChartBar,
  'fa-chart-line': FaChartLine,
  'fa-chart-pie': FaChartPie,
  'fa-check': FaCheck,
  'fa-check-circle': FaCheckCircle,
  'fa-check-square': FaCheckSquare,
  'fa-chevron-circle-down': FaChevronCircleDown,
  'fa-chevron-circle-left': FaChevronCircleLeft,
  'fa-chevron-circle-right': FaChevronCircleRight,
  'fa-chevron-circle-up': FaChevronCircleUp,
  'fa-chevron-down': FaChevronDown,
  'fa-chevron-left': FaChevronLeft,
  'fa-chevron-right': FaChevronRight,
  'fa-chevron-up': FaChevronUp,
  'fa-circle': FaCircle,
  'fa-clipboard': FaClipboard,
  'fa-clipboard-check': FaClipboardCheck,
  'fa-clipboard-list': FaClipboardList,
  'fa-clock': FaClock,
  'fa-clone': FaClone,
  'fa-cloud': FaCloud,
  'fa-cloud-download-alt': FaCloudDownloadAlt,
  'fa-cloud-upload-alt': FaCloudUploadAlt,
  'fa-code': FaCode,
  'fa-cog': FaCog,
  'fa-cogs': FaCogs,
  'fa-coins': FaCoins,
  'fa-columns': FaColumns,
  'fa-comment': FaComment,
  'fa-comment-alt': FaCommentAlt,
  'fa-comment-dots': FaCommentDots,
  'fa-comment-slash': FaCommentSlash,
  'fa-comments': FaComments,
  'fa-compress': FaCompress,
  'fa-copy': FaCopy,
  'fa-credit-card': FaCreditCard,
  'fa-cube': FaCube,
  'fa-cubes': FaCubes,
  'fa-database': FaDatabase,
  'fa-door-closed': FaDoorClosed,
  'fa-door-open': FaDoorOpen,
  'fa-edit': FaEdit,
  'fa-ellipsis-h': FaEllipsisH,
  'fa-ellipsis-v': FaEllipsisV,
  'fa-envelope': FaEnvelope,
  'fa-envelope-open': FaEnvelopeOpen,
  'fa-envelope-open-text': FaEnvelopeOpenText,
  'fa-exchange-alt': FaExchangeAlt,
  'fa-exclamation': FaExclamation,
  'fa-exclamation-circle': FaExclamationCircle,
  'fa-exclamation-triangle': FaExclamationTriangle,
  'fa-expand': FaExpand,
  'fa-expand-arrows-alt': FaExpandArrowsAlt,
  'fa-external-link-alt': FaExternalLinkAlt,
  'fa-eye': FaEye,
  'fa-eye-slash': FaEyeSlash,
  'fa-file': FaFile,
  'fa-file-alt': FaFileAlt,
  'fa-file-archive': FaFileArchive,
  'fa-file-download': FaFileDownload,
  'fa-file-export': FaFileExport,
  'fa-file-import': FaFileImport,
  'fa-file-upload': FaFileUpload,
  'fa-filter': FaFilter,
  'fa-flag': FaFlag,
  'fa-folder': FaFolder,
  'fa-folder-minus': FaFolderMinus,
  'fa-folder-open': FaFolderOpen,
  'fa-folder-plus': FaFolderPlus,
  'fa-font': FaFont,
  'fa-forward': FaForward,
  'fa-gift': FaGift,
  'fa-globe': FaGlobe,
  'fa-graduation-cap': FaGraduationCap,
  'fa-grip-horizontal': FaGripHorizontal,
  'fa-grip-lines': FaGripLines,
  'fa-grip-lines-vertical': FaGripLinesVertical,
  'fa-grip-vertical': FaGripVertical,
  'fa-hand-paper': FaHandPaper,
  'fa-hand-point-down': FaHandPointDown,
  'fa-hand-point-left': FaHandPointLeft,
  'fa-hand-point-right': FaHandPointRight,
  'fa-hand-point-up': FaHandPointUp,
  'fa-hands': FaHands,
  'fa-handshake': FaHandshake,
  'fa-heart': FaHeart,
  'fa-history': FaHistory,
  'fa-home': FaHome,
  'fa-hospital': FaHospital,
  'fa-hospital-alt': FaHospitalAlt,
  'fa-hourglass': FaHourglass,
  'fa-hourglass-end': FaHourglassEnd,
  'fa-hourglass-half': FaHourglassHalf,
  'fa-hourglass-start': FaHourglassStart,
  'fa-id-badge': FaIdBadge,
  'fa-id-card': FaIdCard,
  'fa-id-card-alt': FaIdCardAlt,
  'fa-image': FaImage,
  'fa-images': FaImages,
  'fa-inbox': FaInbox,
  'fa-info': FaInfo,
  'fa-info-circle': FaInfoCircle,
  'fa-key': FaKey,
  'fa-keyboard': FaKeyboard,
  'fa-lightbulb': FaLightbulb,
  'fa-link': FaLink,
  'fa-list': FaList,
  'fa-list-alt': FaListAlt,
  'fa-list-ol': FaListOl,
  'fa-list-ul': FaListUl,
  'fa-lock': FaLock,
  'fa-lock-open': FaLockOpen,
  'fa-long-arrow-alt-down': FaLongArrowAltDown,
  'fa-long-arrow-alt-left': FaLongArrowAltLeft,
  'fa-long-arrow-alt-right': FaLongArrowAltRight,
  'fa-long-arrow-alt-up': FaLongArrowAltUp,
  'fa-minus': FaMinus,
  'fa-minus-circle': FaMinusCircle,
  'fa-minus-square': FaMinusSquare,
  'fa-mobile': FaMobile,
  'fa-mobile-alt': FaMobileAlt,
  'fa-money-bill': FaMoneyBill,
  'fa-money-bill-alt': FaMoneyBillAlt,
  'fa-money-bill-wave': FaMoneyBillWave,
  'fa-money-bill-wave-alt': FaMoneyBillWaveAlt,
  'fa-money-check': FaMoneyCheck,
  'fa-money-check-alt': FaMoneyCheckAlt,
  'fa-paper-plane': FaPaperPlane,
  'fa-paperclip': FaPaperclip,
  'fa-paste': FaPaste,
  'fa-pen': FaPen,
  'fa-pencil-alt': FaPencilAlt,
  'fa-phone': FaPhone,
  'fa-phone-slash': FaPhoneSlash,
  'fa-piggy-bank': FaPiggyBank,
  'fa-plane': FaPlane,
  'fa-play': FaPlay,
  'fa-play-circle': FaPlayCircle,
  'fa-plus': FaPlus,
  'fa-plus-circle': FaPlusCircle,
  'fa-plus-square': FaPlusSquare,
  'fa-poll': FaPoll,
  'fa-poll-h': FaPollH,
  'fa-portrait': FaPortrait,
  'fa-power-off': FaPowerOff,
  'fa-print': FaPrint,
  'fa-qrcode': FaQrcode,
  'fa-question': FaQuestion,
  'fa-question-circle': FaQuestionCircle,
  'fa-random': FaRandom,
  'fa-receipt': FaReceipt,
  'fa-redo': FaRedo,
  'fa-redo-alt': FaRedoAlt,
  'fa-reg-dot-circle': FaRegDotCircle,
  'fa-reply': FaReply,
  'fa-reply-all': FaReplyAll,
  'fa-rocket': FaRocket,
  'fa-save': FaSave,
  'fa-search': FaSearch,
  'fa-search-minus': FaSearchMinus,
  'fa-search-plus': FaSearchPlus,
  'fa-share': FaShare,
  'fa-share-alt': FaShareAlt,
  'fa-share-square': FaShareSquare,
  'fa-shield-alt': FaShieldAlt,
  'fa-shopping-bag': FaShoppingBag,
  'fa-shopping-basket': FaShoppingBasket,
  'fa-shopping-cart': FaShoppingCart,
  'fa-sign-in-alt': FaSignInAlt,
  'fa-sign-out-alt': FaSignOutAlt,
  'fa-sliders-h': FaSlidersH,
  'fa-sort': FaSort,
  'fa-sort-alpha-down': FaSortAlphaDown,
  'fa-sort-alpha-up': FaSortAlphaUp,
  'fa-sort-amount-down': FaSortAmountDown,
  'fa-sort-amount-up': FaSortAmountUp,
  'fa-sort-down': FaSortDown,
  'fa-sort-numeric-down': FaSortNumericDown,
  'fa-sort-numeric-up': FaSortNumericUp,
  'fa-sort-up': FaSortUp,
  'fa-star': FaStar,
  'fa-step-backward': FaStepBackward,
  'fa-step-forward': FaStepForward,
  'fa-sticky-note': FaStickyNote,
  'fa-stop': FaStop,
  'fa-stop-circle': FaStopCircle,
  'fa-stream': FaStream,
  'fa-subway': FaSubway,
  'fa-sync': FaSync,
  'fa-sync-alt': FaSyncAlt,
  'fa-table': FaTable,
  'fa-tablet': FaTablet,
  'fa-tablet-alt': FaTabletAlt,
  'fa-tag': FaTag,
  'fa-tags': FaTags,
  'fa-task': FaTasks,
  'fa-taxi': FaTaxi,
  'fa-th': FaTh,
  'fa-th-large': FaThLarge,
  'fa-th-list': FaThList,
  'fa-times': FaTimes,
  'fa-times-circle': FaTimesCircle,
  'fa-toolbox': FaToolbox,
  'fa-tools': FaTools,
  'fa-trash': FaTrash,
  'fa-trash-alt': FaTrashAlt,
  'fa-trash-restore': FaTrashRestore,
  'fa-trash-restore-alt': FaTrashRestoreAlt,
  'fa-undo': FaUndo,
  'fa-undo-alt': FaUndoAlt,
  'fa-unlink': FaUnlink,
  'fa-unlock': FaUnlock,
  'fa-unlock-alt': FaUnlockAlt,
  'fa-user': FaUser,
  'fa-user-alt': FaUserAlt,
  'fa-user-alt-slash': FaUserAltSlash,
  'fa-user-check': FaUserCheck,
  'fa-user-circle': FaUserCircle,
  'fa-user-cog': FaUserCog,
  'fa-user-edit': FaUserEdit,
  'fa-user-minus': FaUserMinus,
  'fa-user-plus': FaUserPlus,
  'fa-user-slash': FaUserSlash,
  'fa-users': FaUsers,
  'fa-users-cog': FaUsersCog,
  'fa-video': FaVideo,
  'fa-video-slash': FaVideoSlash,
  'fa-volume-down': FaVolumeDown,
  'fa-volume-mute': FaVolumeMute,
  'fa-volume-off': FaVolumeOff,
  'fa-volume-up': FaVolumeUp,
  'fa-wallet': FaWallet,
  'fa-window-close': FaWindowClose,
  'fa-window-maximize': FaWindowMaximize,
  'fa-window-minimize': FaWindowMinimize,
  'fa-window-restore': FaWindowRestore,
  'fa-wrench': FaWrench,
  'fa-yen-sign': FaYenSign,
}

export type ComponentProps = Omit<Props, 'name'>
type IconComponent = ComponentProps & { Component: React.ComponentType<ComponentProps> }

// This should be inlined in the createIcon function after the Icon component had been removed
const IconComponent: React.FC<IconComponent> = ({
  Component,
  className = '',
  role = 'img',
  visuallyHiddenText,
  'aria-hidden': ariaHidden,
  focusable = false,
  ...props
}) => {
  const hasAltText =
    visuallyHiddenText !== undefined ||
    props['aria-label'] !== undefined ||
    props['aria-labelledby'] !== undefined
  const isAriaHidden = ariaHidden !== undefined ? ariaHidden : !hasAltText
  return (
    <>
      {visuallyHiddenText && <VisuallyHiddenText>{visuallyHiddenText}</VisuallyHiddenText>}
      <Component
        className={className}
        role={role}
        aria-hidden={isAriaHidden || undefined}
        focusable={focusable}
        {...props}
      />
    </>
  )
}

const createIcon = (SvgIcon: React.ComponentType<ComponentProps>) => {
  const Icon: React.FC<ComponentProps> = (props: ComponentProps) => {
    return <IconComponent {...props} Component={SvgIcon} />
  }
  return Icon
}

export const Icon: React.FC<Props> = ({ name, ...props }) => (
  <IconComponent {...props} Component={iconMap[name]} />
)

export const FaAddressBookIcon = createIcon(FaAddressBook)
export const FaAddressCardIcon = createIcon(FaAddressCard)
export const FaAngleDoubleDownIcon = createIcon(FaAngleDoubleDown)
export const FaAngleDoubleLeftIcon = createIcon(FaAngleDoubleLeft)
export const FaAngleDoubleRightIcon = createIcon(FaAngleDoubleRight)
export const FaAngleDownIcon = createIcon(FaAngleDown)
export const FaAngleLeftIcon = createIcon(FaAngleLeft)
export const FaAngleRightIcon = createIcon(FaAngleRight)
export const FaAngleUpIcon = createIcon(FaAngleUp)
export const FaArchiveIcon = createIcon(FaArchive)
export const FaArrowCircleDownIcon = createIcon(FaArrowCircleDown)
export const FaArrowAltCircleDownIcon = createIcon(FaArrowAltCircleDown)
export const FaArrowAltCircleLeftIcon = createIcon(FaArrowAltCircleLeft)
export const FaArrowAltCircleRightIcon = createIcon(FaArrowAltCircleRight)
export const FaArrowAltCircleUpIcon = createIcon(FaArrowAltCircleUp)
export const FaArrowDownIcon = createIcon(FaArrowDown)
export const FaArrowLeftIcon = createIcon(FaArrowLeft)
export const FaArrowRightIcon = createIcon(FaArrowRight)
export const FaArrowUpIcon = createIcon(FaArrowUp)
export const FaArrowsAltIcon = createIcon(FaArrowsAlt)
export const FaArrowsAltHIcon = createIcon(FaArrowsAltH)
export const FaArrowsAltVIcon = createIcon(FaArrowsAltV)
export const FaAsteriskIcon = createIcon(FaAsterisk)
export const FaBanIcon = createIcon(FaBan)
export const FaBarsIcon = createIcon(FaBars)
export const FaBellIcon = createIcon(FaBell)
export const FaBellSlashIcon = createIcon(FaBellSlash)
export const FaBirthdayCakeIcon = createIcon(FaBirthdayCake)
export const FaBoltIcon = createIcon(FaBolt)
export const FaBookIcon = createIcon(FaBook)
export const FaBookOpenIcon = createIcon(FaBookOpen)
export const FaBookmarkIcon = createIcon(FaBookmark)
export const FaBoxIcon = createIcon(FaBox)
export const FaBoxOpenIcon = createIcon(FaBoxOpen)
export const FaBoxesIcon = createIcon(FaBoxes)
export const FaBriefcaseIcon = createIcon(FaBriefcase)
export const FaBuildingIcon = createIcon(FaBuilding)
export const FaBullhornIcon = createIcon(FaBullhorn)
export const FaBusIcon = createIcon(FaBus)
export const FaBusAltIcon = createIcon(FaBusAlt)
export const FaBusinessTimeIcon = createIcon(FaBusinessTime)
export const FaCalculatorIcon = createIcon(FaCalculator)
export const FaCalendarIcon = createIcon(FaCalendar)
export const FaCalendarAltIcon = createIcon(FaCalendarAlt)
export const FaCalendarCheckIcon = createIcon(FaCalendarCheck)
export const FaCalendarDayIcon = createIcon(FaCalendarDay)
export const FaCalendarMinusIcon = createIcon(FaCalendarMinus)
export const FaCalendarPlusIcon = createIcon(FaCalendarPlus)
export const FaCalendarTimesIcon = createIcon(FaCalendarTimes)
export const FaCalendarWeekIcon = createIcon(FaCalendarWeek)
export const FaCameraIcon = createIcon(FaCamera)
export const FaCarIcon = createIcon(FaCar)
export const FaCarAltIcon = createIcon(FaCarAlt)
export const FaCarSideIcon = createIcon(FaCarSide)
export const FaCaretDownIcon = createIcon(FaCaretDown)
export const FaCaretLeftIcon = createIcon(FaCaretLeft)
export const FaCaretRightIcon = createIcon(FaCaretRight)
export const FaCaretSquareDownIcon = createIcon(FaCaretSquareDown)
export const FaCaretSquareLeftIcon = createIcon(FaCaretSquareLeft)
export const FaCaretSquareRightIcon = createIcon(FaCaretSquareRight)
export const FaCaretSquareUpIcon = createIcon(FaCaretSquareUp)
export const FaCaretUpIcon = createIcon(FaCaretUp)
export const FaChartAreaIcon = createIcon(FaChartArea)
export const FaChartBarIcon = createIcon(FaChartBar)
export const FaChartLineIcon = createIcon(FaChartLine)
export const FaChartPieIcon = createIcon(FaChartPie)
export const FaCheckIcon = createIcon(FaCheck)
export const FaCheckCircleIcon = createIcon(FaCheckCircle)
export const FaCheckSquareIcon = createIcon(FaCheckSquare)
export const FaChevronCircleDownIcon = createIcon(FaChevronCircleDown)
export const FaChevronCircleLeftIcon = createIcon(FaChevronCircleLeft)
export const FaChevronCircleRightIcon = createIcon(FaChevronCircleRight)
export const FaChevronCircleUpIcon = createIcon(FaChevronCircleUp)
export const FaChevronDownIcon = createIcon(FaChevronDown)
export const FaChevronLeftIcon = createIcon(FaChevronLeft)
export const FaChevronRightIcon = createIcon(FaChevronRight)
export const FaChevronUpIcon = createIcon(FaChevronUp)
export const FaCircleIcon = createIcon(FaCircle)
export const FaClipboardIcon = createIcon(FaClipboard)
export const FaClipboardCheckIcon = createIcon(FaClipboardCheck)
export const FaClipboardListIcon = createIcon(FaClipboardList)
export const FaClockIcon = createIcon(FaClock)
export const FaCloneIcon = createIcon(FaClone)
export const FaCloudIcon = createIcon(FaCloud)
export const FaCloudDownloadAltIcon = createIcon(FaCloudDownloadAlt)
export const FaCloudUploadAltIcon = createIcon(FaCloudUploadAlt)
export const FaCodeIcon = createIcon(FaCode)
export const FaCogIcon = createIcon(FaCog)
export const FaCogsIcon = createIcon(FaCogs)
export const FaCoinsIcon = createIcon(FaCoins)
export const FaColumnsIcon = createIcon(FaColumns)
export const FaCommentIcon = createIcon(FaComment)
export const FaCommentAltIcon = createIcon(FaCommentAlt)
export const FaCommentDotsIcon = createIcon(FaCommentDots)
export const FaCommentSlashIcon = createIcon(FaCommentSlash)
export const FaCommentsIcon = createIcon(FaComments)
export const FaCompressIcon = createIcon(FaCompress)
export const FaCopyIcon = createIcon(FaCopy)
export const FaCreditCardIcon = createIcon(FaCreditCard)
export const FaCubeIcon = createIcon(FaCube)
export const FaCubesIcon = createIcon(FaCubes)
export const FaDatabaseIcon = createIcon(FaDatabase)
export const FaDoorClosedIcon = createIcon(FaDoorClosed)
export const FaDoorOpenIcon = createIcon(FaDoorOpen)
export const FaEditIcon = createIcon(FaEdit)
export const FaEllipsisHIcon = createIcon(FaEllipsisH)
export const FaEllipsisVIcon = createIcon(FaEllipsisV)
export const FaEnvelopeIcon = createIcon(FaEnvelope)
export const FaEnvelopeOpenIcon = createIcon(FaEnvelopeOpen)
export const FaEnvelopeOpenTextIcon = createIcon(FaEnvelopeOpenText)
export const FaExchangeAltIcon = createIcon(FaExchangeAlt)
export const FaExclamationIcon = createIcon(FaExclamation)
export const FaExclamationCircleIcon = createIcon(FaExclamationCircle)
export const FaExclamationTriangleIcon = createIcon(FaExclamationTriangle)
export const FaExpandIcon = createIcon(FaExpand)
export const FaExpandArrowsAltIcon = createIcon(FaExpandArrowsAlt)
export const FaExternalLinkAltIcon = createIcon(FaExternalLinkAlt)
export const FaEyeIcon = createIcon(FaEye)
export const FaEyeSlashIcon = createIcon(FaEyeSlash)
export const FaFileIcon = createIcon(FaFile)
export const FaFileAltIcon = createIcon(FaFileAlt)
export const FaFileArchiveIcon = createIcon(FaFileArchive)
export const FaFileDownloadIcon = createIcon(FaFileDownload)
export const FaFileExportIcon = createIcon(FaFileExport)
export const FaFileImportIcon = createIcon(FaFileImport)
export const FaFileUploadIcon = createIcon(FaFileUpload)
export const FaFilterIcon = createIcon(FaFilter)
export const FaFlagIcon = createIcon(FaFlag)
export const FaFolderIcon = createIcon(FaFolder)
export const FaFolderMinusIcon = createIcon(FaFolderMinus)
export const FaFolderOpenIcon = createIcon(FaFolderOpen)
export const FaFolderPlusIcon = createIcon(FaFolderPlus)
export const FaFontIcon = createIcon(FaFont)
export const FaForwardIcon = createIcon(FaForward)
export const FaGiftIcon = createIcon(FaGift)
export const FaGlobeIcon = createIcon(FaGlobe)
export const FaGraduationCapIcon = createIcon(FaGraduationCap)
export const FaGripHorizontalIcon = createIcon(FaGripHorizontal)
export const FaGripLinesIcon = createIcon(FaGripLines)
export const FaGripLinesVerticalIcon = createIcon(FaGripLinesVertical)
export const FaGripVerticalIcon = createIcon(FaGripVertical)
export const FaHandPaperIcon = createIcon(FaHandPaper)
export const FaHandPointDownIcon = createIcon(FaHandPointDown)
export const FaHandPointLeftIcon = createIcon(FaHandPointLeft)
export const FaHandPointRightIcon = createIcon(FaHandPointRight)
export const FaHandPointUpIcon = createIcon(FaHandPointUp)
export const FaHandsIcon = createIcon(FaHands)
export const FaHandshakeIcon = createIcon(FaHandshake)
export const FaHeartIcon = createIcon(FaHeart)
export const FaHistoryIcon = createIcon(FaHistory)
export const FaHomeIcon = createIcon(FaHome)
export const FaHospitalIcon = createIcon(FaHospital)
export const FaHospitalAltIcon = createIcon(FaHospitalAlt)
export const FaHourglassIcon = createIcon(FaHourglass)
export const FaHourglassEndIcon = createIcon(FaHourglassEnd)
export const FaHourglassHalfIcon = createIcon(FaHourglassHalf)
export const FaHourglassStartIcon = createIcon(FaHourglassStart)
export const FaIdBadgeIcon = createIcon(FaIdBadge)
export const FaIdCardIcon = createIcon(FaIdCard)
export const FaIdCardAltIcon = createIcon(FaIdCardAlt)
export const FaImageIcon = createIcon(FaImage)
export const FaImagesIcon = createIcon(FaImages)
export const FaInboxIcon = createIcon(FaInbox)
export const FaInfoIcon = createIcon(FaInfo)
export const FaInfoCircleIcon = createIcon(FaInfoCircle)
export const FaKeyIcon = createIcon(FaKey)
export const FaKeyboardIcon = createIcon(FaKeyboard)
export const FaLightbulbIcon = createIcon(FaLightbulb)
export const FaLinkIcon = createIcon(FaLink)
export const FaListIcon = createIcon(FaList)
export const FaListAltIcon = createIcon(FaListAlt)
export const FaListOlIcon = createIcon(FaListOl)
export const FaListUlIcon = createIcon(FaListUl)
export const FaLockIcon = createIcon(FaLock)
export const FaLockOpenIcon = createIcon(FaLockOpen)
export const FaLongArrowAltDownIcon = createIcon(FaLongArrowAltDown)
export const FaLongArrowAltLeftIcon = createIcon(FaLongArrowAltLeft)
export const FaLongArrowAltRightIcon = createIcon(FaLongArrowAltRight)
export const FaLongArrowAltUpIcon = createIcon(FaLongArrowAltUp)
export const FaMinusIcon = createIcon(FaMinus)
export const FaMinusCircleIcon = createIcon(FaMinusCircle)
export const FaMinusSquareIcon = createIcon(FaMinusSquare)
export const FaMobileIcon = createIcon(FaMobile)
export const FaMobileAltIcon = createIcon(FaMobileAlt)
export const FaMoneyBillIcon = createIcon(FaMoneyBill)
export const FaMoneyBillAltIcon = createIcon(FaMoneyBillAlt)
export const FaMoneyBillWaveIcon = createIcon(FaMoneyBillWave)
export const FaMoneyBillWaveAltIcon = createIcon(FaMoneyBillWaveAlt)
export const FaMoneyCheckIcon = createIcon(FaMoneyCheck)
export const FaMoneyCheckAltIcon = createIcon(FaMoneyCheckAlt)
export const FaPaperPlaneIcon = createIcon(FaPaperPlane)
export const FaPaperclipIcon = createIcon(FaPaperclip)
export const FaPasteIcon = createIcon(FaPaste)
export const FaPenIcon = createIcon(FaPen)
export const FaPencilAltIcon = createIcon(FaPencilAlt)
export const FaPhoneIcon = createIcon(FaPhone)
export const FaPhoneSlashIcon = createIcon(FaPhoneSlash)
export const FaPiggyBankIcon = createIcon(FaPiggyBank)
export const FaPlaneIcon = createIcon(FaPlane)
export const FaPlayIcon = createIcon(FaPlay)
export const FaPlayCircleIcon = createIcon(FaPlayCircle)
export const FaPlusIcon = createIcon(FaPlus)
export const FaPlusCircleIcon = createIcon(FaPlusCircle)
export const FaPlusSquareIcon = createIcon(FaPlusSquare)
export const FaPollIcon = createIcon(FaPoll)
export const FaPollHIcon = createIcon(FaPollH)
export const FaPortraitIcon = createIcon(FaPortrait)
export const FaPowerOffIcon = createIcon(FaPowerOff)
export const FaPrintIcon = createIcon(FaPrint)
export const FaQrcodeIcon = createIcon(FaQrcode)
export const FaQuestionIcon = createIcon(FaQuestion)
export const FaQuestionCircleIcon = createIcon(FaQuestionCircle)
export const FaRandomIcon = createIcon(FaRandom)
export const FaReceiptIcon = createIcon(FaReceipt)
export const FaRedoIcon = createIcon(FaRedo)
export const FaRedoAltIcon = createIcon(FaRedoAlt)
export const FaRegDotCircleIcon = createIcon(FaRegDotCircle)
export const FaReplyIcon = createIcon(FaReply)
export const FaReplyAllIcon = createIcon(FaReplyAll)
export const FaRocketIcon = createIcon(FaRocket)
export const FaSaveIcon = createIcon(FaSave)
export const FaSearchIcon = createIcon(FaSearch)
export const FaSearchMinusIcon = createIcon(FaSearchMinus)
export const FaSearchPlusIcon = createIcon(FaSearchPlus)
export const FaShareIcon = createIcon(FaShare)
export const FaShareAltIcon = createIcon(FaShareAlt)
export const FaShareSquareIcon = createIcon(FaShareSquare)
export const FaShieldAltIcon = createIcon(FaShieldAlt)
export const FaShoppingBagIcon = createIcon(FaShoppingBag)
export const FaShoppingBasketIcon = createIcon(FaShoppingBasket)
export const FaShoppingCartIcon = createIcon(FaShoppingCart)
export const FaSignInAltIcon = createIcon(FaSignInAlt)
export const FaSignOutAltIcon = createIcon(FaSignOutAlt)
export const FaSlidersHIcon = createIcon(FaSlidersH)
export const FaSortIcon = createIcon(FaSort)
export const FaSortAlphaDownIcon = createIcon(FaSortAlphaDown)
export const FaSortAlphaUpIcon = createIcon(FaSortAlphaUp)
export const FaSortAmountDownIcon = createIcon(FaSortAmountDown)
export const FaSortAmountUpIcon = createIcon(FaSortAmountUp)
export const FaSortDownIcon = createIcon(FaSortDown)
export const FaSortNumericDownIcon = createIcon(FaSortNumericDown)
export const FaSortNumericUpIcon = createIcon(FaSortNumericUp)
export const FaSortUpIcon = createIcon(FaSortUp)
export const FaStarIcon = createIcon(FaStar)
export const FaStepBackwardIcon = createIcon(FaStepBackward)
export const FaStepForwardIcon = createIcon(FaStepForward)
export const FaStickyNoteIcon = createIcon(FaStickyNote)
export const FaStopIcon = createIcon(FaStop)
export const FaStopCircleIcon = createIcon(FaStopCircle)
export const FaStreamIcon = createIcon(FaStream)
export const FaSubwayIcon = createIcon(FaSubway)
export const FaSyncIcon = createIcon(FaSync)
export const FaSyncAltIcon = createIcon(FaSyncAlt)
export const FaTableIcon = createIcon(FaTable)
export const FaTabletIcon = createIcon(FaTablet)
export const FaTabletAltIcon = createIcon(FaTabletAlt)
export const FaTagIcon = createIcon(FaTag)
export const FaTagsIcon = createIcon(FaTags)
export const FaTasksIcon = createIcon(FaTasks)
export const FaTaxiIcon = createIcon(FaTaxi)
export const FaThIcon = createIcon(FaTh)
export const FaThLargeIcon = createIcon(FaThLarge)
export const FaThListIcon = createIcon(FaThList)
export const FaTimesIcon = createIcon(FaTimes)
export const FaTimesCircleIcon = createIcon(FaTimesCircle)
export const FaToolboxIcon = createIcon(FaToolbox)
export const FaToolsIcon = createIcon(FaTools)
export const FaTrashIcon = createIcon(FaTrash)
export const FaTrashAltIcon = createIcon(FaTrashAlt)
export const FaTrashRestoreIcon = createIcon(FaTrashRestore)
export const FaTrashRestoreAltIcon = createIcon(FaTrashRestoreAlt)
export const FaUndoIcon = createIcon(FaUndo)
export const FaUndoAltIcon = createIcon(FaUndoAlt)
export const FaUnlinkIcon = createIcon(FaUnlink)
export const FaUnlockIcon = createIcon(FaUnlock)
export const FaUnlockAltIcon = createIcon(FaUnlockAlt)
export const FaUserIcon = createIcon(FaUser)
export const FaUserAltIcon = createIcon(FaUserAlt)
export const FaUserAltSlashIcon = createIcon(FaUserAltSlash)
export const FaUserCheckIcon = createIcon(FaUserCheck)
export const FaUserCircleIcon = createIcon(FaUserCircle)
export const FaUserCogIcon = createIcon(FaUserCog)
export const FaUserEditIcon = createIcon(FaUserEdit)
export const FaUserMinusIcon = createIcon(FaUserMinus)
export const FaUserPlusIcon = createIcon(FaUserPlus)
export const FaUserSlashIcon = createIcon(FaUserSlash)
export const FaUsersIcon = createIcon(FaUsers)
export const FaUsersCogIcon = createIcon(FaUsersCog)
export const FaVideoIcon = createIcon(FaVideo)
export const FaVideoSlashIcon = createIcon(FaVideoSlash)
export const FaVolumeDownIcon = createIcon(FaVolumeDown)
export const FaVolumeMuteIcon = createIcon(FaVolumeMute)
export const FaVolumeOffIcon = createIcon(FaVolumeOff)
export const FaVolumeUpIcon = createIcon(FaVolumeUp)
export const FaWalletIcon = createIcon(FaWallet)
export const FaWindowCloseIcon = createIcon(FaWindowClose)
export const FaWindowMaximizeIcon = createIcon(FaWindowMaximize)
export const FaWindowMinimizeIcon = createIcon(FaWindowMinimize)
export const FaWindowRestoreIcon = createIcon(FaWindowRestore)
export const FaWrenchIcon = createIcon(FaWrench)
export const FaYenSignIcon = createIcon(FaYenSign)

const VisuallyHiddenText = styled.span`
  ${VISUALLY_HIDDEN_STYLE}
`
