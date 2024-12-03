import React, { useEffect, useState } from "react";
import TopInvoice from "../components/TopInvoice";
import ItemsTable from "../components/ItemsTable";
import Summary from "../components/Summary";
import { useNavigate } from "react-router-dom";
import { createInvoice } from "../API/invoiceService";




const CreateInvoice = () => {
    const navigate = useNavigate();
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

    const hdlSaveInvoice = async (e) => {
        e.preventDefault();
        try{
            const totalItems = items.filter((item) => item.code !== undefined && item.code !== "");
            const body = {
                documentNumber : invoiceDetail.documentNumber,
                customerName : invoiceDetail.customerName,
                issueDate : invoiceDetail.issueDate,  
                dueDate : invoiceDetail.dueDate,
                taxAddress : invoiceDetail.taxAddress,
                shippingAddress : invoiceDetail.shippingAddress,
                referenceDocumentNumber : invoiceDetail.referenceDocumentNumber,
                currency : invoiceDetail.currency,
                netPrice : summary.netPrice,
                discount : summary.totalDiscount,
                priceAfterDiscount : summary.priceAfterDiscount,
                vat : summary.vat,
                grandTotalPrice : summary.grandTotalPrice,
                remarks : invoiceDetail.remarks,
                notes : summary.notes,
                items : totalItems
            }
            // console.log(body)
            const response = await createInvoice(body)
            if(response){
                // console.log("response",response)
                alert("บันทึกสําเร็จ")
                navigate("/")
            }
        }catch(err){
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

    // console.log(invoiceDetail, "sum")
    // console.log(summary, "summary")
    return (
        <form onSubmit={hdlSaveInvoice} className="p-6 h-screen">
            {/* Header */}
            <div className="bg-white p-6 grid grid-cols-3 border border-gray-400">
                <TopInvoice invoiceTitle={invoiceTitle} invoiceDetail={invoiceDetail} setInvoiceDetail={setInvoiceDetail} />
            </div>

            {/* รายการสินค้า และ สรุป */}
            <div className="grid grid-cols-3 ">
                {/* รายการสินค้า */}
                <ItemsTable  itemsTitle={itemsTitle} items={items} setItems={setItems} invoiceDetail={invoiceDetail} setInvoiceDetail={setInvoiceDetail} />
                {/* สรุป */}
                <Summary summary={summary} setSummary={setSummary} />
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-end space-x-2">
                <button
                    onClick={() => navigate("/")}
                    className="px-4 py-2 rounded border border-gray-400 w-24">Cancel</button>
                <button
                    type="submit"
                    className="px-4 py-2 rounded border border-gray-400 w-24">Save</button>
            </div>
        </form>
    )
}
export default CreateInvoice