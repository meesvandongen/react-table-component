import type { MRT_RowData, MRT_TableInstance } from "../../types";

interface Props<TData extends MRT_RowData> {
	table: MRT_TableInstance<TData>;
}

export const MRT_ToggleFullScreenButton = <TData extends MRT_RowData>({
	table,
}: Props<TData>) => {
	const handleToggleFullScreen = () => {
		table.setIsFullScreen((current) => !current);
	};

	return table.options.renderToggleFullScreenButton({
		table,
		onClick: handleToggleFullScreen,
	});
};
