import clsx from "clsx";
import type { MRT_RowData, MRT_TableInstance } from "../../types";
import { parseFromValuesOrFunc } from "../../utils/utils";
import { MRT_BottomToolbar } from "../toolbar/MRT_BottomToolbar";
import { MRT_TopToolbar } from "../toolbar/MRT_TopToolbar";
import { MRT_TableContainer } from "./MRT_TableContainer";
import classes from "./MRT_TablePaper.module.css";

interface Props<TData extends MRT_RowData> {
	table: MRT_TableInstance<TData>;
}

export const MRT_TablePaper = <TData extends MRT_RowData>({
	table,
}: Props<TData>) => {
	const {
		getState,
		options: {
			enableBottomToolbar,
			enableTopToolbar,
			renderBottomToolbar,
			renderTopToolbar,
			renderTablePaper,
		},
		refs: { tablePaperRef },
	} = table;
	const { isFullScreen } = getState();

	return renderTablePaper({
		classes: clsx(
			"mrt-table-paper",
			classes.root,
			isFullScreen && "mrt-table-paper-fullscreen",
		),
		style: {
			zIndex: isFullScreen ? 200 : undefined,
			...(isFullScreen
				? {
						border: 0,
						borderRadius: 0,
						bottom: 0,
						height: "100vh",
						left: 0,
						margin: 0,
						maxHeight: "100vh",
						maxWidth: "100vw",
						padding: 0,
						position: "fixed",
						right: 0,
						top: 0,
						width: "100vw",
					}
				: null),
		},
		children: (
			<>
				{enableTopToolbar &&
					(parseFromValuesOrFunc(renderTopToolbar, { table }) ?? (
						<MRT_TopToolbar table={table} />
					))}
				<MRT_TableContainer table={table} />
				{enableBottomToolbar &&
					(parseFromValuesOrFunc(renderBottomToolbar, { table }) ?? (
						<MRT_BottomToolbar table={table} />
					))}
			</>
		),
	});
};
