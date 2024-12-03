import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
});

export const createInvoice = async (invoice) => {
  const response = await axiosInstance.post("/invoices", invoice);
  return response.data;
};

export const getInvoices = async () => {
  const response = await axiosInstance.get("/invoices");
  return response.data;
};

export const getInvoiceById = async (id) => {
  const response = await axiosInstance.get(`/invoices/${id}`);
  return response.data;
};


export const updateInvoice = async (id, invoice) => {
  const response = await axiosInstance.put(`/invoices/${id}`, invoice);
  return response.data;
}

export const deleteInvoice = async (id) => {
  const response = await axiosInstance.delete(`/invoices/${id}`);
  return response.data;
}