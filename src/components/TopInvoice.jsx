const TopInvoice = ({invoiceTitle,invoiceDetail,setInvoiceDetail}) => {
  
    return (
        <div className="col-span-2 grid grid-cols-4 gap-4">
          {invoiceTitle.map((label, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700">{label.placeholder}</label>
              <input
                type={label.name === "issueDate" || label.name === "dueDate" ?'date' : "text"}
                name={label.name}
                value={invoiceDetail[label.name]}
                placeholder={label.placeholder}
                required
                onChange={(e) => setInvoiceDetail({ ...invoiceDetail, [e.target.name]: e.target.value })}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          ))}
        </div>
    )
}
export default TopInvoice