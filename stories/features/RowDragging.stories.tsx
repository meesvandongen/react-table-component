import { faker } from "@faker-js/faker";
import type { Meta } from "@storybook/react";
import { useState } from "react";
import { type MRT_ColumnDef, MantineReactTable } from "../../src";

const meta: Meta = {
	title: "Features/Row Dragging Examples",
};

export default meta;

const columns: MRT_ColumnDef<(typeof initData)[0]>[] = [
	{
		accessorKey: "id",
		header: "ID",
	},
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
		accessorKey: "age",
		header: "Age",
	},
	{
		accessorKey: "state",
		header: "State",
	},
];

const initData = [...Array(25)].map(() => ({
	age: faker.number.int(20) + 18,
	email: faker.internet.email(),
	firstName: faker.person.firstName(),
	id: faker.string.alphanumeric(6),
	lastName: faker.person.lastName(),
	state: faker.location.state(),
}));

export const RowDraggingEnabled = () => {
	const [data, _setData] = useState(() => initData);

	return (
		<MantineReactTable
			autoResetPageIndex={false}
			columns={columns}
			data={data}
			enableRowDragging
		/>
	);
};
