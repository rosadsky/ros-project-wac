import { HospitalSpace, HospitalSpaceCreate, HospitalSpaceUpdate } from './hospital-space.model';

export class HospitalSpaceService {
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

  async getAllSpaces(): Promise<HospitalSpace[]> {
    return this.makeRequest<HospitalSpace[]>('/spaces');
  }

  async createSpace(space: HospitalSpaceCreate): Promise<HospitalSpace> {
    return this.makeRequest<HospitalSpace>('/spaces', {
      method: 'POST',
      body: JSON.stringify(space),
    });
  }

  async updateSpaceAssignment(spaceId: string, update: HospitalSpaceUpdate): Promise<HospitalSpace> {
    return this.makeRequest<HospitalSpace>(`/spaces/${spaceId}`, {
      method: 'PUT',
      body: JSON.stringify(update),
    });
  }

  async deleteSpace(spaceId: string): Promise<void> {
    return this.makeRequest<void>(`/spaces/${spaceId}`, {
      method: 'DELETE',
    });
  }

  async checkHealth(): Promise<{ status: string; service: string }> {
    return this.makeRequest<{ status: string; service: string }>('/health');
  }
} 