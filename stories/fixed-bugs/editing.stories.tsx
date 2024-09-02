import { faker } from "@faker-js/faker";
import { Menu } from "@mantine/core";
import type { Meta } from "@storybook/react";
import { type MRT_ColumnDef, MantineReactTable } from "../../src";

const meta: Meta = {
	title: "Fixed Bugs/Editing",
};

export default meta;

type Person = {
	address: string;
	city: string;
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

const data = [...Array(6)].map(() => ({
	address: faker.location.streetAddress(),
	city: faker.location.city(),
	firstName: faker.person.firstName(),
	lastName: faker.person.lastName(),
	state: faker.location.state(),
}));

export const TableEditModeAndRowActions = () => {
	return (
		<MantineReactTable
			columns={columns}
			data={data}
			editDisplayMode="table"
			enableEditing
			enableRowActions
			renderRowActionMenuItems={() => (
				<>
					<Menu.Item onClick={() => console.info("Delete")}>Delete</Menu.Item>
				</>
			)}
		/>
	);
};
