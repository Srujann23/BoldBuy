const ConfirmationModal = ({ onClose, onConfirm }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-md shadow-md w-1/3">
            <p className="text-lg font-semibold mb-4">Are you sure you want to delete this product?</p>
            <div className="flex justify-end gap-4">
                {/* No button - close the modal */}
                <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md">No</button>
                {/* Yes button - confirm deletion */}
                <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded-md">Yes</button>
            </div>
        </div>
    </div>
);

export default ConfirmationModal