import clsx from "clsx";
import type { MRT_RowData, MRT_TableInstance } from "../../types";
import classes from "./MRT_ExpandAllButton.module.css";

interface Props<TData extends MRT_RowData> {
	table: MRT_TableInstance<TData>;
}

export const MRT_ExpandAllButton = <TData extends MRT_RowData>({
	table,
}: Props<TData>) => {
	const {
		getCanSomeRowsExpand,
		getIsAllRowsExpanded,

		getState,
		options: { renderDetailPanel, renderExpandAllButton },
		toggleAllRowsExpanded,
	} = table;
	const { isLoading } = getState();

	const disabled = isLoading || (!renderDetailPanel && !getCanSomeRowsExpand());
	const onClick = () => toggleAllRowsExpanded(!getIsAllRowsExpanded());

	return renderExpandAllButton({
		table,
		disabled,
		onClick,
	});
};
