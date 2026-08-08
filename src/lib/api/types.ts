export interface ApiError {
  message: string;
  code?: string;
  errors?: { path: string; message: string }[];
  status?: number;
}
