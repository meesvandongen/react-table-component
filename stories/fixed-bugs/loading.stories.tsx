import { Menu } from "@mantine/core";
import type { Meta } from "@storybook/react";
import { useMemo } from "react";
import { type MRT_ColumnDef, MantineReactTable } from "../../src";

const meta: Meta = {
	title: "Fixed Bugs/Loading Data",
};

export default meta;

type Person = {
	address: string;
	city: string;
	name: {
		firstName: string;
		lastName: string;
	};
	state: string;
};

export const NestedLoadingDataWithInitialExpanded = () => {
	const columns = useMemo<MRT_ColumnDef<Person>[]>(
		() => [
			{
				accessorKey: "name.firstName",
				header: "First Name",
			},
			{
				accessorKey: "name.lastName",
				header: "Last Name",
			},
			{
				accessorKey: "address",
				header: "Address",
			},
			{
				accessorKey: "city",
				header: "City",
			},
			{
				accessorKey: "state",
				header: "State",
			},
		],
		[],
	);

	return (
		<MantineReactTable
			columns={columns}
			data={[]}
			state={{
				expanded: true,
				isLoading: true,
			}}
		/>
	);
};

export const NestedLoadingDataWithInitialFilter = () => {
	const columns = useMemo<MRT_ColumnDef<Person>[]>(
		() => [
			{
				accessorKey: "name.firstName",
				header: "First Name",
			},
			{
				accessorKey: "name.lastName",
				header: "Last Name",
			},
			{
				accessorKey: "address",
				header: "Address",
			},
			{
				accessorKey: "city",
				header: "City",
			},
			{
				accessorKey: "state",
				header: "State",
			},
		],
		[],
	);

	return (
		<MantineReactTable
			columns={columns}
			data={[]}
			state={{
				columnFilters: [{ id: "name.firstName", value: "Branson" }],
				isLoading: true,
			}}
		/>
	);
};

export const NestedLoadingDataWithInitialGroup = () => {
	const columns = useMemo<MRT_ColumnDef<Person>[]>(
		() => [
			{
				accessorKey: "name.firstName",
				header: "First Name",
			},
			{
				accessorKey: "name.lastName",
				header: "Last Name",
			},
			{
				accessorKey: "address",
				header: "Address",
			},
			{
				accessorKey: "city",
				header: "City",
			},
			{
				accessorKey: "state",
				header: "State",
			},
		],
		[],
	);

	return (
		<MantineReactTable
			columns={columns}
			data={[]}
			state={{
				grouping: ["name.firstName"],
				isLoading: true,
			}}
		/>
	);
};

export const NestedLoadingDataWithInitialPage = () => {
	const columns = useMemo<MRT_ColumnDef<Person>[]>(
		() => [
			{
				accessorKey: "name.firstName",
				header: "First Name",
			},
			{
				accessorKey: "name.lastName",
				header: "Last Name",
			},
			{
				accessorKey: "address",
				header: "Address",
			},
			{
				accessorKey: "city",
				header: "City",
			},
			{
				accessorKey: "state",
				header: "State",
			},
		],
		[],
	);

	return (
		<MantineReactTable
			columns={columns}
			data={[]}
			state={{
				isLoading: true,
				pagination: { pageIndex: 2, pageSize: 5 },
			}}
		/>
	);
};

export const NestedLoadingDataWithInitialSort = () => {
	const columns = useMemo<MRT_ColumnDef<Person>[]>(
		() => [
			{
				accessorKey: "name.firstName",
				header: "First Name",
			},
			{
				accessorKey: "name.lastName",
				header: "Last Name",
			},
			{
				accessorKey: "address",
				header: "Address",
			},
			{
				accessorKey: "city",
				header: "City",
			},
			{
				accessorKey: "state",
				header: "State",
			},
		],
		[],
	);

	return (
		<MantineReactTable
			columns={columns}
			data={[]}
			state={{
				isLoading: true,
				sorting: [{ desc: false, id: "name.lastName" }],
			}}
		/>
	);
};

export const EmptyDatasetWithLoadingState = () => {
	const columns = useMemo<MRT_ColumnDef<Person>[]>(
		() => [
			{
				accessorFn: (row) => row.name.firstName,
				header: "First Name",
			},
			{
				accessorKey: "name.lastName",
				header: "Last Name",
			},
			{
				accessorKey: "address",
				header: "Address",
			},
			{
				accessorKey: "city",
				header: "City",
			},
			{
				accessorKey: "state",
				header: "State",
			},
		],
		[],
	);

	return (
		<MantineReactTable
			columns={columns}
			data={[]}
			editDisplayMode="table"
			enableEditing
			enableRowActions
			renderRowActionMenuItems={() => (
				<>
					<Menu.Item onClick={() => console.info("Delete")}>Delete</Menu.Item>
				</>
			)}
			state={{ isLoading: true }}
		/>
	);
};
