import type { ReactNode } from "react";
import type {
	MRT_Cell,
	MRT_CellValue,
	MRT_RowData,
	MRT_TableInstance,
} from "../../types";

interface Props<TData extends MRT_RowData, TValue = MRT_CellValue> {
	cell: MRT_Cell<TData, TValue>;
	children: ReactNode;
	table: MRT_TableInstance<TData>;
}

export function MRT_CopyButton<TData extends MRT_RowData>({
	cell,
	children,
	table,
}: Props<TData>) {
	const {
		options: { renderCopyButton },
	} = table;

	return renderCopyButton({
		cell,
		table,
		children,
	});
}
