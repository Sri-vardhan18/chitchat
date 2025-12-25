import React from 'react';


function RedirectModal({ text, onClose, open,setIsOpenSignup  }) {
  

  if (!open) return null;

  const handleOk = () => {
    
    onClose?.();
    setIsOpenSignup(true);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white p-6 rounded-lg shadow-lg z-50 w-96">
        <p className="mb-4">{text}</p>

        <div className="flex justify-end gap-4">
    
          <button
            onClick={handleOk}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default RedirectModal;
