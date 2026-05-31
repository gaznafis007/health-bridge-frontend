export type AmbulanceBookingStatus =
  | "REQUESTED"
  | "ACCEPTED"
  | "ARRIVED"
  | "IN_TRANSIT"
  | "COMPLETED"
  | "CANCELLED";

export type AmbulanceVehicleType = "BASIC" | "ADVANCED" | "ICU";

export interface AmbulanceHealthCenter {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  type: "HOSPITAL" | "CLINIC" | "DIAGNOSTIC_CENTER";
}

export interface CreateAmbulanceBookingPayload {
  pickupAddress: string;
  destinationAddress: string;
  pickupLatitude: number;
  pickupLongitude: number;
  destinationLatitude?: number;
  destinationLongitude?: number;
  vehicleTypeRequired: AmbulanceVehicleType;
  emergencyType: string;
  patientCondition: string;
  specialRequirements?: string;
  originCenterId?: string;
  destinationCenterId?: string;
}

export interface AmbulanceBooking {
  id: string;
  patientId: string;
  status: AmbulanceBookingStatus;
  pickupAddress: string;
  destinationAddress: string;
  pickupLatitude: number;
  pickupLongitude: number;
  destinationLatitude?: number;
  destinationLongitude?: number;
  vehicleTypeRequired: AmbulanceVehicleType;
  emergencyType: string;
  patientCondition: string;
  specialRequirements: string | null;
  estimatedFare: string;
  createdAt: string;
  updatedAt: string;
}

export interface AmbulanceLiveLocation {
  ambulanceId: string;
  bookingId: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  recordedAt: string;
  source: "cache" | "db";
}

export interface AmbulanceBookingsPaginated {
  items: AmbulanceBooking[];
  total: number;
  skip: number;
  take: number;
}

export interface AmbulanceBookingFormValues {
  pickupAddress: string;
  destinationAddress: string;
  vehicleTypeRequired: AmbulanceVehicleType;
  emergencyType: string;
  patientCondition: string;
  specialRequirements: string;
  originCenterId: string;
  destinationCenterId: string;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface LocationTrailPoint {
  latitude: number;
  longitude: number;
  recordedAt: string;
}

export interface LocationTrail {
  bookingId: string;
  points: LocationTrailPoint[];
}

export type AmbulanceFleetStatus =
  | "AVAILABLE"
  | "ON_DUTY"
  | "MAINTENANCE"
  | "INACTIVE";

export type DriverStatus = "PENDING" | "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface AmbulanceFleetVehicle {
  id: string;
  healthCenterId: string;
  vehicleNumber: string;
  vehicleType: AmbulanceVehicleType;
  status: AmbulanceFleetStatus;
  createdAt: string;
}

export interface AmbulanceDriver {
  id: string;
  userId: string;
  licenseNumber: string;
  status: DriverStatus;
  isVerified: boolean;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface AmbulanceShift {
  id: string;
  driverId: string;
  ambulanceId: string;
  healthCenterId: string;
  startedAt: string;
  endedAt: string | null;
}

export interface CreateHealthCenterPayload {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  type: AmbulanceHealthCenter["type"];
}

export interface CreateFleetPayload {
  healthCenterId: string;
  vehicleNumber: string;
  vehicleType: AmbulanceVehicleType;
}

export interface CreateDriverPayload {
  userId: string;
  licenseNumber: string;
}

export interface CreateShiftPayload {
  driverId: string;
  ambulanceId: string;
  healthCenterId: string;
}

export interface DispatchBookingPayload {
  ambulanceId: string;
  driverId: string;
  notes?: string;
  priority?: number;
}

export interface PushLocationPayload {
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
  recordedAt?: string;
}
