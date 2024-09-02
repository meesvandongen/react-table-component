import clsx from "clsx";
import { memo, useMemo } from "react";
import { useMRT_RowVirtualizer } from "../../hooks/useMRT_RowVirtualizer";
import { useMRT_Rows } from "../../hooks/useMRT_Rows";
import type {
	MRT_ColumnVirtualizer,
	MRT_Row,
	MRT_RowData,
	MRT_TableInstance,
	MRT_VirtualItem,
} from "../../types";
import classes from "./MRT_TableBody.module.css";
import { MRT_TableBodyRow, Memo_MRT_TableBodyRow } from "./MRT_TableBodyRow";

export interface MRT_TableBodyProps<TData extends MRT_RowData> {
	columnVirtualizer?: MRT_ColumnVirtualizer;
	table: MRT_TableInstance<TData>;
}

export function MRT_TableBody<TData extends MRT_RowData>({
	table,
	columnVirtualizer,
}: MRT_TableBodyProps<TData>) {
	const {
		getBottomRows,
		getIsSomeRowsPinned,
		getRowModel,
		getState,
		getTopRows,
		options: {
			enableStickyFooter,
			enableStickyHeader,
			layoutMode,
			memoMode,
			renderDetailPanel,
			renderEmptyRowsFallback,
			renderTableBody,
			rowPinningDisplayMode,
		},
		refs: { tableFooterRef, tableHeadRef, tablePaperRef },
	} = table;
	const { columnFilters, globalFilter, isFullScreen, rowPinning } = getState();

	const tableHeadHeight =
		((enableStickyHeader || isFullScreen) &&
			tableHeadRef.current?.clientHeight) ||
		0;
	const tableFooterHeight =
		(enableStickyFooter && tableFooterRef.current?.clientHeight) || 0;

	const pinnedRowIds = useMemo(() => {
		if (!rowPinning.bottom?.length && !rowPinning.top?.length) return [];
		return getRowModel()
			.rows.filter((row) => row.getIsPinned())
			.map((r) => r.id);
	}, [rowPinning, getRowModel().rows]);

	const rows = useMRT_Rows(table);

	const rowVirtualizer = useMRT_RowVirtualizer(table, rows);

	const { virtualRows } = rowVirtualizer ?? {};

	const commonRowProps = {
		columnVirtualizer,
		numRows: rows.length,
		table,
	};

	return (
		<>
			{/* Pinned rows top */}
			{!rowPinningDisplayMode?.includes("sticky") &&
				getIsSomeRowsPinned("top") &&
				renderTableBody({
					height: tableHeadHeight,
					classes: clsx(
						classes.pinned,
						layoutMode?.startsWith("grid") && classes.rootGrid,
					),
					children: getTopRows().map((row, renderedRowIndex) => {
						const rowProps = {
							...commonRowProps,
							renderedRowIndex,
							row,
						};
						return memoMode === "rows" ? (
							<Memo_MRT_TableBodyRow key={row.id} {...rowProps} />
						) : (
							<MRT_TableBodyRow key={row.id} {...rowProps} />
						);
					}),
				})}

			{/* Normal rows */}
			{renderTableBody({
				height: rowVirtualizer
					? `${rowVirtualizer.getTotalSize()}px`
					: undefined,
				classes: clsx(
					classes.root,
					layoutMode?.startsWith("grid") && classes.rootGrid,
					!rows.length && classes.rootNoRows,
					rowVirtualizer && classes.rootVirtualized,
				),
				children:
					rows.length === 0 ? (
						<tr
							className={clsx(
								layoutMode?.startsWith("grid") && classes.emptyRowTrGrid,
							)}
						>
							<td
								className={clsx(
									layoutMode?.startsWith("grid") && classes.emptyRowTdGrid,
								)}
								colSpan={table.getVisibleLeafColumns().length}
							>
								{renderEmptyRowsFallback({
									table,
									filterUsed: globalFilter || columnFilters.length,
								})}
							</td>
						</tr>
					) : (
						<>
							{(virtualRows ?? rows).map(
								(rowOrVirtualRow, renderedRowIndex) => {
									let rowIndex = renderedRowIndex;
									if (rowVirtualizer) {
										if (renderDetailPanel) {
											if (rowOrVirtualRow.index % 2 === 1) {
												return null;
											}
											rowIndex = rowOrVirtualRow.index / 2;
										} else {
											rowIndex = rowOrVirtualRow.index;
										}
									}
									const row = rowVirtualizer
										? rows[rowIndex]
										: (rowOrVirtualRow as MRT_Row<TData>);
									const props = {
										...commonRowProps,
										pinnedRowIds,
										rowIndex,
										row,
										rowVirtualizer,
										virtualRow: rowVirtualizer
											? (rowOrVirtualRow as MRT_VirtualItem)
											: undefined,
									};
									const key = `${row.id}-${row.index}`;
									return memoMode === "rows" ? (
										<Memo_MRT_TableBodyRow key={key} {...props} />
									) : (
										<MRT_TableBodyRow key={key} {...props} />
									);
								},
							)}
						</>
					),
			})}

			{/* Pinned rows bottom */}
			{!rowPinningDisplayMode?.includes("sticky") &&
				getIsSomeRowsPinned("bottom") &&
				renderTableBody({
					height: tableFooterHeight,
					classes: clsx(
						classes.pinned,
						layoutMode?.startsWith("grid") && classes.rootGrid,
					),
					children: getBottomRows().map((row, renderedRowIndex) => {
						const props = {
							...commonRowProps,
							renderedRowIndex,
							row,
						};
						return memoMode === "rows" ? (
							<Memo_MRT_TableBodyRow key={row.id} {...props} />
						) : (
							<MRT_TableBodyRow key={row.id} {...props} />
						);
					}),
				})}
		</>
	);
}
export const Memo_MRT_TableBody = memo(
	MRT_TableBody,
	(prev, next) => prev.table.options.data === next.table.options.data,
) as typeof MRT_TableBody;
