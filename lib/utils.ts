import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
}

const formatRupiah = (val: string | number) => {
  if (val === undefined || val === null || val === '') return '';
  const num = typeof val === 'string' ? val.replace(/\D/g, '') : val;
  return 'Rp ' + Number(num).toLocaleString('id-ID');
};

const parseNumber = (val: string) => {
  return val.replace(/\D/g, '');
};

export {cn, formatRupiah, parseNumber}
