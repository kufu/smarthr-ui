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
  FaMedkit,
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
  FaTachometerAlt,
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
  FaUserClock,
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
import type { IconType } from 'react-icons'
import styled from 'styled-components'
import { VISUALLY_HIDDEN_STYLE } from '../../constants'
import { useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

/**
 * literal union type に補完を効かせるためのハック
 * https://github.com/microsoft/TypeScript/issues/29729
 */
type LiteralUnion<T extends U, U = string> = T | (U & Record<never, never>)

const definedColors = [
  'TEXT_BLACK',
  'TEXT_WHITE',
  'TEXT_GREY',
  'TEXT_DISABLED',
  'TEXT_LINK',
  'MAIN',
  'DANGER',
  'WARNING',
  'BRAND',
] as const
type DefinedColor = typeof definedColors[number]

const knownColorSet: Set<string> = new Set(definedColors)
function isDefinedColor(color: string): color is DefinedColor {
  return knownColorSet.has(color)
}

export interface IconProps {
  /**
   * アイコンの色
   * @type string | 'TEXT_BLACK' | 'TEXT_GREY' | 'TEXT_DISABLED' | 'TEXT_LINK' | 'MAIN' | 'DANGER' | 'WARNING' | 'BRAND'
   */
  color?: LiteralUnion<DefinedColor>
  /**
   * アイコンの大きさ
   */
  size?: number
}

type ElementProps = Omit<React.SVGAttributes<SVGAElement>, keyof IconProps>

export interface ComponentProps extends IconProps, ElementProps {
  /**
   * アイコンの説明テキスト
   * （表示はされないが、 DOM 上に存在することで意味を明示可能）
   */
  visuallyHiddenText?: string
  /**
   * コンポーネントに適用するクラス名
   */
  className?: string
}

const createIcon = (SvgIcon: IconType) => {
  const Icon: React.VFC<ComponentProps> = ({
    color,
    className = '',
    role = 'img',
    visuallyHiddenText,
    'aria-hidden': ariaHidden,
    focusable = false,
    ...props
  }) => {
    const hasLabelByAria =
      props['aria-label'] !== undefined || props['aria-labelledby'] !== undefined
    const isAriaHidden = ariaHidden !== undefined ? ariaHidden : !hasLabelByAria

    const theme = useTheme()
    const replacedColor = React.useMemo(() => {
      const asserted = color as string | undefined
      if (asserted && isDefinedColor(asserted)) {
        return theme.color[asserted]
      }
      return color
    }, [color, theme.color])

    const classNames = useClassNames()

    return (
      <>
        {visuallyHiddenText && <VisuallyHiddenText>{visuallyHiddenText}</VisuallyHiddenText>}
        <SvgIcon
          color={replacedColor}
          className={`${className} ${classNames.wrapper}`}
          role={role}
          aria-hidden={isAriaHidden || visuallyHiddenText !== undefined || undefined}
          focusable={focusable}
          {...props}
        />
      </>
    )
  }
  return Icon
}

const VisuallyHiddenText = styled.span`
  ${VISUALLY_HIDDEN_STYLE}
`

export const FaAddressBookIcon = /*#__PURE__*/ createIcon(FaAddressBook)
export const FaAddressCardIcon = /*#__PURE__*/ createIcon(FaAddressCard)
export const FaAngleDoubleDownIcon = /*#__PURE__*/ createIcon(FaAngleDoubleDown)
export const FaAngleDoubleLeftIcon = /*#__PURE__*/ createIcon(FaAngleDoubleLeft)
export const FaAngleDoubleRightIcon = /*#__PURE__*/ createIcon(FaAngleDoubleRight)
export const FaAngleDownIcon = /*#__PURE__*/ createIcon(FaAngleDown)
export const FaAngleLeftIcon = /*#__PURE__*/ createIcon(FaAngleLeft)
export const FaAngleRightIcon = /*#__PURE__*/ createIcon(FaAngleRight)
export const FaAngleUpIcon = /*#__PURE__*/ createIcon(FaAngleUp)
export const FaArchiveIcon = /*#__PURE__*/ createIcon(FaArchive)
export const FaArrowCircleDownIcon = /*#__PURE__*/ createIcon(FaArrowCircleDown)
export const FaArrowAltCircleDownIcon = /*#__PURE__*/ createIcon(FaArrowAltCircleDown)
export const FaArrowAltCircleLeftIcon = /*#__PURE__*/ createIcon(FaArrowAltCircleLeft)
export const FaArrowAltCircleRightIcon = /*#__PURE__*/ createIcon(FaArrowAltCircleRight)
export const FaArrowAltCircleUpIcon = /*#__PURE__*/ createIcon(FaArrowAltCircleUp)
export const FaArrowDownIcon = /*#__PURE__*/ createIcon(FaArrowDown)
export const FaArrowLeftIcon = /*#__PURE__*/ createIcon(FaArrowLeft)
export const FaArrowRightIcon = /*#__PURE__*/ createIcon(FaArrowRight)
export const FaArrowUpIcon = /*#__PURE__*/ createIcon(FaArrowUp)
export const FaArrowsAltIcon = /*#__PURE__*/ createIcon(FaArrowsAlt)
export const FaArrowsAltHIcon = /*#__PURE__*/ createIcon(FaArrowsAltH)
export const FaArrowsAltVIcon = /*#__PURE__*/ createIcon(FaArrowsAltV)
export const FaAsteriskIcon = /*#__PURE__*/ createIcon(FaAsterisk)
export const FaBanIcon = /*#__PURE__*/ createIcon(FaBan)
export const FaBarsIcon = /*#__PURE__*/ createIcon(FaBars)
export const FaBellIcon = /*#__PURE__*/ createIcon(FaBell)
export const FaBellSlashIcon = /*#__PURE__*/ createIcon(FaBellSlash)
export const FaBirthdayCakeIcon = /*#__PURE__*/ createIcon(FaBirthdayCake)
export const FaBoltIcon = /*#__PURE__*/ createIcon(FaBolt)
export const FaBookIcon = /*#__PURE__*/ createIcon(FaBook)
export const FaBookOpenIcon = /*#__PURE__*/ createIcon(FaBookOpen)
export const FaBookmarkIcon = /*#__PURE__*/ createIcon(FaBookmark)
export const FaBoxIcon = /*#__PURE__*/ createIcon(FaBox)
export const FaBoxOpenIcon = /*#__PURE__*/ createIcon(FaBoxOpen)
export const FaBoxesIcon = /*#__PURE__*/ createIcon(FaBoxes)
export const FaBriefcaseIcon = /*#__PURE__*/ createIcon(FaBriefcase)
export const FaBuildingIcon = /*#__PURE__*/ createIcon(FaBuilding)
export const FaBullhornIcon = /*#__PURE__*/ createIcon(FaBullhorn)
export const FaBusIcon = /*#__PURE__*/ createIcon(FaBus)
export const FaBusAltIcon = /*#__PURE__*/ createIcon(FaBusAlt)
export const FaBusinessTimeIcon = /*#__PURE__*/ createIcon(FaBusinessTime)
export const FaCalculatorIcon = /*#__PURE__*/ createIcon(FaCalculator)
export const FaCalendarIcon = /*#__PURE__*/ createIcon(FaCalendar)
export const FaCalendarAltIcon = /*#__PURE__*/ createIcon(FaCalendarAlt)
export const FaCalendarCheckIcon = /*#__PURE__*/ createIcon(FaCalendarCheck)
export const FaCalendarDayIcon = /*#__PURE__*/ createIcon(FaCalendarDay)
export const FaCalendarMinusIcon = /*#__PURE__*/ createIcon(FaCalendarMinus)
export const FaCalendarPlusIcon = /*#__PURE__*/ createIcon(FaCalendarPlus)
export const FaCalendarTimesIcon = /*#__PURE__*/ createIcon(FaCalendarTimes)
export const FaCalendarWeekIcon = /*#__PURE__*/ createIcon(FaCalendarWeek)
export const FaCameraIcon = /*#__PURE__*/ createIcon(FaCamera)
export const FaCarIcon = /*#__PURE__*/ createIcon(FaCar)
export const FaCarAltIcon = /*#__PURE__*/ createIcon(FaCarAlt)
export const FaCarSideIcon = /*#__PURE__*/ createIcon(FaCarSide)
export const FaCaretDownIcon = /*#__PURE__*/ createIcon(FaCaretDown)
export const FaCaretLeftIcon = /*#__PURE__*/ createIcon(FaCaretLeft)
export const FaCaretRightIcon = /*#__PURE__*/ createIcon(FaCaretRight)
export const FaCaretSquareDownIcon = /*#__PURE__*/ createIcon(FaCaretSquareDown)
export const FaCaretSquareLeftIcon = /*#__PURE__*/ createIcon(FaCaretSquareLeft)
export const FaCaretSquareRightIcon = /*#__PURE__*/ createIcon(FaCaretSquareRight)
export const FaCaretSquareUpIcon = /*#__PURE__*/ createIcon(FaCaretSquareUp)
export const FaCaretUpIcon = /*#__PURE__*/ createIcon(FaCaretUp)
export const FaChartAreaIcon = /*#__PURE__*/ createIcon(FaChartArea)
export const FaChartBarIcon = /*#__PURE__*/ createIcon(FaChartBar)
export const FaChartLineIcon = /*#__PURE__*/ createIcon(FaChartLine)
export const FaChartPieIcon = /*#__PURE__*/ createIcon(FaChartPie)
export const FaCheckIcon = /*#__PURE__*/ createIcon(FaCheck)
export const FaCheckCircleIcon = /*#__PURE__*/ createIcon(FaCheckCircle)
export const FaCheckSquareIcon = /*#__PURE__*/ createIcon(FaCheckSquare)
export const FaChevronCircleDownIcon = /*#__PURE__*/ createIcon(FaChevronCircleDown)
export const FaChevronCircleLeftIcon = /*#__PURE__*/ createIcon(FaChevronCircleLeft)
export const FaChevronCircleRightIcon = /*#__PURE__*/ createIcon(FaChevronCircleRight)
export const FaChevronCircleUpIcon = /*#__PURE__*/ createIcon(FaChevronCircleUp)
export const FaChevronDownIcon = /*#__PURE__*/ createIcon(FaChevronDown)
export const FaChevronLeftIcon = /*#__PURE__*/ createIcon(FaChevronLeft)
export const FaChevronRightIcon = /*#__PURE__*/ createIcon(FaChevronRight)
export const FaChevronUpIcon = /*#__PURE__*/ createIcon(FaChevronUp)
export const FaCircleIcon = /*#__PURE__*/ createIcon(FaCircle)
export const FaClipboardIcon = /*#__PURE__*/ createIcon(FaClipboard)
export const FaClipboardCheckIcon = /*#__PURE__*/ createIcon(FaClipboardCheck)
export const FaClipboardListIcon = /*#__PURE__*/ createIcon(FaClipboardList)
export const FaClockIcon = /*#__PURE__*/ createIcon(FaClock)
export const FaCloneIcon = /*#__PURE__*/ createIcon(FaClone)
export const FaCloudIcon = /*#__PURE__*/ createIcon(FaCloud)
export const FaCloudDownloadAltIcon = /*#__PURE__*/ createIcon(FaCloudDownloadAlt)
export const FaCloudUploadAltIcon = /*#__PURE__*/ createIcon(FaCloudUploadAlt)
export const FaCodeIcon = /*#__PURE__*/ createIcon(FaCode)
export const FaCogIcon = /*#__PURE__*/ createIcon(FaCog)
export const FaCogsIcon = /*#__PURE__*/ createIcon(FaCogs)
export const FaCoinsIcon = /*#__PURE__*/ createIcon(FaCoins)
export const FaColumnsIcon = /*#__PURE__*/ createIcon(FaColumns)
export const FaCommentIcon = /*#__PURE__*/ createIcon(FaComment)
export const FaCommentAltIcon = /*#__PURE__*/ createIcon(FaCommentAlt)
export const FaCommentDotsIcon = /*#__PURE__*/ createIcon(FaCommentDots)
export const FaCommentSlashIcon = /*#__PURE__*/ createIcon(FaCommentSlash)
export const FaCommentsIcon = /*#__PURE__*/ createIcon(FaComments)
export const FaCompressIcon = /*#__PURE__*/ createIcon(FaCompress)
export const FaCopyIcon = /*#__PURE__*/ createIcon(FaCopy)
export const FaCreditCardIcon = /*#__PURE__*/ createIcon(FaCreditCard)
export const FaCubeIcon = /*#__PURE__*/ createIcon(FaCube)
export const FaCubesIcon = /*#__PURE__*/ createIcon(FaCubes)
export const FaDatabaseIcon = /*#__PURE__*/ createIcon(FaDatabase)
export const FaDoorClosedIcon = /*#__PURE__*/ createIcon(FaDoorClosed)
export const FaDoorOpenIcon = /*#__PURE__*/ createIcon(FaDoorOpen)
export const FaEditIcon = /*#__PURE__*/ createIcon(FaEdit)
export const FaEllipsisHIcon = /*#__PURE__*/ createIcon(FaEllipsisH)
export const FaEllipsisVIcon = /*#__PURE__*/ createIcon(FaEllipsisV)
export const FaEnvelopeIcon = /*#__PURE__*/ createIcon(FaEnvelope)
export const FaEnvelopeOpenIcon = /*#__PURE__*/ createIcon(FaEnvelopeOpen)
export const FaEnvelopeOpenTextIcon = /*#__PURE__*/ createIcon(FaEnvelopeOpenText)
export const FaExchangeAltIcon = /*#__PURE__*/ createIcon(FaExchangeAlt)
export const FaExclamationIcon = /*#__PURE__*/ createIcon(FaExclamation)
export const FaExclamationCircleIcon = /*#__PURE__*/ createIcon(FaExclamationCircle)
export const FaExclamationTriangleIcon = /*#__PURE__*/ createIcon(FaExclamationTriangle)
export const FaExpandIcon = /*#__PURE__*/ createIcon(FaExpand)
export const FaExpandArrowsAltIcon = /*#__PURE__*/ createIcon(FaExpandArrowsAlt)
export const FaExternalLinkAltIcon = /*#__PURE__*/ createIcon(FaExternalLinkAlt)
export const FaEyeIcon = /*#__PURE__*/ createIcon(FaEye)
export const FaEyeSlashIcon = /*#__PURE__*/ createIcon(FaEyeSlash)
export const FaFileIcon = /*#__PURE__*/ createIcon(FaFile)
export const FaFileAltIcon = /*#__PURE__*/ createIcon(FaFileAlt)
export const FaFileArchiveIcon = /*#__PURE__*/ createIcon(FaFileArchive)
export const FaFileDownloadIcon = /*#__PURE__*/ createIcon(FaFileDownload)
export const FaFileExportIcon = /*#__PURE__*/ createIcon(FaFileExport)
export const FaFileImportIcon = /*#__PURE__*/ createIcon(FaFileImport)
export const FaFileUploadIcon = /*#__PURE__*/ createIcon(FaFileUpload)
export const FaFilterIcon = /*#__PURE__*/ createIcon(FaFilter)
export const FaFlagIcon = /*#__PURE__*/ createIcon(FaFlag)
export const FaFolderIcon = /*#__PURE__*/ createIcon(FaFolder)
export const FaFolderMinusIcon = /*#__PURE__*/ createIcon(FaFolderMinus)
export const FaFolderOpenIcon = /*#__PURE__*/ createIcon(FaFolderOpen)
export const FaFolderPlusIcon = /*#__PURE__*/ createIcon(FaFolderPlus)
export const FaFontIcon = /*#__PURE__*/ createIcon(FaFont)
export const FaForwardIcon = /*#__PURE__*/ createIcon(FaForward)
export const FaGiftIcon = /*#__PURE__*/ createIcon(FaGift)
export const FaGlobeIcon = /*#__PURE__*/ createIcon(FaGlobe)
export const FaGraduationCapIcon = /*#__PURE__*/ createIcon(FaGraduationCap)
export const FaGripHorizontalIcon = /*#__PURE__*/ createIcon(FaGripHorizontal)
export const FaGripLinesIcon = /*#__PURE__*/ createIcon(FaGripLines)
export const FaGripLinesVerticalIcon = /*#__PURE__*/ createIcon(FaGripLinesVertical)
export const FaGripVerticalIcon = /*#__PURE__*/ createIcon(FaGripVertical)
export const FaHandPaperIcon = /*#__PURE__*/ createIcon(FaHandPaper)
export const FaHandPointDownIcon = /*#__PURE__*/ createIcon(FaHandPointDown)
export const FaHandPointLeftIcon = /*#__PURE__*/ createIcon(FaHandPointLeft)
export const FaHandPointRightIcon = /*#__PURE__*/ createIcon(FaHandPointRight)
export const FaHandPointUpIcon = /*#__PURE__*/ createIcon(FaHandPointUp)
export const FaHandsIcon = /*#__PURE__*/ createIcon(FaHands)
export const FaHandshakeIcon = /*#__PURE__*/ createIcon(FaHandshake)
export const FaHeartIcon = /*#__PURE__*/ createIcon(FaHeart)
export const FaHistoryIcon = /*#__PURE__*/ createIcon(FaHistory)
export const FaHomeIcon = /*#__PURE__*/ createIcon(FaHome)
export const FaHospitalIcon = /*#__PURE__*/ createIcon(FaHospital)
export const FaHospitalAltIcon = /*#__PURE__*/ createIcon(FaHospitalAlt)
export const FaHourglassIcon = /*#__PURE__*/ createIcon(FaHourglass)
export const FaHourglassEndIcon = /*#__PURE__*/ createIcon(FaHourglassEnd)
export const FaHourglassHalfIcon = /*#__PURE__*/ createIcon(FaHourglassHalf)
export const FaHourglassStartIcon = /*#__PURE__*/ createIcon(FaHourglassStart)
export const FaIdBadgeIcon = /*#__PURE__*/ createIcon(FaIdBadge)
export const FaIdCardIcon = /*#__PURE__*/ createIcon(FaIdCard)
export const FaIdCardAltIcon = /*#__PURE__*/ createIcon(FaIdCardAlt)
export const FaImageIcon = /*#__PURE__*/ createIcon(FaImage)
export const FaImagesIcon = /*#__PURE__*/ createIcon(FaImages)
export const FaInboxIcon = /*#__PURE__*/ createIcon(FaInbox)
export const FaInfoIcon = /*#__PURE__*/ createIcon(FaInfo)
export const FaInfoCircleIcon = /*#__PURE__*/ createIcon(FaInfoCircle)
export const FaKeyIcon = /*#__PURE__*/ createIcon(FaKey)
export const FaKeyboardIcon = /*#__PURE__*/ createIcon(FaKeyboard)
export const FaLightbulbIcon = /*#__PURE__*/ createIcon(FaLightbulb)
export const FaLinkIcon = /*#__PURE__*/ createIcon(FaLink)
export const FaListIcon = /*#__PURE__*/ createIcon(FaList)
export const FaListAltIcon = /*#__PURE__*/ createIcon(FaListAlt)
export const FaListOlIcon = /*#__PURE__*/ createIcon(FaListOl)
export const FaListUlIcon = /*#__PURE__*/ createIcon(FaListUl)
export const FaLockIcon = /*#__PURE__*/ createIcon(FaLock)
export const FaLockOpenIcon = /*#__PURE__*/ createIcon(FaLockOpen)
export const FaLongArrowAltDownIcon = /*#__PURE__*/ createIcon(FaLongArrowAltDown)
export const FaLongArrowAltLeftIcon = /*#__PURE__*/ createIcon(FaLongArrowAltLeft)
export const FaLongArrowAltRightIcon = /*#__PURE__*/ createIcon(FaLongArrowAltRight)
export const FaLongArrowAltUpIcon = /*#__PURE__*/ createIcon(FaLongArrowAltUp)
export const FaMedkitIcon = /*#__PURE__*/ createIcon(FaMedkit)
export const FaMinusIcon = /*#__PURE__*/ createIcon(FaMinus)
export const FaMinusCircleIcon = /*#__PURE__*/ createIcon(FaMinusCircle)
export const FaMinusSquareIcon = /*#__PURE__*/ createIcon(FaMinusSquare)
export const FaMobileIcon = /*#__PURE__*/ createIcon(FaMobile)
export const FaMobileAltIcon = /*#__PURE__*/ createIcon(FaMobileAlt)
export const FaMoneyBillIcon = /*#__PURE__*/ createIcon(FaMoneyBill)
export const FaMoneyBillAltIcon = /*#__PURE__*/ createIcon(FaMoneyBillAlt)
export const FaMoneyBillWaveIcon = /*#__PURE__*/ createIcon(FaMoneyBillWave)
export const FaMoneyBillWaveAltIcon = /*#__PURE__*/ createIcon(FaMoneyBillWaveAlt)
export const FaMoneyCheckIcon = /*#__PURE__*/ createIcon(FaMoneyCheck)
export const FaMoneyCheckAltIcon = /*#__PURE__*/ createIcon(FaMoneyCheckAlt)
export const FaPaperPlaneIcon = /*#__PURE__*/ createIcon(FaPaperPlane)
export const FaPaperclipIcon = /*#__PURE__*/ createIcon(FaPaperclip)
export const FaPasteIcon = /*#__PURE__*/ createIcon(FaPaste)
export const FaPenIcon = /*#__PURE__*/ createIcon(FaPen)
export const FaPencilAltIcon = /*#__PURE__*/ createIcon(FaPencilAlt)
export const FaPhoneIcon = /*#__PURE__*/ createIcon(FaPhone)
export const FaPhoneSlashIcon = /*#__PURE__*/ createIcon(FaPhoneSlash)
export const FaPiggyBankIcon = /*#__PURE__*/ createIcon(FaPiggyBank)
export const FaPlaneIcon = /*#__PURE__*/ createIcon(FaPlane)
export const FaPlayIcon = /*#__PURE__*/ createIcon(FaPlay)
export const FaPlayCircleIcon = /*#__PURE__*/ createIcon(FaPlayCircle)
export const FaPlusIcon = /*#__PURE__*/ createIcon(FaPlus)
export const FaPlusCircleIcon = /*#__PURE__*/ createIcon(FaPlusCircle)
export const FaPlusSquareIcon = /*#__PURE__*/ createIcon(FaPlusSquare)
export const FaPollIcon = /*#__PURE__*/ createIcon(FaPoll)
export const FaPollHIcon = /*#__PURE__*/ createIcon(FaPollH)
export const FaPortraitIcon = /*#__PURE__*/ createIcon(FaPortrait)
export const FaPowerOffIcon = /*#__PURE__*/ createIcon(FaPowerOff)
export const FaPrintIcon = /*#__PURE__*/ createIcon(FaPrint)
export const FaQrcodeIcon = /*#__PURE__*/ createIcon(FaQrcode)
export const FaQuestionIcon = /*#__PURE__*/ createIcon(FaQuestion)
export const FaQuestionCircleIcon = /*#__PURE__*/ createIcon(FaQuestionCircle)
export const FaRandomIcon = /*#__PURE__*/ createIcon(FaRandom)
export const FaReceiptIcon = /*#__PURE__*/ createIcon(FaReceipt)
export const FaRedoIcon = /*#__PURE__*/ createIcon(FaRedo)
export const FaRedoAltIcon = /*#__PURE__*/ createIcon(FaRedoAlt)
export const FaRegDotCircleIcon = /*#__PURE__*/ createIcon(FaRegDotCircle)
export const FaReplyIcon = /*#__PURE__*/ createIcon(FaReply)
export const FaReplyAllIcon = /*#__PURE__*/ createIcon(FaReplyAll)
export const FaRocketIcon = /*#__PURE__*/ createIcon(FaRocket)
export const FaSaveIcon = /*#__PURE__*/ createIcon(FaSave)
export const FaSearchIcon = /*#__PURE__*/ createIcon(FaSearch)
export const FaSearchMinusIcon = /*#__PURE__*/ createIcon(FaSearchMinus)
export const FaSearchPlusIcon = /*#__PURE__*/ createIcon(FaSearchPlus)
export const FaShareIcon = /*#__PURE__*/ createIcon(FaShare)
export const FaShareAltIcon = /*#__PURE__*/ createIcon(FaShareAlt)
export const FaShareSquareIcon = /*#__PURE__*/ createIcon(FaShareSquare)
export const FaShieldAltIcon = /*#__PURE__*/ createIcon(FaShieldAlt)
export const FaShoppingBagIcon = /*#__PURE__*/ createIcon(FaShoppingBag)
export const FaShoppingBasketIcon = /*#__PURE__*/ createIcon(FaShoppingBasket)
export const FaShoppingCartIcon = /*#__PURE__*/ createIcon(FaShoppingCart)
export const FaSignInAltIcon = /*#__PURE__*/ createIcon(FaSignInAlt)
export const FaSignOutAltIcon = /*#__PURE__*/ createIcon(FaSignOutAlt)
export const FaSlidersHIcon = /*#__PURE__*/ createIcon(FaSlidersH)
export const FaSortIcon = /*#__PURE__*/ createIcon(FaSort)
export const FaSortAlphaDownIcon = /*#__PURE__*/ createIcon(FaSortAlphaDown)
export const FaSortAlphaUpIcon = /*#__PURE__*/ createIcon(FaSortAlphaUp)
export const FaSortAmountDownIcon = /*#__PURE__*/ createIcon(FaSortAmountDown)
export const FaSortAmountUpIcon = /*#__PURE__*/ createIcon(FaSortAmountUp)
export const FaSortDownIcon = /*#__PURE__*/ createIcon(FaSortDown)
export const FaSortNumericDownIcon = /*#__PURE__*/ createIcon(FaSortNumericDown)
export const FaSortNumericUpIcon = /*#__PURE__*/ createIcon(FaSortNumericUp)
export const FaSortUpIcon = /*#__PURE__*/ createIcon(FaSortUp)
export const FaStarIcon = /*#__PURE__*/ createIcon(FaStar)
export const FaStepBackwardIcon = /*#__PURE__*/ createIcon(FaStepBackward)
export const FaStepForwardIcon = /*#__PURE__*/ createIcon(FaStepForward)
export const FaStickyNoteIcon = /*#__PURE__*/ createIcon(FaStickyNote)
export const FaStopIcon = /*#__PURE__*/ createIcon(FaStop)
export const FaStopCircleIcon = /*#__PURE__*/ createIcon(FaStopCircle)
export const FaStreamIcon = /*#__PURE__*/ createIcon(FaStream)
export const FaSubwayIcon = /*#__PURE__*/ createIcon(FaSubway)
export const FaSyncIcon = /*#__PURE__*/ createIcon(FaSync)
export const FaSyncAltIcon = /*#__PURE__*/ createIcon(FaSyncAlt)
export const FaTableIcon = /*#__PURE__*/ createIcon(FaTable)
export const FaTabletIcon = /*#__PURE__*/ createIcon(FaTablet)
export const FaTabletAltIcon = /*#__PURE__*/ createIcon(FaTabletAlt)
export const FaTachometerAltIcon = /*#__PURE__*/ createIcon(FaTachometerAlt)
export const FaTagIcon = /*#__PURE__*/ createIcon(FaTag)
export const FaTagsIcon = /*#__PURE__*/ createIcon(FaTags)
export const FaTasksIcon = /*#__PURE__*/ createIcon(FaTasks)
export const FaTaxiIcon = /*#__PURE__*/ createIcon(FaTaxi)
export const FaThIcon = /*#__PURE__*/ createIcon(FaTh)
export const FaThLargeIcon = /*#__PURE__*/ createIcon(FaThLarge)
export const FaThListIcon = /*#__PURE__*/ createIcon(FaThList)
export const FaTimesIcon = /*#__PURE__*/ createIcon(FaTimes)
export const FaTimesCircleIcon = /*#__PURE__*/ createIcon(FaTimesCircle)
export const FaToolboxIcon = /*#__PURE__*/ createIcon(FaToolbox)
export const FaToolsIcon = /*#__PURE__*/ createIcon(FaTools)
export const FaTrashIcon = /*#__PURE__*/ createIcon(FaTrash)
export const FaTrashAltIcon = /*#__PURE__*/ createIcon(FaTrashAlt)
export const FaTrashRestoreIcon = /*#__PURE__*/ createIcon(FaTrashRestore)
export const FaTrashRestoreAltIcon = /*#__PURE__*/ createIcon(FaTrashRestoreAlt)
export const FaUndoIcon = /*#__PURE__*/ createIcon(FaUndo)
export const FaUndoAltIcon = /*#__PURE__*/ createIcon(FaUndoAlt)
export const FaUnlinkIcon = /*#__PURE__*/ createIcon(FaUnlink)
export const FaUnlockIcon = /*#__PURE__*/ createIcon(FaUnlock)
export const FaUnlockAltIcon = /*#__PURE__*/ createIcon(FaUnlockAlt)
export const FaUserIcon = /*#__PURE__*/ createIcon(FaUser)
export const FaUserAltIcon = /*#__PURE__*/ createIcon(FaUserAlt)
export const FaUserAltSlashIcon = /*#__PURE__*/ createIcon(FaUserAltSlash)
export const FaUserCheckIcon = /*#__PURE__*/ createIcon(FaUserCheck)
export const FaUserCircleIcon = /*#__PURE__*/ createIcon(FaUserCircle)
export const FaUserClockIcon = /*#__PURE__*/ createIcon(FaUserClock)
export const FaUserCogIcon = /*#__PURE__*/ createIcon(FaUserCog)
export const FaUserEditIcon = /*#__PURE__*/ createIcon(FaUserEdit)
export const FaUserMinusIcon = /*#__PURE__*/ createIcon(FaUserMinus)
export const FaUserPlusIcon = /*#__PURE__*/ createIcon(FaUserPlus)
export const FaUserSlashIcon = /*#__PURE__*/ createIcon(FaUserSlash)
export const FaUsersIcon = /*#__PURE__*/ createIcon(FaUsers)
export const FaUsersCogIcon = /*#__PURE__*/ createIcon(FaUsersCog)
export const FaVideoIcon = /*#__PURE__*/ createIcon(FaVideo)
export const FaVideoSlashIcon = /*#__PURE__*/ createIcon(FaVideoSlash)
export const FaVolumeDownIcon = /*#__PURE__*/ createIcon(FaVolumeDown)
export const FaVolumeMuteIcon = /*#__PURE__*/ createIcon(FaVolumeMute)
export const FaVolumeOffIcon = /*#__PURE__*/ createIcon(FaVolumeOff)
export const FaVolumeUpIcon = /*#__PURE__*/ createIcon(FaVolumeUp)
export const FaWalletIcon = /*#__PURE__*/ createIcon(FaWallet)
export const FaWindowCloseIcon = /*#__PURE__*/ createIcon(FaWindowClose)
export const FaWindowMaximizeIcon = /*#__PURE__*/ createIcon(FaWindowMaximize)
export const FaWindowMinimizeIcon = /*#__PURE__*/ createIcon(FaWindowMinimize)
export const FaWindowRestoreIcon = /*#__PURE__*/ createIcon(FaWindowRestore)
export const FaWrenchIcon = /*#__PURE__*/ createIcon(FaWrench)
export const FaYenSignIcon = /*#__PURE__*/ createIcon(FaYenSign)
