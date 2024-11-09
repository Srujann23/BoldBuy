import { useRef, useEffect } from 'react';

const ImageModal = ({ isOpen, images, onClose }) => {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div ref={modalRef} className="bg-white p-4 rounded-md max-w-3xl max-h-[80vh] overflow-auto">
                <div className="flex justify-end">
                    <button onClick={onClose} className="text-red-500 font-bold text-xl">X</button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <div key={index} className="flex justify-center items-center">
                            <img src={image} alt={`Product Image ${index + 1}`} className="w-full h-auto object-contain" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImageModal;
