interface DataType {
	id: number;
	title: string;
	link: string;
	img_dropdown?: boolean;
	has_dropdown?: boolean;
	sub_menus?: {
		link: string;
		title: string;
		demo_img?: string;
	}[];
}

// menu data
const menu_data: DataType[] = [
	{
		id: 1,
		title: "Home",
		link: "/",
		has_dropdown: false,
	},
	{
		id: 2,
		title: "About Us",
		link: "/about",
		has_dropdown: false,
	},

	{
		id: 3,
		title: "Farmer",
		link: "#",
		has_dropdown: true,
		sub_menus: [

			{ link: "/kyc-update", title: "KYC Update" },
			{ link: "/device-setup", title: " My Device" },
		],
	},
		{
		id: 3,
		title: "Services",
		link: "#",
		has_dropdown: true,
		sub_menus: [
			{ link: "/service", title: "Services" },
			{ link: "/service-details", title: "Services Details" },
			{ link: "/product-list", title: "Product" },
			{ link: "/product-details", title: "Product Details" },
			
		],
	},
			{
		id: 4,
		title: "Crops",
		link: "/crops",
		has_dropdown: false,
	},
	// {
	// 	id: 5,
	// 	title: "Projects",
	// 	link: "#",
	// 	has_dropdown: true,
	// 	sub_menus: [
	// 		{ link: "/gallery", title: "Gallery" },
	// 		{ link: "/gallery-details", title: "Gallery Details" },
	// 	],
	// },

	{
		id: 7,
		title: "Contact",
		link: "/contact",
		has_dropdown: false,
	},
];
export default menu_data;
