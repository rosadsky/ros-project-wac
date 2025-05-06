export interface HospitalSpace {
  id: string;
  name: string;
  floor: number;
  roomNumber: string;
  type: 'AMBULANCE' | 'DEPARTMENT';
  assignedTo?: {
    id: string;
    name: string;
    type: 'AMBULANCE' | 'DEPARTMENT';
  };
  status: 'AVAILABLE' | 'OCCUPIED';
  capacity: number;
  description?: string;
}

export interface HospitalSpaceCreate {
  name: string;
  floor: number;
  roomNumber: string;
  type: 'AMBULANCE' | 'DEPARTMENT';
  capacity: number;
  description?: string;
}

export interface HospitalSpaceUpdate {
  id: string;
  name?: string;
  floor?: number;
  roomNumber?: string;
  type?: 'AMBULANCE' | 'DEPARTMENT';
  assignedTo?: {
    id: string;
    name: string;
    type: 'AMBULANCE' | 'DEPARTMENT';
  };
  status?: 'AVAILABLE' | 'OCCUPIED';
  capacity?: number;
  description?: string;
} 