

const Summary = ({summary, setSummary}) => {
    return (
        <div className="bg-white p-4 border border-gray-300">
            <h1 className="text-xl font-bold mb-4">สรุป</h1>
            <div className="space-y-2">
                {[
                    { label: "ราคาสุทธิ", value: summary.netPrice.toFixed(2) },
                    { label: "ส่วนลดท้ายบิล", value: summary.totalDiscount.toFixed(2) },
                    { label: "ราคาหลังหักส่วนลด", value: summary.priceAfterDiscount.toFixed(2) },
                    { label: "Vat", value: summary.vat.toFixed(2) }
                ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                        <span>{item.label}</span>
                        <input
                            type="text"
                            value={item.value}
                            disabled
                            className="w-32 p-1 border border-gray-300 rounded text-right"
                        />
                    </div>
                ))}
                <div className="flex justify-between items-center text-xl font-bold border border-black p-6 bg-gray-50">
                    <span>Grand Total</span>
                    <span>{summary.grandTotalPrice.toFixed(2)} THB</span>
                </div>
            </div>
            <textarea
                rows="4"
                placeholder="Note"
                value={summary.notes}
                onChange={(e) => setSummary({ ...summary, notes: e.target.value })}
                className="w-full mt-4 p-2 border border-gray-300 rounded-md"
            ></textarea>
        </div>
    )
}
export default Summary