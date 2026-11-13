"use client";

interface InputProps {
  type: any;
  value: any;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  textarea?: boolean;
  id: string;
  placeholder?: string;
  big?: boolean;
}

export default function Input({
  type,
  value,
  onChange,
  name,
  textarea,
  id,
  placeholder,
  big,
}: InputProps) {
  return (
    <input
      id={id}
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={onChange}
      name={name}
      className={`form-control py-2 mt-3 mb-3 form-control:hover p-2 bg-violet-500  form-control:focus  ${
        textarea ? "w-700px h-500px" : "w-full"
      } ${big ? "w-[400px] pb-[6rem]" : ""}`}
    />
  );
}
