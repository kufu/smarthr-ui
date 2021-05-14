import { Story } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import {
  ComponentProps,
  FaAddressBookIcon,
  FaAddressCardIcon,
  FaAngleDoubleDownIcon,
  FaAngleDoubleLeftIcon,
  FaAngleDoubleRightIcon,
  FaAngleDownIcon,
  FaAngleLeftIcon,
  FaAngleRightIcon,
  FaAngleUpIcon,
  FaArchiveIcon,
  FaArrowAltCircleDownIcon,
  FaArrowAltCircleLeftIcon,
  FaArrowAltCircleRightIcon,
  FaArrowAltCircleUpIcon,
  FaArrowCircleDownIcon,
  FaArrowDownIcon,
  FaArrowLeftIcon,
  FaArrowRightIcon,
  FaArrowUpIcon,
  FaArrowsAltHIcon,
  FaArrowsAltIcon,
  FaArrowsAltVIcon,
  FaAsteriskIcon,
  FaBanIcon,
  FaBarsIcon,
  FaBellIcon,
  FaBellSlashIcon,
  FaBirthdayCakeIcon,
  FaBoltIcon,
  FaBookIcon,
  FaBookOpenIcon,
  FaBookmarkIcon,
  FaBoxIcon,
  FaBoxOpenIcon,
  FaBoxesIcon,
  FaBriefcaseIcon,
  FaBuildingIcon,
  FaBullhornIcon,
  FaBusAltIcon,
  FaBusIcon,
  FaBusinessTimeIcon,
  FaCalculatorIcon,
  FaCalendarAltIcon,
  FaCalendarCheckIcon,
  FaCalendarDayIcon,
  FaCalendarIcon,
  FaCalendarMinusIcon,
  FaCalendarPlusIcon,
  FaCalendarTimesIcon,
  FaCalendarWeekIcon,
  FaCameraIcon,
  FaCarAltIcon,
  FaCarIcon,
  FaCarSideIcon,
  FaCaretDownIcon,
  FaCaretLeftIcon,
  FaCaretRightIcon,
  FaCaretSquareDownIcon,
  FaCaretSquareLeftIcon,
  FaCaretSquareRightIcon,
  FaCaretSquareUpIcon,
  FaCaretUpIcon,
  FaChartAreaIcon,
  FaChartBarIcon,
  FaChartLineIcon,
  FaChartPieIcon,
  FaCheckCircleIcon,
  FaCheckIcon,
  FaCheckSquareIcon,
  FaChevronCircleDownIcon,
  FaChevronCircleLeftIcon,
  FaChevronCircleRightIcon,
  FaChevronCircleUpIcon,
  FaChevronDownIcon,
  FaChevronLeftIcon,
  FaChevronRightIcon,
  FaChevronUpIcon,
  FaCircleIcon,
  FaClipboardCheckIcon,
  FaClipboardIcon,
  FaClipboardListIcon,
  FaClockIcon,
  FaCloneIcon,
  FaCloudDownloadAltIcon,
  FaCloudIcon,
  FaCloudUploadAltIcon,
  FaCodeIcon,
  FaCogIcon,
  FaCogsIcon,
  FaCoinsIcon,
  FaColumnsIcon,
  FaCommentAltIcon,
  FaCommentDotsIcon,
  FaCommentIcon,
  FaCommentSlashIcon,
  FaCommentsIcon,
  FaCompressIcon,
  FaCopyIcon,
  FaCreditCardIcon,
  FaCubeIcon,
  FaCubesIcon,
  FaDatabaseIcon,
  FaDoorClosedIcon,
  FaDoorOpenIcon,
  FaEditIcon,
  FaEllipsisHIcon,
  FaEllipsisVIcon,
  FaEnvelopeIcon,
  FaEnvelopeOpenIcon,
  FaEnvelopeOpenTextIcon,
  FaExchangeAltIcon,
  FaExclamationCircleIcon,
  FaExclamationIcon,
  FaExclamationTriangleIcon,
  FaExpandArrowsAltIcon,
  FaExpandIcon,
  FaExternalLinkAltIcon,
  FaEyeIcon,
  FaEyeSlashIcon,
  FaFileAltIcon,
  FaFileArchiveIcon,
  FaFileDownloadIcon,
  FaFileExportIcon,
  FaFileIcon,
  FaFileImportIcon,
  FaFileUploadIcon,
  FaFilterIcon,
  FaFlagIcon,
  FaFolderIcon,
  FaFolderMinusIcon,
  FaFolderOpenIcon,
  FaFolderPlusIcon,
  FaFontIcon,
  FaForwardIcon,
  FaGiftIcon,
  FaGlobeIcon,
  FaGraduationCapIcon,
  FaGripHorizontalIcon,
  FaGripLinesIcon,
  FaGripLinesVerticalIcon,
  FaGripVerticalIcon,
  FaHandPaperIcon,
  FaHandPointDownIcon,
  FaHandPointLeftIcon,
  FaHandPointRightIcon,
  FaHandPointUpIcon,
  FaHandsIcon,
  FaHandshakeIcon,
  FaHeartIcon,
  FaHistoryIcon,
  FaHomeIcon,
  FaHospitalAltIcon,
  FaHospitalIcon,
  FaHourglassEndIcon,
  FaHourglassHalfIcon,
  FaHourglassIcon,
  FaHourglassStartIcon,
  FaIdBadgeIcon,
  FaIdCardAltIcon,
  FaIdCardIcon,
  FaImageIcon,
  FaImagesIcon,
  FaInboxIcon,
  FaInfoCircleIcon,
  FaInfoIcon,
  FaKeyIcon,
  FaKeyboardIcon,
  FaLightbulbIcon,
  FaLinkIcon,
  FaListAltIcon,
  FaListIcon,
  FaListOlIcon,
  FaListUlIcon,
  FaLockIcon,
  FaLockOpenIcon,
  FaLongArrowAltDownIcon,
  FaLongArrowAltLeftIcon,
  FaLongArrowAltRightIcon,
  FaLongArrowAltUpIcon,
  FaMedkitIcon,
  FaMinusCircleIcon,
  FaMinusIcon,
  FaMinusSquareIcon,
  FaMobileAltIcon,
  FaMobileIcon,
  FaMoneyBillAltIcon,
  FaMoneyBillIcon,
  FaMoneyBillWaveAltIcon,
  FaMoneyBillWaveIcon,
  FaMoneyCheckAltIcon,
  FaMoneyCheckIcon,
  FaPaperPlaneIcon,
  FaPaperclipIcon,
  FaPasteIcon,
  FaPenIcon,
  FaPencilAltIcon,
  FaPhoneIcon,
  FaPhoneSlashIcon,
  FaPiggyBankIcon,
  FaPlaneIcon,
  FaPlayCircleIcon,
  FaPlayIcon,
  FaPlusCircleIcon,
  FaPlusIcon,
  FaPlusSquareIcon,
  FaPollHIcon,
  FaPollIcon,
  FaPortraitIcon,
  FaPowerOffIcon,
  FaPrintIcon,
  FaQrcodeIcon,
  FaQuestionCircleIcon,
  FaQuestionIcon,
  FaRandomIcon,
  FaReceiptIcon,
  FaRedoAltIcon,
  FaRedoIcon,
  FaRegDotCircleIcon,
  FaReplyAllIcon,
  FaReplyIcon,
  FaRocketIcon,
  FaSaveIcon,
  FaSearchIcon,
  FaSearchMinusIcon,
  FaSearchPlusIcon,
  FaShareAltIcon,
  FaShareIcon,
  FaShareSquareIcon,
  FaShieldAltIcon,
  FaShoppingBagIcon,
  FaShoppingBasketIcon,
  FaShoppingCartIcon,
  FaSignInAltIcon,
  FaSignOutAltIcon,
  FaSlidersHIcon,
  FaSortAlphaDownIcon,
  FaSortAlphaUpIcon,
  FaSortAmountDownIcon,
  FaSortAmountUpIcon,
  FaSortDownIcon,
  FaSortIcon,
  FaSortNumericDownIcon,
  FaSortNumericUpIcon,
  FaSortUpIcon,
  FaStarIcon,
  FaStepBackwardIcon,
  FaStepForwardIcon,
  FaStickyNoteIcon,
  FaStopCircleIcon,
  FaStopIcon,
  FaStreamIcon,
  FaSubwayIcon,
  FaSyncAltIcon,
  FaSyncIcon,
  FaTableIcon,
  FaTabletAltIcon,
  FaTabletIcon,
  FaTachometerAltIcon,
  FaTagIcon,
  FaTagsIcon,
  FaTasksIcon,
  FaTaxiIcon,
  FaThIcon,
  FaThLargeIcon,
  FaThListIcon,
  FaTimesCircleIcon,
  FaTimesIcon,
  FaToolboxIcon,
  FaToolsIcon,
  FaTrashAltIcon,
  FaTrashIcon,
  FaTrashRestoreAltIcon,
  FaTrashRestoreIcon,
  FaUndoAltIcon,
  FaUndoIcon,
  FaUnlinkIcon,
  FaUnlockAltIcon,
  FaUnlockIcon,
  FaUserAltIcon,
  FaUserAltSlashIcon,
  FaUserCheckIcon,
  FaUserCircleIcon,
  FaUserClockIcon,
  FaUserCogIcon,
  FaUserEditIcon,
  FaUserIcon,
  FaUserMinusIcon,
  FaUserPlusIcon,
  FaUserSlashIcon,
  FaUsersCogIcon,
  FaUsersIcon,
  FaVideoIcon,
  FaVideoSlashIcon,
  FaVolumeDownIcon,
  FaVolumeMuteIcon,
  FaVolumeOffIcon,
  FaVolumeUpIcon,
  FaWalletIcon,
  FaWindowCloseIcon,
  FaWindowMaximizeIcon,
  FaWindowMinimizeIcon,
  FaWindowRestoreIcon,
  FaWrenchIcon,
  FaYenSignIcon,
} from './Icon'
import readme from './README.md'

const icons: Array<React.ComponentType<ComponentProps>> = [
  FaAddressBookIcon,
  FaAddressCardIcon,
  FaAngleDoubleDownIcon,
  FaAngleDoubleLeftIcon,
  FaAngleDoubleRightIcon,
  FaAngleDownIcon,
  FaAngleLeftIcon,
  FaAngleRightIcon,
  FaAngleUpIcon,
  FaArchiveIcon,
  FaArrowAltCircleDownIcon,
  FaArrowAltCircleLeftIcon,
  FaArrowAltCircleRightIcon,
  FaArrowAltCircleUpIcon,
  FaArrowCircleDownIcon,
  FaArrowDownIcon,
  FaArrowLeftIcon,
  FaArrowRightIcon,
  FaArrowUpIcon,
  FaArrowsAltHIcon,
  FaArrowsAltIcon,
  FaArrowsAltVIcon,
  FaAsteriskIcon,
  FaBanIcon,
  FaBarsIcon,
  FaBellIcon,
  FaBellSlashIcon,
  FaBirthdayCakeIcon,
  FaBoltIcon,
  FaBookIcon,
  FaBookOpenIcon,
  FaBookmarkIcon,
  FaBoxIcon,
  FaBoxOpenIcon,
  FaBoxesIcon,
  FaBriefcaseIcon,
  FaBuildingIcon,
  FaBullhornIcon,
  FaBusAltIcon,
  FaBusIcon,
  FaBusinessTimeIcon,
  FaCalculatorIcon,
  FaCalendarAltIcon,
  FaCalendarCheckIcon,
  FaCalendarDayIcon,
  FaCalendarIcon,
  FaCalendarMinusIcon,
  FaCalendarPlusIcon,
  FaCalendarTimesIcon,
  FaCalendarWeekIcon,
  FaCameraIcon,
  FaCarAltIcon,
  FaCarIcon,
  FaCarSideIcon,
  FaCaretDownIcon,
  FaCaretLeftIcon,
  FaCaretRightIcon,
  FaCaretSquareDownIcon,
  FaCaretSquareLeftIcon,
  FaCaretSquareRightIcon,
  FaCaretSquareUpIcon,
  FaCaretUpIcon,
  FaChartAreaIcon,
  FaChartBarIcon,
  FaChartLineIcon,
  FaChartPieIcon,
  FaCheckCircleIcon,
  FaCheckIcon,
  FaCheckSquareIcon,
  FaChevronCircleDownIcon,
  FaChevronCircleLeftIcon,
  FaChevronCircleRightIcon,
  FaChevronCircleUpIcon,
  FaChevronDownIcon,
  FaChevronLeftIcon,
  FaChevronRightIcon,
  FaChevronUpIcon,
  FaCircleIcon,
  FaClipboardCheckIcon,
  FaClipboardIcon,
  FaClipboardListIcon,
  FaClockIcon,
  FaCloneIcon,
  FaCloudDownloadAltIcon,
  FaCloudIcon,
  FaCloudUploadAltIcon,
  FaCodeIcon,
  FaCogIcon,
  FaCogsIcon,
  FaCoinsIcon,
  FaColumnsIcon,
  FaCommentAltIcon,
  FaCommentDotsIcon,
  FaCommentIcon,
  FaCommentSlashIcon,
  FaCommentsIcon,
  FaCompressIcon,
  FaCopyIcon,
  FaCreditCardIcon,
  FaCubeIcon,
  FaCubesIcon,
  FaDatabaseIcon,
  FaDoorClosedIcon,
  FaDoorOpenIcon,
  FaEditIcon,
  FaEllipsisHIcon,
  FaEllipsisVIcon,
  FaEnvelopeIcon,
  FaEnvelopeOpenIcon,
  FaEnvelopeOpenTextIcon,
  FaExchangeAltIcon,
  FaExclamationCircleIcon,
  FaExclamationIcon,
  FaExclamationTriangleIcon,
  FaExpandArrowsAltIcon,
  FaExpandIcon,
  FaExternalLinkAltIcon,
  FaEyeIcon,
  FaEyeSlashIcon,
  FaFileAltIcon,
  FaFileArchiveIcon,
  FaFileDownloadIcon,
  FaFileExportIcon,
  FaFileIcon,
  FaFileImportIcon,
  FaFileUploadIcon,
  FaFilterIcon,
  FaFlagIcon,
  FaFolderIcon,
  FaFolderMinusIcon,
  FaFolderOpenIcon,
  FaFolderPlusIcon,
  FaFontIcon,
  FaForwardIcon,
  FaGiftIcon,
  FaGlobeIcon,
  FaGraduationCapIcon,
  FaGripHorizontalIcon,
  FaGripLinesIcon,
  FaGripLinesVerticalIcon,
  FaGripVerticalIcon,
  FaHandPaperIcon,
  FaHandPointDownIcon,
  FaHandPointLeftIcon,
  FaHandPointRightIcon,
  FaHandPointUpIcon,
  FaHandsIcon,
  FaHandshakeIcon,
  FaHeartIcon,
  FaHistoryIcon,
  FaHomeIcon,
  FaHospitalAltIcon,
  FaHospitalIcon,
  FaHourglassEndIcon,
  FaHourglassHalfIcon,
  FaHourglassIcon,
  FaHourglassStartIcon,
  FaIdBadgeIcon,
  FaIdCardAltIcon,
  FaIdCardIcon,
  FaImageIcon,
  FaImagesIcon,
  FaInboxIcon,
  FaInfoCircleIcon,
  FaInfoIcon,
  FaKeyIcon,
  FaKeyboardIcon,
  FaLightbulbIcon,
  FaLinkIcon,
  FaListAltIcon,
  FaListIcon,
  FaListOlIcon,
  FaListUlIcon,
  FaLockIcon,
  FaLockOpenIcon,
  FaLongArrowAltDownIcon,
  FaLongArrowAltLeftIcon,
  FaLongArrowAltRightIcon,
  FaLongArrowAltUpIcon,
  FaMedkitIcon,
  FaMinusCircleIcon,
  FaMinusIcon,
  FaMinusSquareIcon,
  FaMobileAltIcon,
  FaMobileIcon,
  FaMoneyBillAltIcon,
  FaMoneyBillIcon,
  FaMoneyBillWaveAltIcon,
  FaMoneyBillWaveIcon,
  FaMoneyCheckAltIcon,
  FaMoneyCheckIcon,
  FaPaperPlaneIcon,
  FaPaperclipIcon,
  FaPasteIcon,
  FaPenIcon,
  FaPencilAltIcon,
  FaPhoneIcon,
  FaPhoneSlashIcon,
  FaPiggyBankIcon,
  FaPlaneIcon,
  FaPlayCircleIcon,
  FaPlayIcon,
  FaPlusCircleIcon,
  FaPlusIcon,
  FaPlusSquareIcon,
  FaPollHIcon,
  FaPollIcon,
  FaPortraitIcon,
  FaPowerOffIcon,
  FaPrintIcon,
  FaQrcodeIcon,
  FaQuestionCircleIcon,
  FaQuestionIcon,
  FaRandomIcon,
  FaReceiptIcon,
  FaRedoAltIcon,
  FaRedoIcon,
  FaRegDotCircleIcon,
  FaReplyAllIcon,
  FaReplyIcon,
  FaRocketIcon,
  FaSaveIcon,
  FaSearchIcon,
  FaSearchMinusIcon,
  FaSearchPlusIcon,
  FaShareAltIcon,
  FaShareIcon,
  FaShareSquareIcon,
  FaShieldAltIcon,
  FaShoppingBagIcon,
  FaShoppingBasketIcon,
  FaShoppingCartIcon,
  FaSignInAltIcon,
  FaSignOutAltIcon,
  FaSlidersHIcon,
  FaSortAlphaDownIcon,
  FaSortAlphaUpIcon,
  FaSortAmountDownIcon,
  FaSortAmountUpIcon,
  FaSortDownIcon,
  FaSortIcon,
  FaSortNumericDownIcon,
  FaSortNumericUpIcon,
  FaSortUpIcon,
  FaStarIcon,
  FaStepBackwardIcon,
  FaStepForwardIcon,
  FaStickyNoteIcon,
  FaStopCircleIcon,
  FaStopIcon,
  FaStreamIcon,
  FaSubwayIcon,
  FaSyncAltIcon,
  FaSyncIcon,
  FaTableIcon,
  FaTabletAltIcon,
  FaTabletIcon,
  FaTachometerAltIcon,
  FaTagIcon,
  FaTagsIcon,
  FaTasksIcon,
  FaTaxiIcon,
  FaThIcon,
  FaThLargeIcon,
  FaThListIcon,
  FaTimesCircleIcon,
  FaTimesIcon,
  FaToolboxIcon,
  FaToolsIcon,
  FaTrashAltIcon,
  FaTrashIcon,
  FaTrashRestoreAltIcon,
  FaTrashRestoreIcon,
  FaUndoAltIcon,
  FaUndoIcon,
  FaUnlinkIcon,
  FaUnlockAltIcon,
  FaUnlockIcon,
  FaUserAltIcon,
  FaUserAltSlashIcon,
  FaUserCheckIcon,
  FaUserCircleIcon,
  FaUserClockIcon,
  FaUserCogIcon,
  FaUserEditIcon,
  FaUserIcon,
  FaUserMinusIcon,
  FaUserPlusIcon,
  FaUserSlashIcon,
  FaUsersCogIcon,
  FaUsersIcon,
  FaVideoIcon,
  FaVideoSlashIcon,
  FaVolumeDownIcon,
  FaVolumeMuteIcon,
  FaVolumeOffIcon,
  FaVolumeUpIcon,
  FaWalletIcon,
  FaWindowCloseIcon,
  FaWindowMaximizeIcon,
  FaWindowMinimizeIcon,
  FaWindowRestoreIcon,
  FaWrenchIcon,
  FaYenSignIcon,
]

export default {
  title: 'Icon',
  component: FaAddressBookIcon,
  parameters: {
    docs: {
      description: { component: readme },
    },
  },
}

export const Default: Story = () => <FaAddressBookIcon />

export const All: Story = () => {
  return (
    <Container>
      {icons.map((Component) => {
        return (
          <>
            <CatalogItem key={`${Component.displayName}`}>
              <IconName>{Component.displayName?.replace(/Icon$/, '')}</IconName>
              <dd>
                <Component />
              </dd>
            </CatalogItem>
          </>
        )
      })}
    </Container>
  )
}
All.parameters = {
  docs: {
    description: {
      story: 'There are a variety of icons.',
    },
    source: {
      // It is needed because the dynamic source is too long.
      type: 'code',
    },
  },
}

export const Size: Story = () => (
  <List>
    <FaAddressBookIcon size={16} />
    <FaAddressBookIcon size={24} />
    <FaAddressBookIcon size={32} />
    <FaAddressBookIcon size={40} />
    <FaAddressBookIcon size={48} />
    <FaAddressBookIcon size={56} />
  </List>
)
Size.parameters = {
  docs: {
    description: {
      story: 'An icon can be any size.',
    },
  },
}

export const AltText: Story = () => (
  <div>
    <p>
      <span id="text">連絡帳</span>
    </p>
    <dl>
      <dt>visually hidden text</dt>
      <dd>
        <FaAddressBookIcon visuallyHiddenText="連絡帳" />
      </dd>
      <dt>
        <code>aria-labelledby</code>
      </dt>
      <dd>
        <FaAddressBookIcon aria-labelledby="text" />
      </dd>
      <dt>
        <code>aria-label</code>
      </dt>
      <dd>
        <FaAddressBookIcon aria-label="連絡帳" />
      </dd>
      <dt>
        none ( <code>aria-hidden</code> )
      </dt>
      <dd>
        <FaAddressBookIcon />
      </dd>
    </dl>
  </div>
)
Size.parameters = {
  docs: {
    description: {
      story: 'An icon can be any size.',
    },
  },
}

export const Color: Story = () => (
  <List>
    <FaAddressBookIcon size={40} color="#D4F4F5" />
    <FaAddressBookIcon size={40} color="#69D9DE" />
    <FaAddressBookIcon size={40} color="#12ABB1" />
    <FaAddressBookIcon size={40} color="#0F7F85" />
  </List>
)
Color.parameters = {
  docs: {
    description: {
      story: 'An icon can be any color.',
    },
  },
}

const Container = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  flex-wrap: wrap;
`
const CatalogItem = styled.dl`
  margin: 10px;
  padding: 10px;
  background-color: #eee;
  text-align: center;

  & > dd {
    margin: 0;
  }
`
const IconName = styled.dt`
  margin-bottom: 10px;
  font-size: 14px;
  color: #222;
`
const List = styled.div`
  display: flex;
  align-items: flex-end;
  & > * {
    margin-right: 16px;
  }
`
