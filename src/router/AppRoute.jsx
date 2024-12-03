
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import ShowInvoice from "../page/ShowInvoice";
import CreateInvoice from "../page/CreateInvoice";
import EditInvoice from "../page/EditInvoice";


const Router = createBrowserRouter([
  { path: "/", element: <ShowInvoice /> },
  { path: "/create-invoice", element: <CreateInvoice /> },
  { path: "/edit-invoice/:id", element: <EditInvoice /> },
  { path: "*", element: <Navigate to="/" /> },
  
]);

const AppRouter = () => {
  return (
    <RouterProvider router={Router} />
  )
}
export default AppRouter