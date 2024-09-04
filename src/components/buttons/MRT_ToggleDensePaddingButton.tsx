import type {
	HTMLPropsRef,
	MRT_DensityState,
	MRT_RowData,
	MRT_TableInstance,
} from "../../types";

interface Props<TData extends MRT_RowData>
	extends HTMLPropsRef<HTMLButtonElement> {
	table: MRT_TableInstance<TData>;
}

const next: Record<MRT_DensityState, MRT_DensityState> = {
	xl: "md",
	md: "xs",
	xs: "xl",
};

export const MRT_ToggleDensePaddingButton = <TData extends MRT_RowData>({
	table,
}: Props<TData>) => {
	return table.options.renderToggleDensePaddingButton({
		table,
		onClick: () => {
			table.setDensity((current) => next[current]);
		},
	});
};
