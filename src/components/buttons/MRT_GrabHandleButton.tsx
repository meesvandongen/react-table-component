import type { DragEventHandler } from "react";
import type { MRT_RowData, MRT_TableInstance } from "../../types";

interface Props<TData extends MRT_RowData> {
	onDragEnd: DragEventHandler<HTMLButtonElement>;
	onDragStart: DragEventHandler<HTMLButtonElement>;
	table: MRT_TableInstance<TData>;
}

export const MRT_GrabHandleButton = <TData extends MRT_RowData>({
	onDragEnd,
	onDragStart,
	table: {
		options: { renderGrabHandleButton },
	},
}: Props<TData>) => {
	return renderGrabHandleButton({
		onDragEnd,
		onDragStart,
	});
};
