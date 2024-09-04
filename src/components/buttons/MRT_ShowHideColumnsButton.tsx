import type { HTMLPropsRef, MRT_RowData, MRT_TableInstance } from "../../types";
import { MRT_ShowHideColumnsMenu } from "../menus/MRT_ShowHideColumnsMenu";

interface Props<TData extends MRT_RowData>
	extends HTMLPropsRef<HTMLButtonElement> {
	table: MRT_TableInstance<TData>;
}

export function MRT_ShowHideColumnsButton<TData extends MRT_RowData>({
	table,
}: Props<TData>) {
	return table.options.renderShowHideColumnsButton({
		table,
		children: <MRT_ShowHideColumnsMenu table={table} />,
	});
}
