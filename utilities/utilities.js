import { ClientFunction, userVariables, t } from 'testcafe';

export const getLocation = ClientFunction(() => document.location.href)

export function randomString(length=10, chars='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
  var result = ''
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

export async function scrollDownUntilExists(targetElement) {
  const isTargetVisible = async () => (await targetElement.exists);

  const scrollDown = ClientFunction(() => {
      window.scrollBy(0, 1000); // Increase the scroll amount for bigger leaps
  });

  while (!(await isTargetVisible())) {
      await scrollDown();
      await t.wait(300); // Adjust the waiting time if needed
  }
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
