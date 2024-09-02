import {
	type Renderable,
	createRow as _createRow,
	flexRender as _flexRender,
} from "@tanstack/react-table";
import type { ReactNode } from "react";
import type {
	MRT_ColumnHelper,
	MRT_DisplayColumnDef,
	MRT_GroupColumnDef,
	MRT_Row,
	MRT_RowData,
	MRT_TableInstance,
} from "../types";
import { getAllLeafColumnDefs, getColumnId } from "./column.utils";

export const flexRender = _flexRender as (
	Comp: Renderable<any>,
	props: any,
) => JSX.Element | ReactNode;

export function createMRTColumnHelper<
	TData extends MRT_RowData,
>(): MRT_ColumnHelper<TData> {
	return {
		accessor: (accessor, column) => {
			return typeof accessor === "function"
				? ({
						...column,
						accessorFn: accessor,
					} as any)
				: {
						...column,
						accessorKey: accessor,
					};
		},
		display: (column) => column as MRT_DisplayColumnDef<TData>,
		group: (column) => column as MRT_GroupColumnDef<TData>,
	};
}

export const createRow = <TData extends MRT_RowData>(
	table: MRT_TableInstance<TData>,
	originalRow?: TData,
	rowIndex = -1,
	depth = 0,
	subRows?: MRT_Row<TData>[],
	parentId?: string,
): MRT_Row<TData> =>
	_createRow(
		table as any,
		"mrt-row-create",
		originalRow ??
			Object.assign(
				{},
				...getAllLeafColumnDefs(table.options.columns).map((col) => ({
					[getColumnId(col)]: "",
				})),
			),
		rowIndex,
		depth,
		subRows as any,
		parentId,
	) as MRT_Row<TData>;
