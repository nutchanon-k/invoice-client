import React from 'react';

const ItemsTable = ({ itemsTitle, items, setItems, invoiceDetail, setInvoiceDetail }) => {
  const createEmptyItem = () => ({
    code: "",
    quantity: "",
    weight: "",
    pricePerUnit: "",
    unit: "",
    priceBeforeDiscount: "",
    discount: 0,
    totalPrice: ""
  });
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };

    // คำนวณ priceBeforeDiscount
    let priceBeforeDiscount = 0;
    if (updatedItems[index].unit === 'EACH') {
      priceBeforeDiscount = updatedItems[index].quantity * updatedItems[index].pricePerUnit;
    } else if (updatedItems[index].unit === 'GRAM') {
      priceBeforeDiscount = updatedItems[index].weight * updatedItems[index].pricePerUnit;
    }
    updatedItems[index].priceBeforeDiscount = priceBeforeDiscount;

    // คำนวณ totalPrice หลังส่วนลด
    const discount = parseFloat(updatedItems[index].discount) || 0;
    const totalPrice = priceBeforeDiscount - (priceBeforeDiscount * (discount / 100));
    updatedItems[index].totalPrice = totalPrice;

    setItems(updatedItems);
    // ถ้าแก้ไขแถวสุดท้าย และมีการกรอกข้อมูลใดๆ ให้เพิ่มแถวใหม่
    if (index === items.length - 1) {
      const hasValue = Object.values(updatedItems[index]).some(value => value !== "" && value !== 0);
      if (hasValue) {
        setItems([...updatedItems, createEmptyItem()]);
      }
    }
  }

  //   console.log(items)
  // คำนวณยอดรวมทั้งหมด
  const totals = items.reduce((acc, item) => {
    acc.quantity += parseFloat(item.quantity) || 0;
    acc.weight += parseFloat(item.weight) || 0;
    acc.priceBeforeDiscount += parseFloat(item.priceBeforeDiscount) || 0;
    acc.net += parseFloat(item.totalPrice) || 0;
    return acc;
  }, { quantity: 0, weight: 0, priceBeforeDiscount: 0, net: 0 });

  return (
<div className="col-span-2 bg-white p-4 border border-gray-300">
  <h1 className="text-xl font-bold mb-4">รายการสินค้า</h1>
  <div className="overflow-y-auto max-h-96">
    <table className="w-full border-collapse border border-gray-300">
      <thead className="bg-gray-100 sticky top-0 z-10">
        <tr>
          {itemsTitle.map((header, index) => (
            <th key={index} className="p-2 border border-gray-300 text-center">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={index}>
            <td className="p-2 border border-gray-300">{index + 1}</td>
            <td className="p-2 border border-gray-300">
              <input
                type="text"
                name="code"
                value={item.code}
                onChange={(e) => handleItemChange(index, "code", e.target.value)}
                className="w-full p-1 border border-gray-300 rounded"
              />
            </td>
            <td className="p-2 border border-gray-300">
              <input
                type="number"
                name="quantity"
                value={item.quantity || ''}
                onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value) || 0)}
                className="w-full p-1 border border-gray-300 rounded"
              />
            </td>
            <td className="p-2 border border-gray-300">
              <input
                type="number"
                name="weight"
                value={item.weight || ''}
                onChange={(e) => handleItemChange(index, "weight", parseFloat(e.target.value) || 0)}
                className="w-full p-1 border border-gray-300 rounded"
              />
            </td>
            <td className="p-2 border border-gray-300">
              <input
                type="number"
                name="pricePerUnit"
                value={item.pricePerUnit || ''}
                onChange={(e) => handleItemChange(index, "pricePerUnit", parseFloat(e.target.value) || 0)}
                className="w-full p-1 border border-gray-300 rounded"
              />
            </td>
            <td className="p-2 border border-gray-300">
              <select
                name="unit"
                value={item.unit || ''}
                onChange={(e) => handleItemChange(index, "unit", e.target.value)}
                className="w-lg p-1 border border-gray-300 rounded"
              >
                <option disabled value="">เลือกหน่วย</option>
                <option value="EACH">ชิ้น</option>
                <option value="GRAM">กรัม</option>
              </select>
            </td>
            <td className="p-2 border border-gray-300">
              <input
                type="number"
                name="priceBeforeDiscount"
                value={item.priceBeforeDiscount || ''}
                className="w-full p-1 border border-gray-300 rounded"
                disabled
              />
            </td>
            <td className="p-2 border border-gray-300">
              <input
                type="number"
                name="discount"
                value={item.discount || ''}
                onChange={(e) => handleItemChange(index, "discount", parseFloat(e.target.value) || 0)}
                className="w-full p-1 border border-gray-300 rounded"
                placeholder="%"
              />
            </td>
            <td className="p-2 border border-gray-300">
              <input
                type="number"
                name="totalPrice"
                value={item.totalPrice || ''}
                className="w-full p-1 border border-gray-300 rounded"
                disabled
              />
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot className="bg-gray-100 sticky bottom-0 z-10">
        <tr>
          <td colSpan="2" className="p-2 border border-gray-300"></td>
          <td className="p-2 border border-gray-300">{totals.quantity}</td>
          <td className="p-2 border border-gray-300">{totals.weight}</td>
          <td className="p-2 border border-gray-300"></td>
          <td className="p-2 border border-gray-300"></td>
          <td className="p-2 border border-gray-300">{totals.priceBeforeDiscount.toFixed(2)}</td>
          <td className="p-2 border border-gray-300"></td>
          <td className="p-2 border border-gray-300">{totals.net.toFixed(2)}</td>
        </tr>
      </tfoot>
    </table>
  </div>
  <textarea
    rows="4"
    placeholder="Remarks"
    value={invoiceDetail.remarks}
    onChange={(e) => setInvoiceDetail({ ...invoiceDetail, remarks: e.target.value })}
    className="w-full mt-4 p-2 border border-gray-300 rounded-md"
  ></textarea>
</div>

  )
}

export default ItemsTable;
