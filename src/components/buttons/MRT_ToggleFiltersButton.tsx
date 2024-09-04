import type { HTMLPropsRef, MRT_RowData, MRT_TableInstance } from "../../types";

interface Props<TData extends MRT_RowData>
	extends HTMLPropsRef<HTMLButtonElement> {
	table: MRT_TableInstance<TData>;
}

export const MRT_ToggleFiltersButton = <TData extends MRT_RowData>({
	table,
}: Props<TData>) => {
	return table.options.renderToggleFiltersButton({
		table,
		onClick: () => {
			table.setShowColumnFilters((current) => !current);
		},
	});
};
