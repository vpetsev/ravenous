import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import App from './App';
import Yelp from '../../util/Yelp';
jest.mock('../../util/Yelp', () => ({ search: jest.fn() }));
test('failed search displays an error while keeping the business list mounted', async () => {
  Yelp.search.mockRejectedValue(new Error('provider unavailable'));
  const { getByText, findByRole, container } = render(<App />);
  fireEvent.click(getByText("Let's Go"));
  expect(await findByRole('alert')).toBeTruthy();
  expect(container.querySelector('.BusinessList')).toBeTruthy();
});
