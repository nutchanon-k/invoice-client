import { Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useInvoiceStore from '../store/InvoiceStore';
import { deleteInvoice, getInvoices } from '../API/invoiceService';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const ShowInvoice = () => {
    const navigate = useNavigate()
    

    const allInvoices = useInvoiceStore(state => state.allInvoices)
    const setAllInvoices = useInvoiceStore(state => state.setAllInvoices)
    
    const fetchAllInvoice = async () => {
        const response = await getInvoices();
        // console.log(response)
        setAllInvoices(response)
    }

    useEffect(() => {
        fetchAllInvoice()
    }, [])


    // console.log(allInvoices)


    const handleDelete = async (invoice) => {
        const confirm = window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ Invoice หมายเลข ${invoice.documentNumber}`)
        // console.log(confirm)
        if(confirm){
            const response = await deleteInvoice(invoice.id)
            if(response){
                alert("ลบสําเร็จ")
                fetchAllInvoice()
                
            }
        }
        
    };
    

    const handleEdit = (id) => {
        navigate(`/edit-invoice/${id}`)
    }

    return (
        <div className='flex flex-col h-screen '>
            <div className='flex justify-between p-4 '>
                <h1 className='text-2xl font-semibold'>{"เอกสารใบกำกับภาษี"}</h1>
                <Link to={"/create-invoice"} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">+  เพิ่มใบกำกับภาษี</Link>
            </div>

            <div className="md:block overflow-auto p-4">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="p-2 text-center"></th>
                            <th className="p-4 text-center">หมายเลขเอกสาร</th>
                            <th className="p-4 text-center">วันที่ออกเอกสาร</th>
                            <th className="p-4 text-center">วันที่ครบกำหนด</th>
                            <th className="p-4 text-center">ชื่อลูกค้า</th>
                            <th className="p-4 text-center">Grand Total</th>
                            <th className="p-4 text-center">แก้ไข</th>
                            <th className="p-4 text-center">ลบ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allInvoices?.map((invoice,index) => (
                            <tr
                                key={invoice.id}
                                className="hover:bg-gray-50">
                                <td className="p-2 text-center">{index + 1}</td>
                                <td className="p-4 text-center">{invoice.documentNumber}</td>
                                <td className="p-4 text-center">{dayjs(invoice.issueDate).format('DD/MM/YYYY')}</td>
                                <td className="p-4 text-center">{dayjs(invoice.dueDate).format('DD/MM/YYYY')}</td>
                                <td className="p-4 text-center">{invoice.customerName}</td>
                                <td className="p-4 text-center">{invoice.grandTotalPrice}</td>
                                <td className="p-4 text-center">
                                    <div className="flex justify-center">
                                        <button
                                            onClick={()=>handleEdit(invoice.id)}
                                            className="text-yellow-500 hover:opacity-80"
                                        >
                                            <Pencil className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => {handleDelete(invoice)}}
                                            className="text-red-500 hover:opacity-80"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default ShowInvoice