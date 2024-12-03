import React, { useState } from "react";

const InvoiceForm = () => {
  const [items, setItems] = useState([
    { code: "", quantity: 1, weight: 0, price: 0, discount: 0, unit: "", total: 0 },
  ]);
  const [summary, setSummary] = useState({
    netPrice: 0,
    totalDiscount: 0,
    priceAfterDiscount: 0,
    vat: 0,
    grandTotal: 0,
  });

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = field === "discount" ? parseFloat(value) : value;

    // คำนวณราคาสุทธิ
    const priceBeforeDiscount = updatedItems[index].quantity * updatedItems[index].price;
    const discountAmount = (priceBeforeDiscount * updatedItems[index].discount) / 100;
    updatedItems[index].total = priceBeforeDiscount - discountAmount;

    setItems(updatedItems);
    calculateSummary(updatedItems);
  };

  const calculateSummary = (updatedItems) => {
    const netPrice = updatedItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
    const totalDiscount = updatedItems.reduce(
      (acc, item) => acc + (item.quantity * item.price * item.discount) / 100,
      0
    );
    const priceAfterDiscount = netPrice - totalDiscount;
    const vat = priceAfterDiscount * 0.07; // คิด VAT 7%
    const grandTotal = priceAfterDiscount + vat;

    setSummary({ netPrice, totalDiscount, priceAfterDiscount, vat, grandTotal });
  };

  const addRow = () => {
    setItems([...items, { code: "", quantity: 1, weight: 0, price: 0, discount: 0, unit: "", total: 0 }]);
  };

  const removeRow = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    calculateSummary(updatedItems);
  };

  return (

    <div className="p-6 bg-gray-100">
      <div className="grid grid-cols-4 gap-4 mb-6">
        <input type="text" placeholder="หมายเลขเอกสาร" className="border p-2" />
        <input type="date" placeholder="วันที่ออกเอกสาร" className="border p-2" />
        <input type="date" placeholder="วันครบกำหนด" className="border p-2" />
        <input type="text" placeholder="ชื่อลูกค้า" className="border p-2" />
        <input type="text" placeholder="ที่อยู่ออกใบกำกับ" className="border p-2" />
        <input type="text" placeholder="ที่อยู่จัดส่ง" className="border p-2" />
        <input type="text" placeholder="หมายเลขเอกสารอ้างอิง" className="border p-2" />
        <input type="text" placeholder="Currency" className="border p-2" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* ตารางสินค้า */}
        <div className="col-span-2">
          <h3 className="text-lg font-semibold mb-4">รายการสินค้า</h3>
          <table className="w-full border border-gray-300 text-sm">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">#</th>
                <th className="border border-gray-300 p-2">รหัสสินค้า</th>
                <th className="border border-gray-300 p-2">จำนวน</th>
                <th className="border border-gray-300 p-2">น้ำหนัก</th>
                <th className="border border-gray-300 p-2">ราคา/หน่วย</th>
                <th className="border border-gray-300 p-2">หน่วย</th>
                <th className="border border-gray-300 p-2">ส่วนลด (%)</th>
                <th className="border border-gray-300 p-2">ราคาสุทธิ</th>
                <th className="border border-gray-300 p-2">ลบ</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">{index + 1}</td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="text"
                      className="w-full border p-1"
                      onChange={(e) => handleItemChange(index, "code", e.target.value)}
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      className="w-full border p-1"
                      onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      className="w-full border p-1"
                      onChange={(e) => handleItemChange(index, "weight", e.target.value)}
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      className="w-full border p-1"
                      onChange={(e) => handleItemChange(index, "price", e.target.value)}
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <select
                      className="w-full border p-1"
                      onChange={(e) => handleItemChange(index, "unit", e.target.value)}
                    >
                      <option value="">Select unit</option>
                      <option value="ชิ้น">ชิ้น</option>
                      <option value="กรัม">กรัม</option>
                    </select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      className="w-full border p-1"
                      onChange={(e) => handleItemChange(index, "discount", e.target.value)}
                    />
                  </td>
                  <td className="border border-gray-300 p-2">{item.total.toFixed(2)}</td>
                  <td className="border border-gray-300 p-2">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => removeRow(index)}
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded"
            onClick={addRow}
          >
            เพิ่มสินค้า
          </button>
        </div>

        {/* ส่วนสรุป */}
        <div className="p-4 border border-gray-300 bg-white rounded">
          <h3 className="text-lg font-semibold mb-4">สรุป</h3>
          <div className="space-y-2">
            <div>ราคาสุทธิ: {summary.netPrice.toFixed(2)} THB</div>
            <div>ส่วนลดท้ายบิล: {summary.totalDiscount.toFixed(2)} THB</div>
            <div>ราคาหลังหักส่วนลด: {summary.priceAfterDiscount.toFixed(2)} THB</div>
            <div>VAT: {summary.vat.toFixed(2)} THB</div>
            <strong>Grand Total: {summary.grandTotal.toFixed(2)} THB</strong>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <textarea placeholder="หมายเหตุ" className="border p-2 w-full h-20"></textarea>
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <button className="bg-gray-500 text-white px-6 py-2 rounded">Cancel</button>
        <button className="bg-green-500 text-white px-6 py-2 rounded">Save</button>
      </div>
    </div>
  );
};

export default InvoiceForm;
