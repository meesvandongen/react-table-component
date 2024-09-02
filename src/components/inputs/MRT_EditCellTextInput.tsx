import {
	MultiSelect,
	type MultiSelectProps,
	Select,
	type SelectProps,
	TextInput,
	type TextInputProps,
} from "@mantine/core";
import { type FocusEvent, type KeyboardEvent, useState } from "react";
import type {
	HTMLPropsRef,
	MRT_Cell,
	MRT_CellValue,
	MRT_RowData,
	MRT_TableInstance,
} from "../../types";
import { parseFromValuesOrFunc } from "../../utils/utils";

interface PropsTextInput<TData extends MRT_RowData, TValue = MRT_CellValue>
	extends TextInputProps {
	cell: MRT_Cell<TData, TValue>;
	table: MRT_TableInstance<TData>;
}

interface PropsSelect<TData extends MRT_RowData, TValue = MRT_CellValue>
	extends SelectProps {
	cell: MRT_Cell<TData, TValue>;
	table: MRT_TableInstance<TData>;
}

interface PropsMultiSelect<TData extends MRT_RowData, TValue = MRT_CellValue>
	extends MultiSelectProps {
	cell: MRT_Cell<TData, TValue>;
	table: MRT_TableInstance<TData>;
}

type MRT_TextInputProps = TextInputProps & HTMLPropsRef<HTMLInputElement>;
type MRT_SelectProps = SelectProps & HTMLPropsRef<HTMLInputElement>;
type MRT_MultiSelectProps = MultiSelectProps & HTMLPropsRef<HTMLInputElement>;

export const MRT_EditCellTextInput = <TData extends MRT_RowData>({
	cell,
	table,
	...rest
}: PropsTextInput<TData> | PropsSelect<TData> | PropsMultiSelect<TData>) => {
	const {
		getState,
		options: {
			createDisplayMode,
			editDisplayMode,
			mantineEditSelectProps,
			mantineEditTextInputProps,
		},
		refs: { editInputRefs },
		setCreatingRow,
		setEditingCell,
		setEditingRow,
	} = table;
	const { column, row } = cell;
	const { columnDef } = column;
	const { creatingRow, editingRow } = getState();

	const isCreating = creatingRow?.id === row.id;
	const isEditing = editingRow?.id === row.id;
	const isSelectEdit = columnDef.editVariant === "select";
	const isMultiSelectEdit = columnDef.editVariant === "multi-select";

	const [value, setValue] = useState(() => cell.getValue<any>());

	const arg = { cell, column, row, table };
	const textInputProps = {
		...parseFromValuesOrFunc(mantineEditTextInputProps, arg),
		...parseFromValuesOrFunc(columnDef.mantineEditTextInputProps, arg),
		...rest,
	} as MRT_TextInputProps;

	const selectProps = {
		...parseFromValuesOrFunc(mantineEditSelectProps, arg),
		...parseFromValuesOrFunc(columnDef.mantineEditSelectProps, arg),
		...rest,
	};

	const saveInputValueToRowCache = (newValue: null | string) => {
		//@ts-ignore
		row._valuesCache[column.id] = newValue;
		if (isCreating) {
			setCreatingRow(row);
		} else if (isEditing) {
			setEditingRow(row);
		}
	};

	const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
		textInputProps.onBlur?.(event);
		saveInputValueToRowCache(value);
		setEditingCell(null);
	};

	const handleEnterKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		textInputProps.onKeyDown?.(event);
		if (event.key === "Enter") {
			editInputRefs.current[cell.id]?.blur();
		}
	};

	if (columnDef.Edit) {
		return columnDef.Edit?.({ cell, column, row, table });
	}

	const commonProps = {
		disabled: parseFromValuesOrFunc(columnDef.enableEditing, row) === false,
		label: ["custom", "modal"].includes(
			(isCreating ? createDisplayMode : editDisplayMode) as string,
		)
			? column.columnDef.header
			: undefined,
		name: cell.id,
		onClick: (e: any) => {
			e.stopPropagation();
			textInputProps?.onClick?.(e);
		},
		placeholder: !["custom", "modal"].includes(
			(isCreating ? createDisplayMode : editDisplayMode) as string,
		)
			? columnDef.header
			: undefined,
		value,
		variant: editDisplayMode === "table" ? "unstyled" : "default",
	} as const;

	if (isSelectEdit) {
		return (
			<Select
				{...commonProps}
				searchable
				value={value as any}
				{...(selectProps as MRT_SelectProps)}
				onBlur={handleBlur}
				onChange={(value) => {
					(selectProps as MRT_SelectProps).onChange?.(value as any);
					setValue(value);
				}}
				onClick={(e) => {
					e.stopPropagation();
					selectProps?.onClick?.(e);
				}}
				ref={(node) => {
					if (node) {
						editInputRefs.current[cell.id] = node;
						if (selectProps.ref) {
							selectProps.ref.current = node;
						}
					}
				}}
			/>
		);
	}

	if (isMultiSelectEdit) {
		return (
			<MultiSelect
				{...commonProps}
				searchable
				value={value}
				{...(selectProps as MRT_MultiSelectProps)}
				onBlur={handleBlur}
				onChange={(value) => {
					(selectProps as MRT_MultiSelectProps).onChange?.(value as any);
					setValue(value);
				}}
				onClick={(e) => {
					e.stopPropagation();
					selectProps?.onClick?.(e);
				}}
				ref={(node) => {
					if (node) {
						editInputRefs.current[cell.id] = node;
						if (selectProps.ref) {
							selectProps.ref.current = node;
						}
					}
				}}
			/>
		);
	}

	return (
		<TextInput
			{...commonProps}
			onKeyDown={handleEnterKeyDown}
			value={value ?? ""}
			{...textInputProps}
			onBlur={handleBlur}
			onChange={(event) => {
				textInputProps.onChange?.(event);
				setValue(event.target.value);
			}}
			onClick={(event) => {
				event.stopPropagation();
				textInputProps?.onClick?.(event);
			}}
			ref={(node) => {
				if (node) {
					editInputRefs.current[cell.id] = node;
					if (textInputProps.ref) {
						textInputProps.ref.current = node;
					}
				}
			}}
		/>
	);
};
