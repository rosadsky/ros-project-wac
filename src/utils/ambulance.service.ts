import { Ambulance, AmbulanceCreate, AmbulanceUpdate } from './ambulance.model';

export class AmbulanceService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:8080/api') {
    this.baseUrl = baseUrl;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  async getAllAmbulances(): Promise<Ambulance[]> {
    return this.makeRequest<Ambulance[]>('/ambulances');
  }

  async createAmbulance(ambulance: AmbulanceCreate): Promise<Ambulance> {
    return this.makeRequest<Ambulance>('/ambulances', {
      method: 'POST',
      body: JSON.stringify(ambulance),
    });
  }

  async updateAmbulance(ambulanceId: string, update: AmbulanceUpdate): Promise<Ambulance> {
    return this.makeRequest<Ambulance>(`/ambulances/${ambulanceId}`, {
      method: 'PUT',
      body: JSON.stringify(update),
    });
  }

  async deleteAmbulance(ambulanceId: string): Promise<void> {
    return this.makeRequest<void>(`/ambulances/${ambulanceId}`, {
      method: 'DELETE',
    });
  }
} 