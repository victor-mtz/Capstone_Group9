export async function getUserToken() {
  return new Promise((resolve, reject) => {
    const activeToken = window.sessionStorage.token;
    if (activeToken) {
      resolve(activeToken);
    } else {
      reject('invalid login');
    }
  });
}
