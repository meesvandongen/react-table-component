import { faker } from "@faker-js/faker";
import type { Meta } from "@storybook/react";
import { type MRT_ColumnDef, MantineReactTable } from "../../src";

const meta: Meta = {
	title: "Features/Column Dragging Examples",
};

export default meta;

type Person = {
	address: string;
	city: string;
	email: string;
	firstName: string;
	lastName: string;
	state: string;
};

const columns: MRT_ColumnDef<Person>[] = [
	{
		accessorKey: "firstName",
		header: "First Name",
	},
	{
		accessorKey: "lastName",
		header: "Last Name",
	},
	{
		accessorKey: "email",
		header: "Email Address",
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
];

const data = [...Array(100)].map(() => ({
	address: faker.location.streetAddress(),
	city: faker.location.city(),
	email: faker.internet.email(),
	firstName: faker.person.firstName(),
	lastName: faker.person.lastName(),
	state: faker.location.state(),
}));

export const ColumnDraggingEnabled = () => (
	<MantineReactTable columns={columns} data={data} enableColumnDragging />
);

export const ColumnDraggingDisabledPerColumn = () => (
	<MantineReactTable
		columns={[
			{
				accessorKey: "firstName",
				header: "First Name",
			},
			{
				accessorKey: "lastName",
				header: "Last Name",
			},
			{
				accessorKey: "email",
				header: "Email Address",
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
				enableColumnDragging: false,
				header: "State",
			},
		]}
		data={data}
		enableColumnDragging
	/>
);
