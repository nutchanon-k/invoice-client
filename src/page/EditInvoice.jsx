import React, { useEffect, useState } from "react";
import TopInvoice from "../components/TopInvoice";
import ItemsTable from "../components/ItemsTable";
import Summary from "../components/Summary";
import { useNavigate, useParams } from "react-router-dom";
import { getInvoiceById, updateInvoice } from "../API/invoiceService";
import dayjs from 'dayjs';




const EditInvoice = () => {
  const { id } = useParams()
  const navigate = useNavigate();

  const [invoiceDetail, setInvoiceDetail] = useState({
    documentNumber: "",
    issueDate: "",
    dueDate: "",
    customerName: "",
    taxAddress: "",
    shippingAddress: "",
    referenceDocumentNumber: "",
    currency: "",
    remarks: "",
  })

  const [items, setItems] = useState(Array(5).fill().map((item) => ({
    code: "",
    quantity: "",
    weight: "",
    pricePerUnit: "",
    unit: "",
    priceBeforeDiscount: "",
    discount: 0,
    totalPrice: ""
  })));

  const [summary, setSummary] = useState({
    netPrice: 0,
    totalDiscount: 0,
    priceAfterDiscount: 0,
    vat: 0,
    grandTotalPrice: 0,
    notes: "",
  },);

  const fetchInvoiceDetail = async (id) => {
    const response = await getInvoiceById(id);
    // console.log(response)
    setInvoiceDetail({
      documentNumber: response.documentNumber,
      issueDate: dayjs(response.issueDate).format('YYYY-MM-DD'),
      dueDate: dayjs(response.dueDate).format('YYYY-MM-DD'),
      customerName: response.customerName,
      taxAddress: response.taxAddress,
      shippingAddress: response.shippingAddress,
      referenceDocumentNumber: response.referenceDocumentNumber,
      currency: response.currency,
      remarks: response.remarks
    })
    items.forEach((item, index) => {
      item.code = response.items[index]?.code;
      item.quantity = response.items[index]?.quantity;
      item.weight = response.items[index]?.weight;
      item.pricePerUnit = response.items[index]?.pricePerUnit;
      item.unit = response.items[index]?.unit;
      item.priceBeforeDiscount = response.items[index]?.priceBeforeDiscount;
      item.discount = response.items[index]?.discount;
      item.totalPrice = response.items[index]?.totalPrice;
    })

    setSummary({
      netPrice: +response.netPrice,
      totalDiscount: +response.discount,
      priceAfterDiscount: +response.priceAfterDiscount,
      vat: +response.vat,
      grandTotalPrice: +response.grandTotalPrice,
      notes: response.notes
    })
  }

  useEffect(() => {
    fetchInvoiceDetail(id)
  }, [id])


  const invoiceTitle = [
    { placeholder: "หมายเลขเอกสาร", name: "documentNumber" },
    { placeholder: "วันที่ออกเอกสาร", name: "issueDate" },
    { placeholder: "วันที่ครบกำหนด", name: "dueDate" },
    { placeholder: "ชื่อลูกค้า", name: "customerName" },
    { placeholder: "ที่อยู่ออกใบกำกับ", name: "taxAddress" },
    { placeholder: "ที่อยู่จัดส่ง", name: "shippingAddress" },
    { placeholder: "หมายเลขเอกสารอ้างอิง", name: "referenceDocumentNumber" },
    { placeholder: "Currency", name: "currency" },
  ]

  const itemsTitle = ["#", "รหัสสินค้า", "จำนวน", "น้ำหนัก", "ราคา/หน่วย", "หน่วย", "ราคาก่อนส่วนลด", "ส่วนลด", "ราคาสุทธิ",]



  const hdlSaveInvoice = async (e) => {
    e.preventDefault();
    try {
      const totalItems = items.filter((item) => item.code !== undefined && item.code !== "");
      // console.log(totalItems, "totalItems")
      const body = {
        documentNumber: invoiceDetail.documentNumber,
        customerName: invoiceDetail.customerName,
        issueDate: invoiceDetail.issueDate,
        dueDate: invoiceDetail.dueDate,
        taxAddress: invoiceDetail.taxAddress,
        shippingAddress: invoiceDetail.shippingAddress,
        referenceDocumentNumber: invoiceDetail.referenceDocumentNumber,
        currency: invoiceDetail.currency,
        netPrice: summary.netPrice,
        discount: summary.totalDiscount,
        priceAfterDiscount: summary.priceAfterDiscount,
        vat: summary.vat,
        grandTotalPrice: summary.grandTotalPrice,
        remarks: invoiceDetail.remarks,
        notes: summary.notes,
        items: totalItems
      }
      // console.log(body, "body")
      const response = await updateInvoice(id, body)
      if (response) {
        // console.log("response", response)
        alert("บันทึกสําเร็จ")
        navigate("/")
      }
    } catch (err) {
      console.log(err)
      alert(err.response.data.message)
    }
  }

  useEffect(() => {
    const netPrice = items.reduce((acc, item) => acc + (item.priceBeforeDiscount || 0), 0);
    const totalDiscount = items.reduce((acc, item) => acc + ((item.priceBeforeDiscount || 0) * (item.discount || 0)) / 100, 0);
    const priceAfterDiscount = netPrice - totalDiscount;
    const vat = priceAfterDiscount * 0.07;
    const grandTotalPrice = priceAfterDiscount + vat;

    setSummary({
      netPrice,
      totalDiscount,
      priceAfterDiscount,
      vat,
      grandTotalPrice
    });
  }, [items]);


  return (
    <form onSubmit={hdlSaveInvoice} className="p-6">
      {/* Header */}
      <div className="bg-white p-6 grid grid-cols-3 border border-gray-400">
        <TopInvoice
          invoiceTitle={invoiceTitle}
          invoiceDetail={invoiceDetail}
          setInvoiceDetail={setInvoiceDetail}
        />
      </div>


      <div className="grid grid-cols-3">
        <ItemsTable itemsTitle={itemsTitle} items={items} setItems={setItems} invoiceDetail={invoiceDetail} setInvoiceDetail={setInvoiceDetail}
        />
        <Summary summary={summary} setSummary={setSummary} />
      </div>


      <div className="mt-6 flex justify-end space-x-2">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="px-4 py-2 rounded border border-gray-400 w-24">Cancel</button>
        <button
          type="submit"
          className="px-4 py-2 rounded border border-gray-400 w-24">Save</button>
      </div>
    </form>
  )
}
export default EditInvoice