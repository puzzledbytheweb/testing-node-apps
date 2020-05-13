// Testing Pure Functions

// 💣 remove this todo test (it's only here so you don't get an error about missing tests)

// 🐨 import the function that we're testing
import {isPasswordAllowed} from '../auth'

test('Returns true when password is valid', () => {
  const validPasswords = ['!aBc123']

  validPasswords.forEach((password) =>
    expect(isPasswordAllowed(password)).toBe(true),
  )
})

test('Returns false when password is invalid', () => {
  const invalidPasswords = [
    'a2c!',
    '123456!',
    'ABCdef!',
    'abc123!',
    'ABC123!',
    'ABCdef123',
  ]

  invalidPasswords.forEach((password) =>
    expect(isPasswordAllowed(password)).toBe(false),
  )
})
