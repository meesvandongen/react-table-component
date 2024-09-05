import clsx from "clsx";
import { type MouseEvent, useState } from "react";
import { localizedFilterOption } from "../../fns/filterFns";
import type { MRT_Header, MRT_RowData, MRT_TableInstance } from "../../types";
import { dataVariable } from "../../utils/style.utils";
import { MRT_TableHeadCellFilterContainer } from "./MRT_TableHeadCellFilterContainer";
import classes from "./MRT_TableHeadCellFilterLabel.module.css";

interface Props<TData extends MRT_RowData> extends ActionIconProps {
	header: MRT_Header<TData>;
	table: MRT_TableInstance<TData>;
}

export const MRT_TableHeadCellFilterLabel = <TData extends MRT_RowData>({
	header,
	table,
}: Props<TData>) => {
	const {
		options: { columnFilterDisplayMode },
		refs: { filterInputRefs },
		setShowColumnFilters,
	} = table;
	const { column } = header;
	const { columnDef } = column;

	const filterValue = column.getFilterValue();

	const [popoverOpened, setPopoverOpened] = useState(false);

	const isFilterActive =
		(Array.isArray(filterValue) && filterValue.some(Boolean)) ||
		(!!filterValue && !Array.isArray(filterValue));

	const isRangeFilter =
		columnDef.filterVariant === "range" ||
		columnDef.filterVariant === "date-range" ||
		["between", "betweenInclusive", "inNumberRange"].includes(
			columnDef._filterFn,
		);
	const currentFilterOption = columnDef._filterFn;
	const filterValueFn =
		columnDef.filterTooltipValueFn || ((value) => value as string);
	const filterTooltip = {
		column: String(columnDef.header),
		filterType: currentFilterOption,
		filterValue,
		filterValueFn,
	};

	return (
		<>
			<Popover
				keepMounted={columnDef.filterVariant === "range-slider"}
				onClose={() => setPopoverOpened(false)}
				opened={popoverOpened}
				position="top"
				shadow="xl"
				width={360}
				withinPortal
			>
				<Transition
					mounted={
						columnFilterDisplayMode === "popover" ||
						(!!column.getFilterValue() && !isRangeFilter) ||
						(isRangeFilter &&
							(!!(column.getFilterValue() as [any, any])?.[0] ||
								!!(column.getFilterValue() as [any, any])?.[1]))
					}
					transition="scale"
				>
					{() => (
						<Popover.Target>
							<Tooltip
								disabled={popoverOpened}
								label={filterTooltip}
								multiline
								w={filterTooltip.length > 40 ? 300 : undefined}
								withinPortal
							>
								<ActionIcon
									className={clsx(
										"mrt-table-head-cell-filter-label-icon",
										classes.root,
									)}
									size={18}
									{...dataVariable("active", isFilterActive)}
									onClick={(event: MouseEvent<HTMLButtonElement>) => {
										event.stopPropagation();
										if (columnFilterDisplayMode === "popover") {
											setPopoverOpened((opened) => !opened);
										} else {
											setShowColumnFilters(true);
										}
										setTimeout(() => {
											const input = filterInputRefs.current[`${column.id}-0`];
											input?.focus();
											input?.select();
										}, 100);
									}}
									{...rest}
								>
									<IconFilter size="100%" />
								</ActionIcon>
							</Tooltip>
						</Popover.Target>
					)}
				</Transition>
				{columnFilterDisplayMode === "popover" && (
					<Popover.Dropdown
						onClick={(event) => event.stopPropagation()}
						onKeyDown={(event) =>
							event.key === "Enter" && setPopoverOpened(false)
						}
						onMouseDown={(event) => event.stopPropagation()}
					>
						<MRT_TableHeadCellFilterContainer header={header} table={table} />
					</Popover.Dropdown>
				)}
			</Popover>
		</>
	);
};
