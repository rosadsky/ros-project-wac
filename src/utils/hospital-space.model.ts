export interface HospitalSpace {
  id: string;
  space_id: string;
  name: string;
  type: 'operating_room' | 'emergency_room' | 'ward' | 'icu' | 'consultation_room';
  floor: number;
  capacity: number;
  status: 'available' | 'occupied' | 'maintenance';
  assigned_to?: string | null;
  assigned_type?: 'ambulance' | 'department' | null;
  assigned_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface HospitalSpaceCreate {
  name: string;
  type: 'operating_room' | 'emergency_room' | 'ward' | 'icu' | 'consultation_room';
  floor: number;
  capacity: number;
}

export interface HospitalSpaceUpdate {
  assigned_to?: string | null;
  assigned_type?: 'ambulance' | 'department' | null;
  assigned_id?: string | null;
} 