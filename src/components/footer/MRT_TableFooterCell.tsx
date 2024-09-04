import clsx from "clsx";
import type { CSSProperties } from "react";
import type { MRT_Header, MRT_RowData, MRT_TableInstance } from "../../types";
import { parseCSSVarId } from "../../utils/style.utils";
import { parseFromValuesOrFunc } from "../../utils/utils";
import classes from "./MRT_TableFooterCell.module.css";

interface Props<TData extends MRT_RowData> {
	footer: MRT_Header<TData>;
	renderedColumnIndex?: number;
	table: MRT_TableInstance<TData>;
}

export function MRT_TableFooterCell<TData extends MRT_RowData>({
	footer,
	renderedColumnIndex,
	table,
}: Props<TData>) {
	const {
		options: { enableColumnPinning, layoutMode, renderTableFooterCell },
	} = table;
	const { column } = footer;
	const { columnDef } = column;
	const { columnDefType } = columnDef;

	const isColumnPinned =
		enableColumnPinning &&
		columnDef.columnDefType !== "group" &&
		column.getIsPinned();

	const widthStyles: CSSProperties = {
		minWidth: `max(calc(var(--header-${parseCSSVarId(
			footer?.id,
		)}-size) * 1px), ${columnDef.minSize ?? 30}px)`,
		width: `calc(var(--header-${parseCSSVarId(footer.id)}-size) * 1px)`,
	};
	if (layoutMode === "grid") {
		widthStyles.flex = `${
			[0, false].includes(columnDef.grow!)
				? 0
				: `var(--header-${parseCSSVarId(footer.id)}-size)`
		} 0 auto`;
	} else if (layoutMode === "grid-no-grow") {
		widthStyles.flex = `${+(columnDef.grow || 0)} 0 auto`;
	}

	const firstPinnedRight =
		isColumnPinned === "right" && column.getIsFirstColumn(isColumnPinned);
	const lastPinnedLeft =
		isColumnPinned === "left" && column.getIsLastColumn(isColumnPinned);

	return renderTableFooterCell({
		footer,
		renderedColumnIndex,
		table,
		widthStyles,
		isColumnPinned,
		firstPinnedRight,
		lastPinnedLeft,
		children: footer.isPlaceholder
			? null
			: parseFromValuesOrFunc(columnDef.Footer, {
					column,
					footer,
					table,
				}) ??
				columnDef.footer ??
				null,
		classes: clsx(
			classes.root,
			layoutMode?.startsWith("grid") && classes.grid,
			columnDefType === "group" && classes.group,
		),
		vars: {
			"--mrt-table-cell-left":
				isColumnPinned === "left"
					? `${column.getStart(isColumnPinned)}`
					: undefined,
			"--mrt-table-cell-right":
				isColumnPinned === "right"
					? `${column.getAfter(isColumnPinned)}`
					: undefined,
		},
	});
}
