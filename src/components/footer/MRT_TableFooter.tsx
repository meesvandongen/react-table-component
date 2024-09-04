import clsx from "clsx";
import type {
	MRT_ColumnVirtualizer,
	MRT_RowData,
	MRT_TableInstance,
} from "../../types";
import classes from "./MRT_TableFooter.module.css";
import { MRT_TableFooterRow } from "./MRT_TableFooterRow";

interface Props<TData extends MRT_RowData> {
	columnVirtualizer?: MRT_ColumnVirtualizer;
	table: MRT_TableInstance<TData>;
}

export const MRT_TableFooter = <TData extends MRT_RowData>({
	columnVirtualizer,
	table,
}: Props<TData>) => {
	const {
		getFooterGroups,
		getState,
		options: { enableStickyFooter, layoutMode, renderTableFooter },
		refs: { tableFooterRef },
	} = table;
	const { isFullScreen } = getState();

	const stickFooter =
		(isFullScreen || enableStickyFooter) && enableStickyFooter !== false;

	const ref = (ref: HTMLTableSectionElement) => {
		tableFooterRef.current = ref;
	};

	return renderTableFooter({
		classes: clsx(
			classes.root,
			stickFooter && classes.sticky,
			layoutMode?.startsWith("grid") && classes.grid,
		),
		ref,
		children: getFooterGroups().map((footerGroup) => (
			<MRT_TableFooterRow
				columnVirtualizer={columnVirtualizer}
				footerGroup={footerGroup as any}
				key={footerGroup.id}
				table={table}
			/>
		)),
		table,
	});
};
