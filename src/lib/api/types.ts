export interface ApiError {
  message: string;
  errors?: { path: string; message: string }[];
  status?: number;
}
