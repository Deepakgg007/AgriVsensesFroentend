import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/home";
import About from "./components/about";
import Service from "./components/service";
import ServiceDetails from "./components/service-details";
import Gallery from "./components/gallery";
import GalleryDetails from "./components/gallery-details";
import ProductList from "./components/product-list";
import ProductDetails from "./components/product-details";
import Contact from "./components/contact";
import DeviceSetup from "./pages/DeviceSetup";
import DeviceData from "./pages/DeviceData";
import CropAnalysis from "./pages/CropAnalysis";
import FarmerRegistration from "./pages/FarmerRegistration";
import KYCUpdate from "./pages/KYCUpdate";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import FarmerProfile from "./pages/FarmerProfile";
import CropsLibrary from "./pages/CropsLibrary";
import CropInformation from "./pages/CropInformation";
import NotFound from "./error";

// Admin imports
import {
	AdminLayout,
	AdminDashboard,
	AdminUsers,
	AdminKYC,
	AdminCrops,
	AdminMasterData,
	AdminDevices,
	AdminSubscriptions,
} from "./pages/admin";

const router = createBrowserRouter([
	{ path: "/", element: <Home /> },
	{ path: "/about", element: <About /> },
	{ path: "/service", element: <Service /> },
	{ path: "/service-details", element: <ServiceDetails /> },
	{ path: "/gallery", element: <Gallery /> },
	{ path: "/gallery-details", element: <GalleryDetails /> },
	{ path: "/product-list", element: <ProductList /> },
	{ path: "/product-details", element: <ProductDetails /> },
	{ path: "/contact", element: <Contact /> },
	{ path: "/device-setup", element: <DeviceSetup /> },
	{ path: "/device-data", element: <DeviceData /> },
	{ path: "/crop-analysis", element: <CropAnalysis /> },
	{ path: "/farmer-registration", element: <FarmerRegistration /> },
	{ path: "/kyc-update", element: <KYCUpdate /> },
	{ path: "/login", element: <Login /> },
	{ path: "/admin/login", element: <AdminLogin /> },
	{ path: "/profile", element: <FarmerProfile /> },
	{ path: "/crops", element: <CropsLibrary /> },
	{ path: "/crops/:cropName", element: <CropInformation /> },

	// Admin routes
	{
		path: "/admin",
		element: <AdminLayout />,
		children: [
			{ index: true, element: <AdminDashboard /> },
			{ path: "users", element: <AdminUsers /> },
			{ path: "kyc", element: <AdminKYC /> },
			{ path: "crops", element: <AdminCrops /> },
			{ path: "master-data", element: <AdminMasterData /> },
			{ path: "devices", element: <AdminDevices /> },
			{ path: "subscriptions", element: <AdminSubscriptions /> },
		],
	},

	// Not found page
	{ path: "*", element: <NotFound /> },
]);

function App() {
	return (
		<>
			<RouterProvider router={router} />
		</>
	);
}

export default App;
