import clsx from "clsx";
import {
	type CSSProperties,
	type DragEvent,
	type MouseEvent,
	type RefObject,
	memo,
	useEffect,
	useState,
} from "react";
import type {
	MRT_Cell,
	MRT_CellValue,
	MRT_RowData,
	MRT_TableInstance,
	MRT_VirtualItem,
} from "../../types";
import { parseCSSVarId } from "../../utils/style.utils";
import { parseFromValuesOrFunc } from "../../utils/utils";
import { MRT_CopyButton } from "../buttons/MRT_CopyButton";
import { MRT_EditCellTextInput } from "../inputs/MRT_EditCellTextInput";
import classes from "./MRT_TableBodyCell.module.css";
import { MRT_TableBodyCellValue } from "./MRT_TableBodyCellValue";

interface Props<TData extends MRT_RowData, TValue = MRT_CellValue> {
	cell: MRT_Cell<TData, TValue>;
	numRows?: number;
	renderedColumnIndex?: number;
	renderedRowIndex?: number;
	rowRef: RefObject<HTMLTableRowElement>;
	table: MRT_TableInstance<TData>;
	virtualCell?: MRT_VirtualItem;
}

export const MRT_TableBodyCell = <TData extends MRT_RowData>({
	cell,
	numRows = 1,
	renderedColumnIndex = 0,
	renderedRowIndex = 0,
	rowRef,
	table,
	virtualCell,
}: Props<TData>) => {
	const {
		getState,
		options: {
			columnResizeDirection,
			columnResizeMode,
			createDisplayMode,
			editDisplayMode,
			enableClickToCopy,
			enableColumnOrdering,
			enableColumnPinning,
			enableEditing,
			enableGrouping,
			layoutMode,
			renderTd,
		},
		refs: { editInputRefs },
		setEditingCell,
		setHoveredColumn,
	} = table;
	const {
		columnSizingInfo,
		creatingRow,
		density,
		draggingColumn,
		editingCell,
		editingRow,
		hoveredColumn,
		isLoading,
		showSkeletons,
	} = getState();
	const { column, row } = cell;
	const { columnDef } = column;
	const { columnDefType } = columnDef;

	const skeletonProps = {
		cell,
		column,
		renderedColumnIndex,
		renderedRowIndex,
		row,
		table,
	};

	const [skeletonWidth, setSkeletonWidth] = useState(100);
	useEffect(() => {
		if ((!isLoading && !showSkeletons) || skeletonWidth !== 100) return;
		const size = column.getSize();
		setSkeletonWidth(
			columnDefType === "display"
				? size / 2
				: Math.round((size + 2 * size * Math.random()) / 3),
		);
	}, [isLoading, showSkeletons]);

	const widthStyles: CSSProperties = {
		minWidth: `max(calc(var(--col-${parseCSSVarId(
			column?.id,
		)}-size) * 1px), ${columnDef.minSize ?? 30}px)`,
		width: `calc(var(--col-${parseCSSVarId(column.id)}-size) * 1px)`,
	};
	if (layoutMode === "grid") {
		widthStyles.flex = `${
			[0, false].includes(columnDef.grow)
				? 0
				: `var(--col-${parseCSSVarId(column.id)}-size)`
		} 0 auto`;
	} else if (layoutMode === "grid-no-grow") {
		widthStyles.flex = `${+(columnDef.grow || 0)} 0 auto`;
	}
	const isDraggingColumn = draggingColumn?.id === column.id;
	const isHoveredColumn = hoveredColumn?.id === column.id;
	const isColumnPinned =
		enableColumnPinning &&
		columnDef.columnDefType !== "group" &&
		column.getIsPinned();

	const isEditable =
		!cell.getIsPlaceholder() &&
		parseFromValuesOrFunc(enableEditing, row) &&
		parseFromValuesOrFunc(columnDef.enableEditing, row) !== false;

	const isEditing =
		isEditable &&
		!["custom", "modal"].includes(editDisplayMode as string) &&
		(editDisplayMode === "table" ||
			editingRow?.id === row.id ||
			editingCell?.id === cell.id) &&
		!row.getIsGrouped();

	const isCreating =
		isEditable && createDisplayMode === "row" && creatingRow?.id === row.id;

	const showClickToCopyButton =
		parseFromValuesOrFunc(enableClickToCopy, cell) ||
		(parseFromValuesOrFunc(columnDef.enableClickToCopy, cell) &&
			parseFromValuesOrFunc(columnDef.enableClickToCopy, cell) !== false);

	const handleDoubleClick = (event: MouseEvent<HTMLTableCellElement>) => {
		tableCellProps?.onDoubleClick?.(event);
		if (isEditable && editDisplayMode === "cell") {
			setEditingCell(cell);
			setTimeout(() => {
				const textField = editInputRefs.current[cell.id];
				if (textField) {
					textField.focus();
					textField.select?.();
				}
			}, 100);
		}
	};

	const handleDragEnter = (e: DragEvent<HTMLTableCellElement>) => {
		tableCellProps?.onDragEnter?.(e);
		if (enableGrouping && hoveredColumn?.id === "drop-zone") {
			setHoveredColumn(null);
		}
		if (enableColumnOrdering && draggingColumn) {
			setHoveredColumn(
				columnDef.enableColumnOrdering !== false ? column : null,
			);
		}
	};

	const cellValueProps = {
		cell,
		renderedColumnIndex,
		renderedRowIndex,
		table,
	};

	const isLastRow = renderedRowIndex === numRows - 1;
	const isResizing =
		columnResizeMode === "onChange" &&
		columnSizingInfo?.isResizingColumn === column.id &&
		columnResizeDirection;

	const vars = {
		"--mrt-table-cell-left":
			isColumnPinned === "left"
				? `${column.getStart(isColumnPinned)}`
				: undefined,
		"--mrt-table-cell-right":
			isColumnPinned === "right"
				? `${column.getAfter(isColumnPinned)}`
				: undefined,
	};

	return renderTd({
		isDraggingColumn,
		isHoveredColumn,
		isColumnPinned,
		renderedColumnIndex,
		isLastRow,
		vars,
		handleDoubleClick,
		handleDragEnter,
		widthStyles,
		isResizing,
		classes: clsx(
			classes.root,
			layoutMode?.startsWith("grid") && classes.rootGrid,
			virtualCell && classes.rootVirtualized,
			isEditable && editDisplayMode === "cell" && classes.rootCursorPointer,
			isEditable &&
				["cell", "table"].includes(editDisplayMode ?? "") &&
				columnDefType !== "display" &&
				classes.rootEditableHover,
			columnDefType === "data" && classes.rootDataCol,
			density === "xs" && classes.rootNowrap,
		),
		children: (
			<>
				{cell.getIsPlaceholder() ? (
					columnDef.PlaceholderCell?.({ cell, column, row, table }) ?? null
				) : showSkeletons !== false && (isLoading || showSkeletons) ? (
					<Skeleton height={20} width={skeletonWidth} {...skeletonProps} />
				) : columnDefType === "display" &&
					(["mrt-row-expand", "mrt-row-numbers", "mrt-row-select"].includes(
						column.id,
					) ||
						!row.getIsGrouped()) ? (
					columnDef.Cell?.({
						column,
						renderedCellValue: cell.renderValue() as any,
						row,
						rowRef,
						...cellValueProps,
					})
				) : isCreating || isEditing ? (
					<MRT_EditCellTextInput cell={cell} table={table} />
				) : showClickToCopyButton && columnDef.enableClickToCopy !== false ? (
					<MRT_CopyButton cell={cell} table={table}>
						<MRT_TableBodyCellValue {...cellValueProps} />
					</MRT_CopyButton>
				) : (
					<MRT_TableBodyCellValue {...cellValueProps} />
				)}
				{cell.getIsGrouped() && !columnDef.GroupedCell && (
					<> ({row.subRows?.length})</>
				)}
			</>
		),
	});
};

export const Memo_MRT_TableBodyCell = memo(
	MRT_TableBodyCell,
	(prev, next) => next.cell === prev.cell,
) as typeof MRT_TableBodyCell;
