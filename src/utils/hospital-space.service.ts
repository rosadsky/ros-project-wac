import { HospitalSpace, HospitalSpaceCreate, HospitalSpaceUpdate } from './hospital-space.model';

const mockSpaces: HospitalSpace[] = [
  {
    id: '1',
    name: 'Emergency Room',
    floor: 1,
    roomNumber: '101',
    type: 'AMBULANCE',
    status: 'OCCUPIED',
    capacity: 10,
    assignedTo: {
      id: '1',
      name: 'Emergency Department',
      type: 'DEPARTMENT'
    }
  },
  {
    id: '2',
    name: 'Cardiology Clinic',
    floor: 2,
    roomNumber: '201',
    type: 'AMBULANCE',
    status: 'AVAILABLE',
    capacity: 5
  },
  {
    id: '3',
    name: 'Pediatric Ward',
    floor: 3,
    roomNumber: '301',
    type: 'DEPARTMENT',
    status: 'OCCUPIED',
    capacity: 20,
    assignedTo: {
      id: '2',
      name: 'Pediatrics Department',
      type: 'DEPARTMENT'
    }
  }
];

export class HospitalSpaceService {
  private spaces: HospitalSpace[] = [...mockSpaces];

  async getAllSpaces(): Promise<HospitalSpace[]> {
    return Promise.resolve(this.spaces);
  }

  async getSpaceById(id: string): Promise<HospitalSpace | undefined> {
    return Promise.resolve(this.spaces.find(space => space.id === id));
  }

  async createSpace(space: HospitalSpaceCreate): Promise<HospitalSpace> {
    const newSpace: HospitalSpace = {
      id: Math.random().toString(36).substr(2, 9),
      ...space,
      status: 'AVAILABLE'
    };
    this.spaces.push(newSpace);
    return Promise.resolve(newSpace);
  }

  async updateSpace(update: HospitalSpaceUpdate): Promise<HospitalSpace | undefined> {
    const index = this.spaces.findIndex(space => space.id === update.id);
    if (index === -1) return Promise.resolve(undefined);

    this.spaces[index] = { ...this.spaces[index], ...update };
    return Promise.resolve(this.spaces[index]);
  }

  async deleteSpace(id: string): Promise<boolean> {
    const index = this.spaces.findIndex(space => space.id === id);
    if (index === -1) return Promise.resolve(false);

    this.spaces.splice(index, 1);
    return Promise.resolve(true);
  }
} 