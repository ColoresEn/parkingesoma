import React, { useCallback } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { TbPhotoPlus } from 'react-icons/tb';

// Declaración global para Cloudinary (opcional si es necesario)
declare global {
  var cloudinary: any;
}

interface ImageUploadProps {
  onChange: (value: string) => void;
  value: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, value }) => {
console.log('value', value)
  // Maneja la carga exitosa de la imagen
  const handleUpload = useCallback(
    (result: any) => {
      console.log('result.info.secure_url',result.info.secure_url)
      onChange(result.info.secure_url);
    },
    [onChange]
  );

  return (
    <CldUploadWidget
      uploadPreset='ajukal8h'
      options={{ maxFiles: 1 }}
     
      onSuccess={handleUpload} // Uso de onSuccess también por compatibilidad con la biblioteca actual
    >
      {({ open }) => {
        return (
          <div
            onClick={() => open?.()}
            className="relative cursor-pointer hover:opacity-70 border-dashed border-2 flex flex-col justify-center items-center h-[300px] max-w-sm"
          >
            <TbPhotoPlus />
            <div className="text-lg">Pulse para subir la imagen</div>

            {value && (
              <div className="absolute inset-0 w-full h-full">
                <Image alt="upload" sizes="100%" fill style={{ objectFit: 'cover' }} src={value} />
              </div>
            )}
          </div>
        );
      }}
    </CldUploadWidget>
  );
};

export default ImageUpload;
