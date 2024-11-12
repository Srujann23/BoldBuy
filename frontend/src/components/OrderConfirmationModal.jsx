import React from 'react';

const OrderConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Confirm Your Order</h2>
        <p>Are you sure you want to place this order?</p>
        <div className="flex justify-end gap-4 mt-6">
          <button
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
            onClick={onCancel}
          >
            No, Go Back
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={onConfirm}
          >
            Yes, Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationModal;