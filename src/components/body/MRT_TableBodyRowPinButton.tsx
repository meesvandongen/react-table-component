import type { MRT_Row, MRT_RowData, MRT_TableInstance } from "../../types";
import { parseFromValuesOrFunc } from "../../utils/utils";
import { MRT_RowPinButton } from "../buttons/MRT_RowPinButton";

interface Props<TData extends MRT_RowData> {
	row: MRT_Row<TData>;
	table: MRT_TableInstance<TData>;
}

export const MRT_TableBodyRowPinButton = <TData extends MRT_RowData>({
	row,
	table,
}: Props<TData>) => {
	const {
		getState,
		options: { enableRowPinning, rowPinningDisplayMode },
	} = table;
	const { density } = getState();

	const canPin = parseFromValuesOrFunc(enableRowPinning, row as any);

	if (!canPin) return null;

	const rowPinButtonProps = {
		row,
		table,
	};

	if (rowPinningDisplayMode === "top-and-bottom" && !row.getIsPinned()) {
		return (
			<div
				style={{
					display: "flex",
					flexDirection: density === "xs" ? "row" : "column",
				}}
			>
				<MRT_RowPinButton pinningPosition="top" {...rowPinButtonProps} />
				<MRT_RowPinButton pinningPosition="bottom" {...rowPinButtonProps} />
			</div>
		);
	}

	return (
		<MRT_RowPinButton
			pinningPosition={rowPinningDisplayMode === "bottom" ? "bottom" : "top"}
			{...rowPinButtonProps}
		/>
	);
};
