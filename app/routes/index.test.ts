import { loader } from '~/routes/index';

describe('routes/index loader', () => {
  it('redirects to /weather', async () => {
    const request = new Request('http://localhost/');
    const result = await loader({ request, params: {}, context: {} } as any);

    expect(result).toBeInstanceOf(Response);
    const res = result as Response;
    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe('/weather');
  });
});
