import clsx from 'clsx';
import classes from './MRT_TableBodyRow.module.css';
import { type DragEvent, memo, useMemo, useRef } from 'react';
import {
  Box,
  type TableProps,
  TableTr,
  type TableTrProps,
} from '@mantine/core';
import { MRT_TableBodyCell, Memo_MRT_TableBodyCell } from './MRT_TableBodyCell';
import { MRT_TableDetailPanel } from './MRT_TableDetailPanel';
import {
  type MRT_Cell,
  type MRT_ColumnVirtualizer,
  type MRT_Row,
  type MRT_RowData,
  type MRT_RowVirtualizer,
  type MRT_TableInstance,
  type MRT_VirtualItem,
} from '../../types';
import { getIsRowSelected } from '../../utils/row.utils';
import { parseFromValuesOrFunc } from '../../utils/utils';

interface Props<TData extends MRT_RowData> extends TableTrProps {
  columnVirtualizer?: MRT_ColumnVirtualizer;
  numRows?: number;
  pinnedRowIds?: string[];
  renderedRowIndex?: number;
  row: MRT_Row<TData>;
  rowVirtualizer?: MRT_RowVirtualizer;
  table: MRT_TableInstance<TData>;
  tableProps: Partial<TableProps>;
  virtualRow?: MRT_VirtualItem;
}

export const MRT_TableBodyRow = <TData extends MRT_RowData>({
  columnVirtualizer,
  numRows,
  pinnedRowIds,
  renderedRowIndex = 0,
  row,
  rowVirtualizer,
  table,
  tableProps,
  virtualRow,
  ...rest
}: Props<TData>) => {
  const {
    getState,
    options: {
      enableRowOrdering,
      enableRowPinning,
      enableStickyFooter,
      enableStickyHeader,
      layoutMode,
      mantineTableBodyRowProps,
      memoMode,
      renderDetailPanel,
      rowPinningDisplayMode,
    },
    refs: { tableFooterRef, tableHeadRef },
    setHoveredRow,
  } = table;
  const {
    density,
    draggingColumn,
    draggingRow,
    editingCell,
    editingRow,
    hoveredRow,
    isFullScreen,
    rowPinning,
  } = getState();

  const visibleCells = row.getVisibleCells();

  const { virtualColumns, virtualPaddingLeft, virtualPaddingRight } =
    columnVirtualizer ?? {};

  const isRowSelected = getIsRowSelected({ row, table });
  const isRowPinned = enableRowPinning && row.getIsPinned();
  const isRowStickyPinned =
    isRowPinned && rowPinningDisplayMode?.includes('sticky') && 'sticky';
  const isDraggingRow = draggingRow?.id === row.id;
  const isHoveredRow = hoveredRow?.id === row.id;

  const tableRowProps = {
    ...parseFromValuesOrFunc(mantineTableBodyRowProps, {
      renderedRowIndex,
      row,
      table,
    }),
    ...rest,
  };

  const [bottomPinnedIndex, topPinnedIndex] = useMemo(() => {
    if (
      !enableRowPinning ||
      !isRowStickyPinned ||
      !pinnedRowIds ||
      !row.getIsPinned()
    )
      return [];
    return [
      [...pinnedRowIds].reverse().indexOf(row.id),
      pinnedRowIds.indexOf(row.id),
    ];
  }, [pinnedRowIds, rowPinning]);

  const tableHeadHeight =
    ((enableStickyHeader || isFullScreen) &&
      tableHeadRef.current?.clientHeight) ||
    0;
  const tableFooterHeight =
    (enableStickyFooter && tableFooterRef.current?.clientHeight) || 0;

  const rowHeight =
    // @ts-ignore
    parseInt(tableRowProps?.style?.height, 10) ||
    (density === 'xs' ? 37 : density === 'md' ? 53 : 69);

  const handleDragEnter = (_e: DragEvent) => {
    if (enableRowOrdering && draggingRow) {
      setHoveredRow(row);
    }
  };

  const rowRef = useRef<HTMLTableRowElement | null>(null);

  let striped = tableProps.striped as boolean | string;

  if (striped) {
    if (striped === true) {
      striped = 'odd';
    }
    if (striped === 'odd' && renderedRowIndex % 2 !== 0) {
      striped = false;
    }
    if (striped === 'even' && renderedRowIndex % 2 === 0) {
      striped = false;
    }
  }

  return (
    <>
      <TableTr
        data-dragging-row={isDraggingRow || undefined}
        data-hovered-row-target={isHoveredRow || undefined}
        data-index={renderDetailPanel ? renderedRowIndex * 2 : renderedRowIndex}
        data-row-pinned={isRowStickyPinned || isRowPinned || undefined}
        data-selected={isRowSelected || undefined}
        data-striped={striped}
        onDragEnter={handleDragEnter}
        ref={(node: HTMLTableRowElement) => {
          if (node) {
            rowRef.current = node;
            rowVirtualizer?.measureElement(node);
          }
        }}
        {...tableRowProps}
        __vars={{
          ...tableRowProps?.__vars,
          '--mrt-pinned-row-bottom':
            !virtualRow && bottomPinnedIndex !== undefined && isRowPinned
              ? `${
                  bottomPinnedIndex * rowHeight +
                  (enableStickyFooter ? tableFooterHeight - 1 : 0)
                }`
              : undefined,
          '--mrt-pinned-row-top': virtualRow
            ? undefined
            : topPinnedIndex !== undefined && isRowPinned
              ? `${
                  topPinnedIndex * rowHeight +
                  (enableStickyHeader || isFullScreen ? tableHeadHeight - 1 : 0)
                }`
              : undefined,
          '--mrt-virtual-row-start': virtualRow
            ? `${virtualRow.start}`
            : undefined,
        }}
        className={clsx(
          classes.root,
          layoutMode?.startsWith('grid') && classes['root-grid'],
          virtualRow && classes['root-virtualized'],
          tableRowProps?.className,
        )}
      >
        {virtualPaddingLeft ? (
          <Box component="td" display="flex" w={virtualPaddingLeft} />
        ) : null}
        {(virtualColumns ?? row.getVisibleCells()).map(
          (cellOrVirtualCell, renderedColumnIndex) => {
            let cell = cellOrVirtualCell as MRT_Cell<TData>;
            if (columnVirtualizer) {
              renderedColumnIndex = (cellOrVirtualCell as MRT_VirtualItem)
                .index;
              cell = visibleCells[renderedColumnIndex];
            }
            const cellProps = {
              cell,
              numRows,
              renderedColumnIndex,
              renderedRowIndex,
              rowRef,
              table,
              virtualCell: columnVirtualizer
                ? (cellOrVirtualCell as MRT_VirtualItem)
                : undefined,
            };
            return memoMode === 'cells' &&
              cell.column.columnDef.columnDefType === 'data' &&
              !draggingColumn &&
              !draggingRow &&
              editingCell?.id !== cell.id &&
              editingRow?.id !== row.id ? (
              <Memo_MRT_TableBodyCell key={cell.id} {...cellProps} />
            ) : (
              <MRT_TableBodyCell key={cell.id} {...cellProps} />
            );
          },
        )}
        {virtualPaddingRight ? (
          <Box component="td" display="flex" w={virtualPaddingRight} />
        ) : null}
      </TableTr>
      {renderDetailPanel && !row.getIsGrouped() && (
        <MRT_TableDetailPanel
          parentRowRef={rowRef}
          renderedRowIndex={renderedRowIndex}
          row={row}
          rowVirtualizer={rowVirtualizer}
          striped={striped}
          table={table}
          virtualRow={virtualRow}
        />
      )}
    </>
  );
};

export const Memo_MRT_TableBodyRow = memo(
  MRT_TableBodyRow,
  (prev, next) => prev.row === next.row,
) as typeof MRT_TableBodyRow;
