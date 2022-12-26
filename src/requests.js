async function checkAuthRequest() {
  const res = await fetch(process.env.API_URL_1, {
    method: 'GET',
  });

  return res;
}

//TODO: login with google account
async function loginWithGoogleAccount() {
  // coming soon
}

async function logout() {
  await fetch(process.env.API_URL_2, {
    method: 'GET',
  })
}

export { checkAuthRequest, loginWithGoogleAccount, logout };
