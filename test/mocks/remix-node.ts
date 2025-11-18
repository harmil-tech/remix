export const redirect = (url: string) =>
  new Response(null, {
    status: 302,
    headers: { Location: url },
  });
