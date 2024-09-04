import type {
	MRT_Cell,
	MRT_CellValue,
	MRT_Row,
	MRT_RowData,
	MRT_TableInstance,
} from "../../types";
import { parseFromValuesOrFunc } from "../../utils/utils";
import { MRT_RowActionMenu } from "../menus/MRT_RowActionMenu";
import { MRT_EditActionButtons } from "./MRT_EditActionButtons";

interface Props<TData extends MRT_RowData, TValue = MRT_CellValue> {
	cell: MRT_Cell<TData, TValue>;
	row: MRT_Row<TData>;
	table: MRT_TableInstance<TData>;
}

export function MRT_ToggleRowActionMenuButton<TData extends MRT_RowData>({
	cell,
	row,
	table,
}: Props<TData>) {
	const {
		getState,
		options: {
			createDisplayMode,
			editDisplayMode,
			enableEditing,
			renderRowActionMenuItems,
			renderRowActions,
			renderToggleRowActionMenuButton,
		},
		setEditingRow,
	} = table;

	const { creatingRow, editingRow } = getState();

	const isCreating = creatingRow?.id === row.id;
	const isEditing = editingRow?.id === row.id;

	function handleStartEditMode() {
		setEditingRow({ ...row });
	}

	const showEditActionButtons =
		(isCreating && createDisplayMode === "row") ||
		(isEditing && editDisplayMode === "row");

	if (showEditActionButtons) {
		return <MRT_EditActionButtons row={row} table={table} />;
	}

	if (renderRowActions) {
		return renderRowActions({ cell, row, table });
	}

	if (renderRowActionMenuItems) {
		return (
			<MRT_RowActionMenu
				handleEdit={handleStartEditMode}
				row={row}
				table={table}
			/>
		);
	}

	if (parseFromValuesOrFunc(enableEditing, row)) {
		const disabled = !!editingRow && editingRow.id !== row.id;
		return renderToggleRowActionMenuButton({
			cell,
			row,
			table,
			onClick: handleStartEditMode,
			disabled,
		});
	}

	return null;
}
