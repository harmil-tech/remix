import { redirect, type LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = async () => redirect('/weather');

export default function Index() {
  return null;
}
