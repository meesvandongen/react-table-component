import type { RowPinningPosition } from "@tanstack/react-table";
import type { MRT_Row, MRT_RowData, MRT_TableInstance } from "../../types";

interface Props<TData extends MRT_RowData> {
	pinningPosition: RowPinningPosition;
	row: MRT_Row<TData>;
	table: MRT_TableInstance<TData>;
}

export const MRT_RowPinButton = <TData extends MRT_RowData>({
	pinningPosition,
	row,
	table,
}: Props<TData>) => {
	const {
		options: { renderRowPinButton },
	} = table;

	return renderRowPinButton({
		row,
		table,
		pinningPosition,
		onClick: () => {
			row.pin(row.getIsPinned() ? false : pinningPosition);
		},
	});
};
