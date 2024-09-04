import clsx from "clsx";
import type { RefObject } from "react";
import type {
	MRT_Row,
	MRT_RowData,
	MRT_RowVirtualizer,
	MRT_TableInstance,
	MRT_VirtualItem,
} from "../../types";
import classes from "./MRT_TableDetailPanelRow.module.css";
import { MRT_TableDetailPanelCell } from "./MRT_TableDetailPanelCell";

interface Props<TData extends MRT_RowData> {
	parentRowRef: RefObject<HTMLTableRowElement>;
	renderedRowIndex?: number;
	row: MRT_Row<TData>;
	rowVirtualizer?: MRT_RowVirtualizer;
	table: MRT_TableInstance<TData>;
	virtualRow?: MRT_VirtualItem;
}

export function MRT_TableDetailPanelRow<TData extends MRT_RowData>({
	parentRowRef,
	renderedRowIndex = 0,
	row,
	rowVirtualizer,
	table,
	virtualRow,
}: Props<TData>) {
	const {
		getState,
		options: { layoutMode, renderDetailPanel, renderTableDetailPanelRow },
	} = table;
	const { isLoading } = getState();

	const detailPanel =
		!isLoading && row.getIsExpanded() && renderDetailPanel?.({ row, table });

	const index = renderDetailPanel ? renderedRowIndex * 2 + 1 : renderedRowIndex;

	const isEnabled = detailPanel !== undefined;

	return renderTableDetailPanelRow({
		isEnabled,
		index,
		ref: (node: HTMLTableRowElement) => {
			if (node) {
				rowVirtualizer?.measureElement?.(node);
			}
		},
		vars: {
			"--mrt-parent-row-height": virtualRow
				? `${parentRowRef.current?.getBoundingClientRect()?.height}px`
				: undefined,
			"--mrt-virtual-row-start": virtualRow
				? `${virtualRow.start}px`
				: undefined,
		},
		classes: clsx(
			classes.root,
			layoutMode?.startsWith("grid") && classes["root-grid"],
			virtualRow && classes["root-virtual-row"],
		),

		children: (
			<MRT_TableDetailPanelCell
				row={row}
				rowVirtualizer={rowVirtualizer}
				table={table}
				virtualRow={virtualRow}
			/>
		),
	});
}
