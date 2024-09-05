import type { DragEvent, RefObject } from "react";
import type {
	MRT_CellValue,
	MRT_Column,
	MRT_RowData,
	MRT_TableInstance,
} from "../../types";
import { reorderColumn } from "../../utils/column.utils";
import { MRT_GrabHandleButton } from "../buttons/MRT_GrabHandleButton";

interface Props<TData extends MRT_RowData, TValue = MRT_CellValue> {
	column: MRT_Column<TData, TValue>;
	table: MRT_TableInstance<TData>;
	tableHeadCellRef: RefObject<HTMLTableCellElement>;
}

export const MRT_TableHeadCellGrabHandle = <TData extends MRT_RowData>({
	column,
	table,
	tableHeadCellRef,
}: Props<TData>) => {
	const {
		getState,
		options: { enableColumnOrdering },
		setColumnOrder,
		setDraggingColumn,
		setHoveredColumn,
	} = table;
	const { columnOrder, draggingColumn, hoveredColumn } = getState();

	function handleDragStart(event: DragEvent<HTMLButtonElement>) {
		setDraggingColumn(column);
		event.dataTransfer.setDragImage(
			tableHeadCellRef.current as HTMLElement,
			0,
			0,
		);
	}

	function handleDragEnd() {
		if (hoveredColumn?.id === "drop-zone") {
			column.toggleGrouping();
		} else if (
			enableColumnOrdering &&
			hoveredColumn &&
			hoveredColumn?.id !== draggingColumn?.id
		) {
			setColumnOrder(
				reorderColumn(column, hoveredColumn as MRT_Column<TData>, columnOrder),
			);
		}
		setDraggingColumn(null);
		setHoveredColumn(null);
	}

	return (
		<MRT_GrabHandleButton
			onDragEnd={handleDragEnd}
			onDragStart={handleDragStart}
			table={table}
		/>
	);
};
