import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const getError = (error:any) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};