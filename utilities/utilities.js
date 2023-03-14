import { ClientFunction, userVariables } from 'testcafe';

export const getLocation = ClientFunction(() => document.location.href)

export function randomString(length=10, chars='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
  var result = ''
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

export function baseUrl() {
  return process.env.SITE_URL || userVariables.baseURL
}

export function username() {
  return process.env.USERNAME || userVariables.username
}

export function password() {
  return process.env.PASSWORD || userVariables.password
}

export function isAscending() {
  var isAscending = a => a.slice(1).every((e,i) => e > a[i])
  return isAscending
}

export function isDescending() {
  var isDescending= a => a.slice(1).every((e,i) => e < a[i])
  return isDescending
}
