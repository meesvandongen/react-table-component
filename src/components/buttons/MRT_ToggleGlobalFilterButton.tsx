import type { HTMLPropsRef, MRT_RowData, MRT_TableInstance } from "../../types";

interface Props<TData extends MRT_RowData>
	extends HTMLPropsRef<HTMLButtonElement> {
	table: MRT_TableInstance<TData>;
}

export const MRT_ToggleGlobalFilterButton = <TData extends MRT_RowData>({
	table,
}: Props<TData>) => {
	const { globalFilter, showGlobalFilter } = table.getState();

	const handleToggleSearch = () => {
		table.setShowGlobalFilter((v) => !v);
		setTimeout(() => table.refs.searchInputRef.current?.focus(), 100);
	};

	const disabled = !!globalFilter;

	return table.options.renderToggleGlobalFilterButton({
		onClick: handleToggleSearch,
		disabled,
		showGlobalFilter,
		table,
	});
};
