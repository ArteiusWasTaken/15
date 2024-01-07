export interface FinalData {
  name: string;
  mail: string;
  phone: string;
  state: string;
}

export interface Participante {
  name: string;
  email: string;
  phone: string;
  state: string;
  crear: number;
}

export interface Tarjeta {
  nombre: string;
  numero: string;
  tipo: string;
  banco: string;
}

export interface CorreoParticipante {
  name: string;
  pw: string;
  code: string;
  email: string;
  tickets: any[];
}
