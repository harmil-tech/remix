import { render, screen, fireEvent, waitFor } from '@testing-library/react';

jest.mock('@remix-run/react', () => {
  const actual = jest.requireActual('@remix-run/react');
  return {
    ...actual,
    useActionData: jest.fn(),
    useNavigation: jest.fn(),
    Form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
  };
});
import { useActionData, useNavigation } from '@remix-run/react';

// Mock the server action module to avoid importing server runtime
jest.mock('~/actions/weather.server', () => ({ action: jest.fn() }));

// Mock lazy-loaded components used inside the route
jest.mock('../components/WeatherResult', () => ({
  __esModule: true,
  default: ({ locationName, temp, humidity }: any) => (
    <div data-testid="weather-result">
      {locationName} - {temp} - {humidity}
    </div>
  ),
}));

jest.mock('../components/ErrorAlert', () => ({
  __esModule: true,
  default: ({ message }: any) => <div role="alert">{message}</div>,
}));

import Weather from '~/routes/weather';

describe('Weather route component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // default: no action data, idle navigation
    (useActionData as jest.Mock).mockReturnValue(undefined as any);
    (useNavigation as jest.Mock).mockReturnValue({ state: 'idle' } as any);
  });

  it('shows FE validation error when submitting empty city', async () => {
    const { container } = render(<Weather />);

    const form = container.querySelector('form') as any;
    const input = screen.getByLabelText(/city/i) as HTMLInputElement;
    // attach named input to form so handler can read form.city.value
    form.city = input;

    const submit = screen.getByRole('button', { name: /get weather/i });
    fireEvent.click(submit);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('City name is required!');
  });

  it('shows FE min-length error when city < 3 chars', async () => {
    const { container } = render(<Weather />);

    const form = container.querySelector('form') as any;
    const input = screen.getByLabelText(/city/i) as HTMLInputElement;
    form.city = input;
    fireEvent.change(input, { target: { value: 'ab' } });

    const submit = screen.getByRole('button', { name: /get weather/i });
    fireEvent.click(submit);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(
      'City name must be at least 3 characters long!'
    );
  });

  it('shows server-side field error from actionData', () => {
    (useActionData as jest.Mock).mockReturnValue({
      fieldErrors: { city: 'Server says: invalid city' },
    });

    render(<Weather />);

    expect(screen.getByRole('alert')).toHaveTextContent('Server says: invalid city');
  });

  it('renders server generic error via ErrorAlert', async () => {
    (useActionData as jest.Mock).mockReturnValue({ error: 'Rate limited' });

    render(<Weather />);

    // lazy component inside Suspense; wait for it
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Rate limited');
  });

  it('renders WeatherResult when data returned', async () => {
    (useActionData as jest.Mock).mockReturnValue({
      data: {
        location: { name: 'London' },
        timelines: {
          hourly: [
            {
              values: { temperature: 22.4, humidity: 55 },
            },
          ],
        },
      },
    });

    render(<Weather />);

    await waitFor(() => {
      expect(screen.getByTestId('weather-result')).toBeInTheDocument();
    });

    expect(screen.getByTestId('weather-result')).toHaveTextContent('London');
    expect(screen.getByTestId('weather-result')).toHaveTextContent('22');
    expect(screen.getByTestId('weather-result')).toHaveTextContent('55');
  });
});
