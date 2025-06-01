export interface Ambulance {
  id: string;
  ambulance_id: string;
  name: string;
  type: 'emergency' | 'icu' | 'basic' | 'transport';
  location: string;
  status: 'available' | 'on_duty' | 'maintenance' | 'out_of_service';
  created_at: string;
  updated_at: string;
}

export interface AmbulanceCreate {
  name: string;
  type: 'emergency' | 'icu' | 'basic' | 'transport';
  location: string;
}

export interface AmbulanceUpdate {
  name?: string;
  type?: 'emergency' | 'icu' | 'basic' | 'transport';
  location?: string;
  status?: 'available' | 'on_duty' | 'maintenance' | 'out_of_service';
} 