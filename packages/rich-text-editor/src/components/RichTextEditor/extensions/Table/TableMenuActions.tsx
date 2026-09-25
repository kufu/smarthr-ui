'use client'
import { CellSelection } from '@tiptap/pm/tables'
import {
  Button,
  FaArrowDownIcon,
  FaArrowLeftIcon,
  FaArrowRightIcon,
  FaArrowUpIcon,
  FaCheckIcon,
  FaChevronRightIcon,
  FaCompressIcon,
  FaExpandIcon,
  FaPaintbrushIcon,
  FaTableIcon,
  FaTrashCanIcon,
  FaXmarkIcon,
} from 'smarthr-ui'

import { useIntl } from '../../../../intl'

import { tableMenuItemClass as itemClass } from './tableMenuStyles'
import {
  type TableScope,
  clearTableCells,
  type getTableTarget,
  insertTableAxis,
  toggleSelectedCellHeaders,
} from './tableTarget'

import type { RichTextFeature } from '../../types'
import type { Editor } from '@tiptap/react'
import type { ReactNode, RefObject } from 'react'
type Props = {
  editor: Editor
  scope: TableScope
  target: NonNullable<ReturnType<typeof getTableTarget>>
  features: readonly RichTextFeature[]
  run: (action: () => unknown) => void
  changeColors: (show: boolean) => void
  colorTriggerRef: RefObject<HTMLButtonElement>
}
export const TableMenuActions = ({
  editor,
  scope,
  target,
  features,
  run,
  changeColors,
  colorTriggerRef,
}: Props) => {
  const { localize } = useIntl()
  const item = (
    text: string,
    action: () => unknown,
    disabled = false,
    pressed?: boolean,
    icon: ReactNode = <FaTableIcon />,
  ) => (
    <Button
      type="button"
      disabled={disabled}
      variant="text"
      className={`${itemClass} shr-flex shr-items-center shr-gap-0.5`}
      aria-pressed={pressed}
      onClick={() => run(action)}
      prefix={
        pressed === undefined ? (
          icon
        ) : (
          <FaCheckIcon className={pressed ? 'shr-text-main' : 'shr-invisible'} />
        )
      }
    >
      {text}
    </Button>
  )
  let hasHeaderCell = editor.state.doc.nodeAt(target.pos)?.type.name === 'tableHeader'
  if (editor.state.selection instanceof CellSelection) {
    hasHeaderCell = false
    editor.state.selection.forEachCell((cell) => {
      if (cell.type.name === 'tableHeader') hasHeaderCell = true
    })
  }
  return (
    <>
      {scope === 'row' && (
        <>
          {item(
            localize({
              id: 'smarthr-ui/RichTextEditor/toggleSelectedRow',
              defaultText: '行をヘッダーにする',
            }),
            () => toggleSelectedCellHeaders(editor),
            false,
            Array.from(
              { length: target.map.width },
              (_, col) =>
                target.table.nodeAt(target.map.map[target.rect.top * target.map.width + col])?.type
                  .name === 'tableHeader',
            ).every(Boolean),
          )}
          {item(
            localize({
              id: 'smarthr-ui/RichTextEditor/insertAbove',
              defaultText: '上に行を挿入',
            }),
            () => insertTableAxis(editor, 'row', 'before'),
            false,
            undefined,
            <FaArrowUpIcon />,
          )}
          {item(
            localize({
              id: 'smarthr-ui/RichTextEditor/insertBelow',
              defaultText: '下に行を挿入',
            }),
            () => insertTableAxis(editor, 'row', 'after'),
            false,
            undefined,
            <FaArrowDownIcon />,
          )}
        </>
      )}
      {scope === 'column' && (
        <>
          {item(
            localize({
              id: 'smarthr-ui/RichTextEditor/toggleSelectedColumn',
              defaultText: '列をヘッダーにする',
            }),
            () => toggleSelectedCellHeaders(editor),
            false,
            Array.from(
              { length: target.map.height },
              (_, row) =>
                target.table.nodeAt(target.map.map[row * target.map.width + target.rect.left])?.type
                  .name === 'tableHeader',
            ).every(Boolean),
          )}
          {item(
            localize({
              id: 'smarthr-ui/RichTextEditor/insertLeft',
              defaultText: '左に列を挿入',
            }),
            () => insertTableAxis(editor, 'column', 'before'),
            false,
            undefined,
            <FaArrowLeftIcon />,
          )}
          {item(
            localize({
              id: 'smarthr-ui/RichTextEditor/insertRight',
              defaultText: '右に列を挿入',
            }),
            () => insertTableAxis(editor, 'column', 'after'),
            false,
            undefined,
            <FaArrowRightIcon />,
          )}
        </>
      )}
      {scope === 'cell' && (
        <>
          {item(
            hasHeaderCell
              ? localize({
                  id: 'smarthr-ui/RichTextEditor/makeNormalCell',
                  defaultText: '通常のセルに戻す',
                })
              : localize({
                  id: 'smarthr-ui/RichTextEditor/makeHeaderCell',
                  defaultText: 'ヘッダーセルにする',
                }),
            () => editor.commands.toggleHeaderCell(),
          )}
          {editor.can().mergeCells() &&
            item(
              localize({
                id: 'smarthr-ui/RichTextEditor/mergeCells',
                defaultText: 'セルを結合',
              }),
              () => editor.commands.mergeCells(),
              false,
              undefined,
              <FaCompressIcon />,
            )}
          {editor.can().splitCell() &&
            item(
              localize({
                id: 'smarthr-ui/RichTextEditor/unmergeCells',
                defaultText: '結合を解除',
              }),
              () => editor.commands.splitCell(),
              false,
              undefined,
              <FaExpandIcon />,
            )}
        </>
      )}
      {scope === 'table' && (
        <>
          {item(
            localize({
              id: 'smarthr-ui/RichTextEditor/toggleFirstRow',
              defaultText: '最初の行をヘッダーにする',
            }),
            () => editor.commands.toggleHeaderRow(),
            false,
            Array.from(
              { length: target.map.width },
              (_, col) => target.table.nodeAt(target.map.map[col])?.type.name === 'tableHeader',
            ).every(Boolean),
          )}
          {item(
            localize({
              id: 'smarthr-ui/RichTextEditor/toggleFirstColumn',
              defaultText: '最初の列をヘッダーにする',
            }),
            () => editor.commands.toggleHeaderColumn(),
            false,
            Array.from(
              { length: target.map.height },
              (_, row) =>
                target.table.nodeAt(target.map.map[row * target.map.width])?.type.name ===
                'tableHeader',
            ).every(Boolean),
          )}

          {item(
            localize({
              id: 'smarthr-ui/RichTextEditor/deleteTable',
              defaultText: '表を削除',
            }),
            () => editor.commands.deleteTable(),
            false,
            undefined,
            <FaTrashCanIcon />,
          )}
        </>
      )}
      {scope !== 'table' &&
        (features.includes('color') || features.includes('backgroundColor')) && (
          <div className="shr-flex shr-flex-col">
            <hr className="shr-border-shorthand shr-mx-0.75 shr-my-0.25 shr-border-x-0 shr-border-b-0" />
            <Button
              ref={colorTriggerRef}
              type="button"
              variant="text"
              className={`${itemClass} shr-flex shr-items-center shr-gap-0.5 [&_.smarthr-ui-Button-body]:shr-flex-1 [&_.smarthr-ui-Button-body]:shr-text-left`}
              aria-haspopup="dialog"
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight') {
                  event.preventDefault()
                  event.stopPropagation()
                  changeColors(true)
                }
              }}
              onClick={() => changeColors(true)}
              prefix={<FaPaintbrushIcon />}
              suffix={<FaChevronRightIcon />}
            >
              {localize({
                id: 'smarthr-ui/RichTextEditor/cellColorMenu',
                defaultText: 'カラー',
              })}
            </Button>
          </div>
        )}
      {scope !== 'table' && (
        <>
          {item(
            localize({
              id: 'smarthr-ui/RichTextEditor/clearContents',
              defaultText: '内容をクリア',
            }),
            () => clearTableCells(editor),
            false,
            undefined,
            <FaXmarkIcon />,
          )}
        </>
      )}
      {scope === 'row' && (
        <>
          {' '}
          {item(
            localize({
              id: 'smarthr-ui/RichTextEditor/deleteRow',
              defaultText: '行を削除',
            }),
            () => editor.commands.deleteRow(),
            target.map.height <= 1 ||
              (editor.state.selection instanceof CellSelection &&
                editor.state.selection.isColSelection()),
            undefined,
            <FaTrashCanIcon />,
          )}
        </>
      )}
      {scope === 'column' && (
        <>
          {' '}
          {item(
            localize({
              id: 'smarthr-ui/RichTextEditor/deleteColumn',
              defaultText: '列を削除',
            }),
            () => editor.commands.deleteColumn(),
            target.map.width <= 1 ||
              (editor.state.selection instanceof CellSelection &&
                editor.state.selection.isRowSelection()),
            undefined,
            <FaTrashCanIcon />,
          )}
        </>
      )}
    </>
  )
}
