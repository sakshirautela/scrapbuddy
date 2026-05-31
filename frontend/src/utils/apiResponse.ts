// @ts-nocheck
export const unwrapResponse = async (request) => {
  const response = await request();
  return response.data;
};
