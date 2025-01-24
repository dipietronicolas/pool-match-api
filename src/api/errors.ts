const badRequestError = (details?: string) => ({
  status: 400,
  message: 'Bad Request',
  ...(details && { details }),
})

const notFoundError = (details?: string) => ({
  status: 404,
  message: 'Not Found',
  ...(details && { details }),
})

const conflictError = (details?: string) => ({
  status: 409,
  message: 'Conflict',
  ...(details && { details }),
})

const serverError = (details?: string) => ({
  status: 500,
  message: 'Internal Server Error',
  ...(details && { details }),
})

export const httpErrors = {
  serverError,
  notFoundError,
  conflictError,
  badRequestError,
}
