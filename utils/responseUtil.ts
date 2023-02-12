import { ErrorResponse, SuccessResponse } from "./types";

const successResponse = <D extends Record<string, any> = Record<string, any>>(
  data: D,
  message?: string
): SuccessResponse<D> => {
  const response = { message, data, ok: true as const };

  return response;
};

const errorResponse = (message: string): ErrorResponse => {
  const response = { message, ok: false as const };

  return response;
};

const ApiResponse = {
  success: successResponse,
  failure: errorResponse,
};

export default ApiResponse;
