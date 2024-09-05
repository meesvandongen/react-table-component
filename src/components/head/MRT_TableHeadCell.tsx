import clsx from "clsx";
import {
	type CSSProperties,
	type DragEventHandler,
	type MutableRefObject,
	type ReactNode,
	useMemo,
	useState,
} from "react";
import type {
	MRT_ColumnVirtualizer,
	MRT_Header,
	MRT_RowData,
	MRT_TableInstance,
} from "../../types";
import { parseCSSVarId } from "../../utils/style.utils";
import { parseFromValuesOrFunc } from "../../utils/utils";
import { MRT_ColumnActionMenu } from "../menus/MRT_ColumnActionMenu";
import classes from "./MRT_TableHeadCell.module.css";
import { MRT_TableHeadCellFilterContainer } from "./MRT_TableHeadCellFilterContainer";
import { MRT_TableHeadCellFilterLabel } from "./MRT_TableHeadCellFilterLabel";
import { MRT_TableHeadCellGrabHandle } from "./MRT_TableHeadCellGrabHandle";
import { MRT_TableHeadCellResizeHandle } from "./MRT_TableHeadCellResizeHandle";
import { MRT_TableHeadCellSortLabel } from "./MRT_TableHeadCellSortLabel";

interface Props<TData extends MRT_RowData> {
	columnVirtualizer?: MRT_ColumnVirtualizer;
	header: MRT_Header<TData>;
	renderedHeaderIndex?: number;
	table: MRT_TableInstance<TData>;
}

export const MRT_TableHeadCell = <TData extends MRT_RowData>({
	columnVirtualizer,
	header,
	renderedHeaderIndex = 0,
	table,
}: Props<TData>) => {
	const {
		getState,
		options: {
			columnFilterDisplayMode,
			columnResizeDirection,
			columnResizeMode,
			enableColumnActions,
			enableColumnDragging,
			enableColumnOrdering,
			enableColumnPinning,
			enableGrouping,
			enableHeaderActionsHoverReveal,
			enableMultiSort,
			layoutMode,
		},
		refs: { tableHeadCellRefs },
		setHoveredColumn,
	} = table;
	const { columnSizingInfo, draggingColumn, grouping, hoveredColumn } =
		getState();
	const { column } = header;
	const { columnDef } = column;
	const { columnDefType } = columnDef;

	const widthStyles: CSSProperties = {
		minWidth: `max(calc(var(--header-${parseCSSVarId(
			header?.id,
		)}-size) * 1px), ${columnDef.minSize ?? 30}px)`,
		width: `calc(var(--header-${parseCSSVarId(header.id)}-size) * 1px)`,
	};
	if (layoutMode === "grid") {
		widthStyles.flex = `${
			[0, false].includes(columnDef.grow!)
				? 0
				: `var(--header-${parseCSSVarId(header.id)}-size)`
		} 0 auto`;
	} else if (layoutMode === "grid-no-grow") {
		widthStyles.flex = `${+(columnDef.grow || 0)} 0 auto`;
	}

	const isColumnPinned =
		enableColumnPinning &&
		columnDef.columnDefType !== "group" &&
		column.getIsPinned();

	const isDraggingColumn = draggingColumn?.id === column.id;
	const isHoveredColumn = hoveredColumn?.id === column.id;

	// const { hovered: isHoveredHeadCell, ref: isHoveredHeadCellRef } =
	// 	useHover<HTMLTableCellElement>();

	const [isOpenedColumnActions, setIsOpenedColumnActions] = useState(false);

	const columnActionsEnabled =
		(enableColumnActions || columnDef.enableColumnActions) &&
		columnDef.enableColumnActions !== false;

	const showColumnButtons =
		!enableHeaderActionsHoverReveal ||
		isOpenedColumnActions ||
		(isHoveredHeadCell &&
			!table.getVisibleFlatColumns().find((column) => column.getIsResizing()));

	const showDragHandle =
		enableColumnDragging !== false &&
		columnDef.enableColumnDragging !== false &&
		(enableColumnDragging ||
			(enableColumnOrdering && columnDef.enableColumnOrdering !== false) ||
			(enableGrouping &&
				columnDef.enableGrouping !== false &&
				!grouping.includes(column.id))) &&
		showColumnButtons;

	const headerPL = useMemo(() => {
		let pl = 0;
		if (column.getCanSort()) {
			pl++;
		}
		if (showColumnButtons) {
			pl += 1.75;
		}
		if (showDragHandle) {
			pl += 1.25;
		}
		return pl;
	}, [showColumnButtons, showDragHandle]);

	const handleDragEnter: DragEventHandler<HTMLTableCellElement> = (_e) => {
		if (enableGrouping && hoveredColumn?.id === "drop-zone") {
			setHoveredColumn(null);
		}
		if (enableColumnOrdering && draggingColumn && columnDefType !== "group") {
			setHoveredColumn(
				columnDef.enableColumnOrdering !== false ? column : null,
			);
		}
	};

	const headerElement =
		columnDef?.Header instanceof Function
			? columnDef?.Header?.({
					column,
					header,
					table,
				})
			: columnDef?.Header ?? (columnDef.header as ReactNode);

	return (
		<TableTh
			colSpan={header.colSpan}
			data-column-pinned={isColumnPinned || undefined}
			data-dragging-column={isDraggingColumn || undefined}
			data-first-right-pinned={
				(isColumnPinned === "right" &&
					column.getIsFirstColumn(isColumnPinned)) ||
				undefined
			}
			data-hovered-column-target={isHoveredColumn || undefined}
			data-index={renderedHeaderIndex}
			data-last-left-pinned={
				(isColumnPinned === "left" && column.getIsLastColumn(isColumnPinned)) ||
				undefined
			}
			data-resizing={
				(columnResizeMode === "onChange" &&
					columnSizingInfo?.isResizingColumn === column.id &&
					columnResizeDirection) ||
				undefined
			}
			__vars={{
				"--mrt-table-cell-left":
					isColumnPinned === "left"
						? `${column.getStart(isColumnPinned)}`
						: undefined,
				"--mrt-table-cell-right":
					isColumnPinned === "right"
						? `${column.getAfter(isColumnPinned)}`
						: undefined,
			}}
			className={clsx(
				classes.root,
				layoutMode?.startsWith("grid") && classes["root-grid"],
				enableMultiSort && column.getCanSort() && classes["root-no-select"],
				columnVirtualizer && classes["root-virtualized"],
			)}
			onDragEnter={handleDragEnter}
			ref={(node: HTMLTableCellElement) => {
				if (node) {
					tableHeadCellRefs.current[column.id] = node;
					(
						isHoveredHeadCellRef as MutableRefObject<HTMLTableCellElement>
					).current = node;
					if (columnDefType !== "group") {
						columnVirtualizer?.measureElement?.(node);
					}
				}
			}}
			style={widthStyles}
		>
			{header.isPlaceholder ? null : (
				<Flex
					className={clsx(
						"mrt-table-head-cell-content",
						classes.content,
						columnDefType === "group" && classes["content-center"],
						column.getCanResize() && classes["content-spaced"],
					)}
				>
					<Flex
						__vars={{
							"--mrt-table-head-cell-labels-padding-left": `${headerPL}`,
						}}
						className={clsx(
							"mrt-table-head-cell-labels",
							classes.labels,
							column.getCanSort() &&
								columnDefType !== "group" &&
								classes["labels-sortable"],
							columnDefType === "data" && classes["labels-data"],
						)}
						onClick={column.getToggleSortingHandler()}
					>
						<Flex
							className={clsx(
								"mrt-table-head-cell-content-wrapper",
								classes["content-wrapper"],
								columnDefType === "data" &&
									classes["content-wrapper-hidden-overflow"],
								(columnDef.header?.length ?? 0) < 20 &&
									classes["content-wrapper-nowrap"],
							)}
						>
							{headerElement}
						</Flex>
						{column.getCanFilter() &&
							(column.getIsFiltered() || showColumnButtons) && (
								<MRT_TableHeadCellFilterLabel header={header} table={table} />
							)}
						{column.getCanSort() &&
							(column.getIsSorted() || showColumnButtons) && (
								<MRT_TableHeadCellSortLabel header={header} table={table} />
							)}
					</Flex>
					{columnDefType !== "group" && (
						<Flex
							className={clsx(
								"mrt-table-head-cell-content-actions",
								classes["content-actions"],
							)}
						>
							{showDragHandle && (
								<MRT_TableHeadCellGrabHandle
									column={column}
									table={table}
									tableHeadCellRef={{
										current: tableHeadCellRefs.current[column.id],
									}}
								/>
							)}
							{columnActionsEnabled && showColumnButtons && (
								<MRT_ColumnActionMenu
									header={header}
									table={table}
									opened={isOpenedColumnActions}
									onChange={setIsOpenedColumnActions}
								/>
							)}
						</Flex>
					)}
					{column.getCanResize() && (
						<MRT_TableHeadCellResizeHandle header={header} table={table} />
					)}
				</Flex>
			)}
			{columnFilterDisplayMode === "subheader" && column.getCanFilter() && (
				<MRT_TableHeadCellFilterContainer header={header} table={table} />
			)}
		</TableTh>
	);
};
