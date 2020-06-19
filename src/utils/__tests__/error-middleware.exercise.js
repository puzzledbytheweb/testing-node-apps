// Testing Middleware

// 💣 remove this todo test (it's only here so you don't get an error about missing tests)

// 🐨 you'll need both of these:
import {UnauthorizedError} from 'express-jwt'
import errorMiddleware from '../error-middleware'

const req = {}
const next = jest.fn(() => next)
const code = 'some_error_code'
const message = 'Some message'

const error = new UnauthorizedError(code, {
  message,
})

const getRes = (overrides) => {
  const res = {
    json: jest.fn(() => res),
    status: jest.fn(() => res),
    ...overrides,
  }

  return res
}

describe('errorMiddleware handles all cases', () => {
  // 🐨 Write a test for the UnauthorizedError case
  test('handles UnauthorizedError case, responding with a 401', () => {
    const res = getRes()
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
    const res = getRes({headersSent: true})
    errorMiddleware(error, req, res, next)

    expect(next).toHaveBeenCalledWith(error)
    expect(next).toHaveBeenCalledTimes(1)
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })

  // 🐨 Write a test for the else case (responds with a 500)
  test('handles fallback case', () => {
    const res = getRes()
    const newError = new TypeError('Oh no type error')
    errorMiddleware(newError, req, res, next)

    expect(res.status).toBeCalledWith(500)
  })
})
