type SuccessResponse = {
  message?: string;
  data: Record<string, any>;
  ok: true;
};

type ErrorResponse = {
  message: string;
  ok: false;
};

type ApiResponse = SuccessResponse | ErrorResponse;

const successResponse = (
  data: Record<string, any>,
  message?: string
): SuccessResponse => {
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
