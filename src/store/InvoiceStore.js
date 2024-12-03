import {create} from 'zustand' 
import { createJSONStorage, persist } from "zustand/middleware";

const useInvoiceStore = create(persist((set, get) => ({
  allInvoices: [],
  currentInvoice: null,

  setAllInvoices: (invoices) => set({ allInvoices : invoices }),
  setCurrentInvoice: (invoice) => set({ currentInvoice : invoice }),


}),{
  name: "InvoiceStore",
  storage: createJSONStorage(() => localStorage),
}));

export default useInvoiceStore;
