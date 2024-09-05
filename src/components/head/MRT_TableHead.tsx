import clsx from "clsx";
import type {
	MRT_ColumnVirtualizer,
	MRT_RowData,
	MRT_TableInstance,
} from "../../types";
import { MRT_ToolbarAlertBanner } from "../toolbar/MRT_ToolbarAlertBanner";
import classes from "./MRT_TableHead.module.css";
import { MRT_TableHeadRow } from "./MRT_TableHeadRow";

interface Props<TData extends MRT_RowData> {
	columnVirtualizer?: MRT_ColumnVirtualizer;
	table: MRT_TableInstance<TData>;
}

export function MRT_TableHead<TData extends MRT_RowData>({
	columnVirtualizer,
	table,
}: Props<TData>) {
	const {
		getHeaderGroups,
		getSelectedRowModel,
		getState,
		options: {
			enableStickyHeader,
			layoutMode,
			positionToolbarAlertBanner,
			renderTableHead,
		},
		refs: { tableHeadRef },
	} = table;
	const { isFullScreen, showAlertBanner } = getState();

	const stickyHeader = enableStickyHeader || isFullScreen;

	const ref = (ref: HTMLTableSectionElement) => {
		tableHeadRef.current = ref;
	};

	return renderTableHead({
		ref,
		classes: clsx(
			classes.root,
			stickyHeader && classes["root-sticky"],
			stickyHeader && layoutMode?.startsWith("grid")
				? classes.sticky
				: classes.relative,
			layoutMode?.startsWith("grid")
				? classes["root-grid"]
				: classes["root-table-row-group"],
		),
		children:
			positionToolbarAlertBanner === "head-overlay" &&
			(showAlertBanner || getSelectedRowModel().rows.length > 0) ? (
				<tr
					className={clsx(
						classes["banner-tr"],
						layoutMode?.startsWith("grid") && classes.grid,
					)}
				>
					<th
						className={clsx(
							classes["banner-th"],
							layoutMode?.startsWith("grid") && classes.grid,
						)}
						colSpan={table.getVisibleLeafColumns().length}
					>
						<MRT_ToolbarAlertBanner table={table} />
					</th>
				</tr>
			) : (
				getHeaderGroups().map((headerGroup) => (
					<MRT_TableHeadRow
						columnVirtualizer={columnVirtualizer}
						headerGroup={headerGroup as any}
						key={headerGroup.id}
						table={table}
					/>
				))
			),
		table,
	});
}
