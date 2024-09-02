import { type Range, useVirtualizer } from "@tanstack/react-virtual";
import { useCallback } from "react";
import type {
	MRT_Row,
	MRT_RowData,
	MRT_RowVirtualizer,
	MRT_TableInstance,
} from "../types";
import { parseFromValuesOrFunc } from "../utils/utils";
import { extraIndexRangeExtractor } from "../utils/virtualization.utils";

export function useMRT_RowVirtualizer<
	TData extends MRT_RowData,
	TScrollElement extends Element | Window = HTMLDivElement,
	TItemElement extends Element = HTMLTableRowElement,
>(
	table: MRT_TableInstance<TData>,
	rows?: MRT_Row<TData>[],
): MRT_RowVirtualizer<TScrollElement, TItemElement> | undefined {
	const {
		getRowModel,
		getState,
		options: {
			enableRowVirtualization,
			renderDetailPanel,
			rowVirtualizerInstanceRef,
			rowVirtualizerOptions,
		},
		refs: { tableContainerRef },
	} = table;
	const { density, draggingRow, expanded } = getState();

	if (!enableRowVirtualization) return undefined;

	const rowVirtualizerProps = parseFromValuesOrFunc(rowVirtualizerOptions, {
		table,
	});

	const rowCount = rows?.length ?? getRowModel().rows.length;

	const rowVirtualizer = useVirtualizer({
		count: renderDetailPanel ? rowCount * 2 : rowCount,
		estimateSize: (index) => {
			if (renderDetailPanel && index % 2 === 1) {
				if (expanded === true) {
					return 100;
				}
				return 0;
			}

			if (density === "xs") {
				return 42.7;
			}

			if (density === "md") {
				return 54.7;
			}

			return 70.7;
		},
		getScrollElement: () => tableContainerRef.current,
		measureElement:
			typeof window !== "undefined" &&
			navigator.userAgent.indexOf("Firefox") === -1
				? (element) => element?.getBoundingClientRect().height
				: undefined,
		overscan: 4,
		rangeExtractor: useCallback(
			(range: Range) => {
				return extraIndexRangeExtractor(range, draggingRow?.index ?? 0);
			},
			[draggingRow],
		),
		...rowVirtualizerProps,
	}) as unknown as MRT_RowVirtualizer<TScrollElement, TItemElement>;

	rowVirtualizer.virtualRows = rowVirtualizer.getVirtualItems() as any;

	if (rowVirtualizerInstanceRef) {
		//@ts-ignore
		rowVirtualizerInstanceRef.current = rowVirtualizer;
	}

	return rowVirtualizer;
}
