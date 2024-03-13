import { header, validationResult } from 'express-validator'

export interface IResponse {
  success: boolean
  data: any | null | { error: string }
}

/**
 * Send Error Response
 *
 * @param {*} res
 * @param {*} status
 * @param {*} message
 */
export const sendErrorResponse = (res, status, error) => {
  if (error instanceof Error) {
    error = error.message
  }

  res.status(status).send({
    success: false,
    data: { error: error },
  } as IResponse)
}

/**
 * Send Success Response
 *
 * @param {*} res
 * @param {*} data
 */
export const sendSuccessResponse = (res, data) => {
  res.status(200).send({
    success: true,
    data: data,
  } as IResponse)
}

/**
 * Check Validation
 *
 * @param {*} req
 * @param {*} res
 * @return {*}
 */
export const checkValidation = req => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return false
  }
  return true
}

export const tokenValidator = [
  header('token', 'Invalid "token" does not Empty').not().isEmpty(),
]
