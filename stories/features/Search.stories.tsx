import { faker } from "@faker-js/faker";
import type { Meta } from "@storybook/react";
import { type MRT_ColumnDef, MantineReactTable } from "../../src";
import { ActionIcon, Table, Tooltip } from "@mantine/core";
import { IconPinnedOff, IconPinned } from "@tabler/icons-react";

const meta: Meta = {
	title: "Features/Search Examples",
};

export default meta;

const columns: MRT_ColumnDef<(typeof data)[0]>[] = [
	{
		accessorKey: "firstName",
		header: "First Name",
	},
	{
		accessorKey: "lastName",
		header: "Last Name",
	},
	{
		accessorKey: "age",
		header: "Age",
	},
	{
		accessorKey: "address",
		header: "Address",
	},
	{
		accessorKey: "state",
		header: "State",
	},
	{
		accessorKey: "phoneNumber",
		header: "Phone Number",
	},
];

const data = [...Array(200)].map(() => ({
	address: faker.location.streetAddress(),
	age: +faker.number.float({ max: 100, min: 0 }),
	firstName: faker.person.firstName(),
	lastName: faker.person.lastName(),
	phoneNumber: faker.phone.number(),
	state: faker.location.state(),
}));

export const SearchEnabledDefault = () => (
	<MantineReactTable
		columns={columns}
		data={data}
		renderTablePaper={({ children, classes, style }) => (
			<div className={classes} style={style}>
				{children}
			</div>
		)}
		renderTable={({ children, classes, columnSizeVars, table }) => (
			<Table className={classes} style={columnSizeVars} highlightOnHover>
				{children}
			</Table>
		)}
		renderEmptyRowsFallback={({ table, filterUsed }) => (
			<tr>
				<td colSpan={table.getVisibleLeafColumns().length}>
					{filterUsed ? "No results found" : "No data"}
				</td>
			</tr>
		)}
		renderTableBody={({ height, classes, children }) => (
			<tbody className={classes} style={{ height }}>
				{children}
			</tbody>
		)}
		renderTableBodyRow={({ children, classes, vars }) => (
			<tr className={classes} style={vars}>
				{children}
			</tr>
		)}
		renderTableBodyCell={({ children, classes, vars }) => (
			<td className={classes} style={vars}>
				{children}
			</td>
		)}
		renderColumnPinningButtons={({ column }) => {
			return column.getIsPinned() ? (
				<Tooltip label={"unpin"} withinPortal>
					<ActionIcon
						color="gray"
						onClick={() => column.pin(false)}
						size="md"
						variant="subtle"
					>
						<IconPinnedOff />
					</ActionIcon>
				</Tooltip>
			) : (
				<>
					<Tooltip label={"pin to left"} withinPortal>
						<ActionIcon
							color="gray"
							onClick={() => column.pin("left")}
							size="md"
							variant="subtle"
						>
							<IconPinned />
						</ActionIcon>
					</Tooltip>
					<Tooltip withinPortal>
						<ActionIcon
							color="gray"
							onClick={() => column.pin("right")}
							size="md"
							variant="subtle"
						>
							<IconPinned />
						</ActionIcon>
					</Tooltip>
				</>
			);
		}}
		
	/>
);

export const SearchContains = () => (
	<MantineReactTable columns={columns} data={data} globalFilterFn="contains" />
);

export const CustomGlobalFilterFn = () => (
	<MantineReactTable
		columns={columns}
		data={data}
		filterFns={{
			myCustomFilterFn: (row, id, filterValue) =>
				row.getValue<string>(id).startsWith(filterValue),
		}}
		globalFilterFn="myCustomFilterFn"
	/>
);

export const SearchGlobalFilterModes = () => (
	<MantineReactTable columns={columns} data={data} enableGlobalFilterModes />
);

export const SearchGlobalFilterModeOptions = () => (
	<MantineReactTable
		columns={columns}
		data={data}
		enableGlobalFilterModes
		globalFilterModeOptions={["asfd", "contains", "fuzzy"]}
	/>
);

export const SearchRankedResultsEnabledByDefault = () => (
	<MantineReactTable columns={columns} data={data} enableRowNumbers />
);

export const SearchDisableRankedResults = () => (
	<MantineReactTable
		columns={columns}
		data={data}
		enableGlobalFilterRankedResults={false}
		enableRowNumbers
	/>
);

export const ShowSearchRightBoxByDefault = () => (
	<MantineReactTable
		columns={columns}
		data={data}
		initialState={{ showGlobalFilter: true }}
	/>
);

export const ShowSearchBoxLeftByDefault = () => (
	<MantineReactTable
		columns={columns}
		data={data}
		initialState={{ showGlobalFilter: true }}
		positionGlobalFilter="left"
	/>
);

export const ShowSearchBoxLeftByDefaultWithSelection = () => (
	<MantineReactTable
		columns={columns}
		data={data}
		enableRowSelection
		initialState={{ showGlobalFilter: true }}
		positionGlobalFilter="left"
	/>
);

export const JustASearchBox = () => (
	<MantineReactTable
		columns={columns}
		data={data}
		enableToolbarInternalActions={false}
		initialState={{ showGlobalFilter: true }}
	/>
);

export const SearchDisabled = () => (
	<MantineReactTable columns={columns} data={data} enableGlobalFilter={false} />
);

export const CustomizeSearchTextBox = () => (
	<MantineReactTable
		columns={columns}
		data={data}
		initialState={{ showGlobalFilter: true }}
		mantineSearchTextInputProps={{
			label: "Search",
			placeholder: "Search 100 rows",
			variant: "filled",
		}}
	/>
);
