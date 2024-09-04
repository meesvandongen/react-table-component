import clsx from "clsx";
import type {
	MRT_Row,
	MRT_RowData,
	MRT_RowVirtualizer,
	MRT_TableInstance,
	MRT_VirtualItem,
} from "../../types";
import classes from "./MRT_TableDetailPanelCell.module.css";

interface Props<TData extends MRT_RowData> {
	row: MRT_Row<TData>;
	rowVirtualizer?: MRT_RowVirtualizer;
	table: MRT_TableInstance<TData>;
	virtualRow?: MRT_VirtualItem;
}

export function MRT_TableDetailPanelCell<TData extends MRT_RowData>({
	row,
	rowVirtualizer,
	table,
	virtualRow,
}: Props<TData>) {
	const {
		getState,
		getVisibleLeafColumns,
		options: { layoutMode, renderDetailPanel, renderTableDetailPanelCell },
	} = table;
	const { isLoading } = getState();

	const detailPanel =
		!isLoading && row.getIsExpanded() && renderDetailPanel?.({ row, table });

	const isEnabled = detailPanel !== undefined;

	return renderTableDetailPanelCell({
		isEnabled,
		colSpan: getVisibleLeafColumns().length,
		vars: {
			"--mrt-inner-width": `${table.getTotalSize()}px`,
		},
		classes: clsx(
			classes.inner,
			layoutMode?.startsWith("grid") && classes["inner-grid"],
			row.getIsExpanded() && classes["inner-expanded"],
			virtualRow && classes["inner-virtual"],
		),
		row,
		children: rowVirtualizer ? (
			row.getIsExpanded() && detailPanel
		) : (
			<Collapse in={row.getIsExpanded()}>{detailPanel}</Collapse>
		),
	});
}
