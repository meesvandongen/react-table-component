import type { MRT_Row, MRT_RowData, MRT_TableInstance } from "../../types";

interface Props<TData extends MRT_RowData> {
	row: MRT_Row<TData>;
	table: MRT_TableInstance<TData>;
}

export const MRT_ExpandButton = <TData extends MRT_RowData>({
	row,
	table,
}: Props<TData>) => {
	const {
		options: { renderDetailPanel, renderExpandButton },
	} = table;

	return renderExpandButton({
		row,
		table,
		disabled: !row.getCanExpand() && !renderDetailPanel?.({ row, table }),
		onClick: () => row.toggleExpanded(),
	});
};
