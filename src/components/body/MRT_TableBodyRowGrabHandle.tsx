import type { DragEvent, RefObject } from "react";
import type { MRT_Row, MRT_RowData, MRT_TableInstance } from "../../types";
import { MRT_GrabHandleButton } from "../buttons/MRT_GrabHandleButton";

interface Props<TData extends MRT_RowData> {
	row: MRT_Row<TData>;
	rowRef: RefObject<HTMLTableRowElement>;
	table: MRT_TableInstance<TData>;
}

export function MRT_TableBodyRowGrabHandle<TData extends MRT_RowData>({
	row,
	rowRef,
	table,
}: Props<TData>) {
	return (
		<MRT_GrabHandleButton
			onDragEnd={() => {
				table.setDraggingRow(null);
				table.setHoveredRow(null);
			}}
			onDragStart={(event: DragEvent<HTMLButtonElement>) => {
				event.dataTransfer.setDragImage(rowRef.current as HTMLElement, 0, 0);
				table.setDraggingRow(row);
			}}
			table={table}
		/>
	);
}
