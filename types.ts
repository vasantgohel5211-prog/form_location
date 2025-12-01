export interface LocationData {
  latitude: number;
  longitude: number;
}

export interface Employee {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  department: string;
  address: string;
  location?: LocationData;
}

export type EmployeeFormData = Omit<Employee, 'id'>;