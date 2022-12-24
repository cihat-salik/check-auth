async function checkAuthRequest() {
  const res = await fetch(process.env.API_URL, {
    method: 'GET',
  });

  return res;
}

//TODO: login with google account
async function loginWithGoogleAccount() {
  // coming soon
}

export { checkAuthRequest, loginWithGoogleAccount };
