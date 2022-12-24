async function checkAuthRequest() {
  const res = await fetch('https://support.jotform.com/jfadmin/', {
    method: 'GET',
  });

  console.log('res', res);

  return res;
}

// login with google accound and get cookies
async function loginWithGoogleAccount() {
  // coming soon
}

export { checkAuthRequest, loginWithGoogleAccount };
