export interface FinalData {
  name: string;
  last_name: string;
  mail: string;
  phone: string;
  direccion: string;
  pago: string;
}

export interface BankData {
  account?: string;
  spei?: string;
  card?: string;
  owner: string;
  name: string;
}

export interface BankDataCollection {
  bancomer?: BankData;
  santander?: BankData;
  banorte?: BankData;
}

export interface Participante {
  name: string;
  email: string;
  phone: string;
  address: string;
  crear: number;
}
