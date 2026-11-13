// ImageModal.tsx

import React, { useRef } from "react";
import { motion } from "framer-motion";
import Image from 'next/image';
import { on } from "stream";
interface ModalImgProps {
  imageUrl: string;
  onClose: () => void;
}

const ModalImg: React.FC<ModalImgProps> = ({ imageUrl, onClose }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  const closeModal = () => {
    onClose();
  };



  // Agregar un event listener para cerrar el modal al hacer clic fuera de él
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <motion.div
    className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-90 z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
      <div ref={modalRef} className="relative bg-white max-w-screen-lg border border-zinc-200 ">
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 p-2 text-white bg-gray-500 rounded-full hover:bg-gray-600"
        >
          X
        </button>
        <Image src={imageUrl} width={300} height={300}  alt="Imagen en pantalla completa" className="w-full h-auto"/>
      </div>
      </motion.div>
  );
};

export default ModalImg;
