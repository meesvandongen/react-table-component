import clsx from "clsx";
import type { MRT_Header, MRT_RowData, MRT_TableInstance } from "../../types";
import classes from "./MRT_TableHeadCellResizeHandle.module.css";

interface Props<TData extends MRT_RowData> {
	header: MRT_Header<TData>;
	table: MRT_TableInstance<TData>;
}

export function MRT_TableHeadCellResizeHandle<TData extends MRT_RowData>({
	header,
	table,
}: Props<TData>) {
	const {
		getState,
		options: {
			columnResizeDirection,
			columnResizeMode,
			renderTableHeadCellResizeHandle,
		},
		setColumnSizingInfo,
	} = table;
	const { density } = getState();
	const { column } = header;
	const handler = header.getResizeHandler();

	const offset =
		column.getIsResizing() && columnResizeMode === "onEnd"
			? `translateX(${
					(columnResizeDirection === "rtl" ? -1 : 1) *
					(getState().columnSizingInfo.deltaOffset ?? 0)
				}px)`
			: undefined;

	const onDoubleClick = () => {
		setColumnSizingInfo((old) => ({
			...old,
			isResizingColumn: false,
		}));
		column.resetSize();
	};
	return renderTableHeadCellResizeHandle({
		header,
		table,
		column,
		onDoubleClick,
		onMouseDown: handler,
		onTouchStart: handler,
		offset,
		className: clsx(
			"mrt-table-head-cell-resize-handle",
			classes.root,
			classes[`root-${columnResizeDirection}`],
			!header.subHeaders.length &&
				columnResizeMode === "onChange" &&
				classes["root-hide"],
			density,
		),
	});
}
