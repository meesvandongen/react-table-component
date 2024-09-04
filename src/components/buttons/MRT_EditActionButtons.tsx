import type { MRT_Row, MRT_RowData, MRT_TableInstance } from "../../types";

interface Props<TData extends MRT_RowData> {
	row: MRT_Row<TData>;
	table: MRT_TableInstance<TData>;
	variant?: "icon" | "text";
}

export function MRT_EditActionButtons<TData extends MRT_RowData>({
	row,
	table,
}: Props<TData>) {
	const {
		getState,
		options: {
			onCreatingRowCancel,
			onCreatingRowSave,
			onEditingRowCancel,
			onEditingRowSave,
			renderEditActionButtons,
		},
		refs: { editInputRefs },
		setCreatingRow,
		setEditingRow,
	} = table;
	const { creatingRow, editingRow, isSaving } = getState();

	const isCreating = creatingRow?.id === row.id;
	const isEditing = editingRow?.id === row.id;

	function handleCancel() {
		if (isCreating) {
			onCreatingRowCancel?.({ row, table });
			setCreatingRow(null);
		} else if (isEditing) {
			onEditingRowCancel?.({ row, table });
			setEditingRow(null);
		}
		row._valuesCache = {} as any; //reset values cache
	}

	function handleSubmitRow() {
		//look for auto-filled input values
		for (const input of Object.values(editInputRefs?.current)) {
			if (
				row.id === input?.name?.split("_")?.[0] &&
				input.value !== undefined &&
				Object.hasOwn(row?._valuesCache as object, input.name)
			) {
				// @ts-ignore
				row._valuesCache[input.name] = input.value;
			}
		}
		if (isCreating)
			onCreatingRowSave?.({
				exitCreatingMode: () => setCreatingRow(null),
				row,
				table,
				values: row._valuesCache,
			});
		else if (isEditing) {
			onEditingRowSave?.({
				exitEditingMode: () => setEditingRow(null),
				row,
				table,
				values: row?._valuesCache,
			});
		}
	}

	return renderEditActionButtons({
		handleCancel,
		handleSubmitRow,
		isSaving,
		table,
		row,
	});
}
