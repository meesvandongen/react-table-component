import clsx from "clsx";
import { useMemo } from "react";
import { useMRT_ColumnVirtualizer } from "../../hooks/useMRT_ColumnVirtualizer";
import type { MRT_RowData, MRT_TableInstance } from "../../types";
import { parseCSSVarId } from "../../utils/style.utils";
import { Memo_MRT_TableBody, MRT_TableBody } from "../body/MRT_TableBody";
import { MRT_TableFooter } from "../footer/MRT_TableFooter";
import { MRT_TableHead } from "../head/MRT_TableHead";
import classes from "./MRT_Table.module.css";

interface Props<TData extends MRT_RowData> {
	table: MRT_TableInstance<TData>;
}
export function MRT_Table<TData extends MRT_RowData>({ table }: Props<TData>) {
	const {
		getFlatHeaders,
		getState,
		options: {
			columns,
			enableTableFooter,
			enableTableHead,
			layoutMode,
			memoMode,
			renderTable,
		},
	} = table;
	const { columnSizing, columnSizingInfo, columnVisibility } = getState();

	const columnSizeVars = useMemo(() => {
		const headers = getFlatHeaders();
		const colSizes: { [key: string]: number } = {};
		for (const header of headers) {
			const colSize = header.getSize();
			colSizes[`--header-${parseCSSVarId(header.id)}-size`] = colSize;
			colSizes[`--col-${parseCSSVarId(header.column.id)}-size`] = colSize;
		}
		return colSizes;
	}, [columns, columnSizing, columnSizingInfo, columnVisibility]);

	const columnVirtualizer = useMRT_ColumnVirtualizer(table);

	const commonTableGroupProps = {
		columnVirtualizer,
		table,
	};

	return renderTable({
		children: (
			<>
				{enableTableHead && <MRT_TableHead {...commonTableGroupProps} />}
				{memoMode === "table-body" || columnSizingInfo.isResizingColumn ? (
					<Memo_MRT_TableBody {...commonTableGroupProps} />
				) : (
					<MRT_TableBody {...commonTableGroupProps} />
				)}
				{enableTableFooter && <MRT_TableFooter {...commonTableGroupProps} />}
			</>
		),
		classes: clsx(
			classes.root,
			layoutMode?.startsWith("grid") && classes.rootGrid,
		),
		columnSizeVars,
		table,
	});
}
