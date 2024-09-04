import clsx from "clsx";
import { type DragEvent, memo, useMemo, useRef } from "react";
import type {
	MRT_Cell,
	MRT_ColumnVirtualizer,
	MRT_Row,
	MRT_RowData,
	MRT_RowVirtualizer,
	MRT_TableInstance,
	MRT_VirtualItem,
} from "../../types";
import { getIsRowSelected } from "../../utils/row.utils";
import { MRT_TableBodyCell, Memo_MRT_TableBodyCell } from "./MRT_TableBodyCell";
import classes from "./MRT_TableBodyRow.module.css";
import { MRT_TableDetailPanelRow } from "./MRT_TableDetailPanelRow";

interface Props<TData extends MRT_RowData> {
	columnVirtualizer?: MRT_ColumnVirtualizer;
	numRows?: number;
	pinnedRowIds?: string[];
	renderedRowIndex?: number;
	row: MRT_Row<TData>;
	rowVirtualizer?: MRT_RowVirtualizer;
	table: MRT_TableInstance<TData>;
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
	virtualRow,
}: Props<TData>) => {
	const {
		getState,
		options: {
			enableRowOrdering,
			enableRowPinning,
			enableStickyFooter,
			enableStickyHeader,
			layoutMode,
			memoMode,
			renderDetailPanel,
			renderTableBodyRow,
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
		isRowPinned && rowPinningDisplayMode?.includes("sticky") && "sticky";
	const isDraggingRow = draggingRow?.id === row.id;
	const isHoveredRow = hoveredRow?.id === row.id;

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

	const rowHeight = density === "xs" ? 37 : density === "md" ? 53 : 69;

	const handleDragEnter = (_e: DragEvent) => {
		if (enableRowOrdering && draggingRow) {
			setHoveredRow(row);
		}
	};

	const rowRef = useRef<HTMLTableRowElement | null>(null);

	const isOdd = renderedRowIndex % 2 !== 0;

	const index = renderDetailPanel ? renderedRowIndex * 2 : renderedRowIndex;

	const ref = (node: HTMLTableRowElement) => {
		if (node) {
			rowRef.current = node;
			rowVirtualizer?.measureElement(node);
		}
	};

	return (
		<>
			{renderTableBodyRow({
				isRowSelected,
				isRowPinned,
				isRowStickyPinned,
				isDraggingRow,
				isHoveredRow,
				index,
				isOdd,
				handleDragEnter,
				ref,
				classes: clsx(
					classes.root,
					layoutMode?.startsWith("grid") && classes.rootGrid,
					virtualRow && classes.rootVirtualized,
				),
				vars: {
					"--mrt-pinned-row-bottom":
						!virtualRow && bottomPinnedIndex !== undefined && isRowPinned
							? `${
									bottomPinnedIndex * rowHeight +
									(enableStickyFooter ? tableFooterHeight - 1 : 0)
								}`
							: undefined,
					"--mrt-pinned-row-top":
						!virtualRow && topPinnedIndex !== undefined && isRowPinned
							? `${
									topPinnedIndex * rowHeight +
									(enableStickyHeader || isFullScreen ? tableHeadHeight - 1 : 0)
								}`
							: undefined,
					"--mrt-virtual-row-start": virtualRow
						? `${virtualRow.start}`
						: undefined,
				},
				children: (
					<>
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
								return memoMode === "cells" &&
									cell.column.columnDef.columnDefType === "data" &&
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
					</>
				),
			})}

			{renderDetailPanel && !row.getIsGrouped() && (
				<MRT_TableDetailPanelRow
					parentRowRef={rowRef}
					renderedRowIndex={renderedRowIndex}
					row={row}
					rowVirtualizer={rowVirtualizer}
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
