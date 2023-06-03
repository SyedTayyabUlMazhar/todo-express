export type SuccessResponse<D> = {
  message?: string;
  data: D;
  ok: true;
};

export type ErrorResponse = {
  message: string;
  ok: false;
};
