export interface Ticket {
  id: number;
  number: string;
  rifa_id: number;
  participante_id: number;
  status: number;
  clave: string;
  price: string;
  created_at: string;
  updated_at: string;
}

export interface LoterryTicket {
  number: string;
  selected: boolean;
  blocked: boolean;
  purchased: boolean;
}
