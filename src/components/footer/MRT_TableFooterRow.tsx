import clsx from "clsx";
import type {
	MRT_ColumnVirtualizer,
	MRT_Header,
	MRT_HeaderGroup,
	MRT_RowData,
	MRT_TableInstance,
	MRT_VirtualItem,
} from "../../types";
import { MRT_TableFooterCell } from "./MRT_TableFooterCell";
import classes from "./MRT_TableFooterRow.module.css";

interface Props<TData extends MRT_RowData> {
	columnVirtualizer?: MRT_ColumnVirtualizer;
	footerGroup: MRT_HeaderGroup<TData>;
	table: MRT_TableInstance<TData>;
}

export function MRT_TableFooterRow<TData extends MRT_RowData>({
	columnVirtualizer,
	footerGroup,
	table,
}: Props<TData>) {
	const {
		options: { layoutMode, renderTableFooterRow },
	} = table;

	const { virtualColumns, virtualPaddingLeft, virtualPaddingRight } =
		columnVirtualizer ?? {};

	// if no content in row, skip row
	if (
		!footerGroup.headers?.some(
			(header) =>
				(typeof header.column.columnDef.footer === "string" &&
					!!header.column.columnDef.footer) ||
				header.column.columnDef.Footer,
		)
	) {
		return null;
	}

	return renderTableFooterRow({
		classes: clsx(
			classes.root,
			layoutMode?.startsWith("grid") && classes["layout-mode-grid"],
		),
		table,
		children: (
			<>
				{virtualPaddingLeft ? (
					<th
						style={{
							display: "flex",
							width: `${virtualPaddingLeft}px`,
						}}
					/>
				) : null}
				{(virtualColumns ?? footerGroup.headers).map(
					(footerOrVirtualFooter, renderedColumnIndex) => {
						let footer = footerOrVirtualFooter as MRT_Header<TData>;
						if (columnVirtualizer) {
							renderedColumnIndex = (footerOrVirtualFooter as MRT_VirtualItem)
								.index;
							footer = footerGroup.headers[renderedColumnIndex];
						}

						return (
							<MRT_TableFooterCell
								footer={footer}
								key={footer.id}
								renderedColumnIndex={renderedColumnIndex}
								table={table}
							/>
						);
					},
				)}
				{virtualPaddingRight ? (
					<th
						style={{
							display: "flex",
							width: `${virtualPaddingRight}px`,
						}}
					/>
				) : null}
			</>
		),
	});
}
