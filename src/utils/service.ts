export const getFreshAccessToken = () => {
  const token = localStorage.getItem("access_token");
  return token;
};
