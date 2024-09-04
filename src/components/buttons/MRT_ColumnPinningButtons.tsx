import type { MRT_Column, MRT_RowData, MRT_TableInstance } from "../../types";
import classes from "./MRT_ColumnPinningButtons.module.css";

interface Props<TData extends MRT_RowData> {
	column: MRT_Column<TData>;
	table: MRT_TableInstance<TData>;
}

export const MRT_ColumnPinningButtons = <TData extends MRT_RowData>({
	column,
	table,
}: Props<TData>) => {
	const {
		options: { renderColumnPinningButtons },
	} = table;
	return (
		<div className={classes.root}>
			{renderColumnPinningButtons({ column, table })}
		</div>
	);
};
