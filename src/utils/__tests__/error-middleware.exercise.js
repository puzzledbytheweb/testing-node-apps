import {UnauthorizedError} from 'express-jwt'
import {buildRes, buildReq, buildNext} from 'utils/generate'
import errorMiddleware from '../error-middleware'

describe('errorMiddleware handles all cases', () => {
  // 🐨 Write a test for the UnauthorizedError case
  test('handles UnauthorizedError case, responding with a 401', () => {
    const code = 'some_error_code'
    const message = 'Some message'
    const error = new UnauthorizedError(code, {
      message,
    })

    const res = buildRes()
    const req = buildReq()
    const next = buildNext()

    errorMiddleware(error, req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith({
      code: error.code,
      message: error.message,
    })
    expect(res.json).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.status).toHaveBeenCalledTimes(1)
  })

  // 🐨 Write a test for the headersSent case
  test('handles headersSent error case, calling next', () => {
    const res = buildRes({headersSent: true})
    const req = buildReq()
    const next = buildNext()
    const error = new Error('Great Error!')

    errorMiddleware(error, req, res, next)

    expect(next).toHaveBeenCalledWith(error)
    expect(next).toHaveBeenCalledTimes(1)
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })

  // 🐨 Write a test for the else case (responds with a 500)
  test('handles fallback case, returning a 500', () => {
    const res = buildRes()
    const req = buildReq()
    const next = buildNext()

    const newError = new Error('Oh no!!')

    errorMiddleware(newError, req, res, next)

    expect(next).not.toHaveBeenCalled()

    expect(res.json).toHaveBeenCalledWith({
      message: newError.message,
      stack: newError.stack,
    })
    expect(res.json).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.status).toHaveBeenCalledTimes(1)
  })
})
