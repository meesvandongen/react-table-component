import { ActionIcon, type ActionIconProps, Tooltip } from "@mantine/core";
import clsx from "clsx";
import type { DragEventHandler } from "react";
import type { HTMLPropsRef, MRT_RowData, MRT_TableInstance } from "../../types";
import classes from "./MRT_GrabHandleButton.module.css";

interface Props<TData extends MRT_RowData> {
	actionIconProps?: ActionIconProps & HTMLPropsRef<HTMLButtonElement>;
	onDragEnd: DragEventHandler<HTMLButtonElement>;
	onDragStart: DragEventHandler<HTMLButtonElement>;
	table: MRT_TableInstance<TData>;
}

export const MRT_GrabHandleButton = <TData extends MRT_RowData>({
	actionIconProps,
	onDragEnd,
	onDragStart,
	table: {
		options: {
			icons: { IconGripHorizontal },
			localization: { move },
		},
	},
}: Props<TData>) => {
	return (
		<Tooltip
			label={actionIconProps?.title ?? move}
			openDelay={1000}
			withinPortal
		>
			<ActionIcon
				aria-label={actionIconProps?.title ?? move}
				draggable
				{...actionIconProps}
				className={clsx(
					"mrt-grab-handle-button",
					classes["grab-icon"],
					actionIconProps?.className,
				)}
				color="gray"
				size="sm"
				onClick={(e) => {
					e.stopPropagation();
					actionIconProps?.onClick?.(e);
				}}
				onDragEnd={onDragEnd}
				onDragStart={onDragStart}
				title={undefined}
				variant="transparent"
			>
				<IconGripHorizontal size="100%" />
			</ActionIcon>
		</Tooltip>
	);
};
