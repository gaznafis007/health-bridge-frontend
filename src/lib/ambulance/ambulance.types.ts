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
