import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

import App from '../renderRouteSystem.fixture';

function renderWithRouter(link: string) {
  return render(
    <MemoryRouter initialEntries={[link]}>
      <App />
    </MemoryRouter>
  );
}

describe('renderRouteSystem', () => {
  beforeAll(() => {
    render(<App />, { wrapper: BrowserRouter });
  });

  afterAll(() => {
    render(<App />, { wrapper: BrowserRouter }).unmount();
  });

  it('<App />이 렌더링된다.', () => {
    expect(screen.getByText('index')).toBeInTheDocument();
    expect(screen.getByText('indexWrapper')).toBeInTheDocument();
  });

  it('main(/main) 페이지가 렌더링 된다.', () => {
    renderWithRouter('/main');

    expect(screen.getByText('mainWrapper')).toBeInTheDocument();
    expect(screen.getByText('main')).toBeInTheDocument();
  });

  it('main order(/main/order) 페이지가 렌더링 된다.', () => {
    renderWithRouter('/main/order');

    expect(screen.getByText('mainOrder')).toBeInTheDocument();
  });

  it('main order news(/main/order/news) 페이지가 렌더링 된다.', () => {
    renderWithRouter('/main/order/news');

    expect(screen.getByText('mainOrderNews')).toBeInTheDocument();
  });

  it(':id(/main/order/news/:id)에 따라 페이지가 렌더링 된다.', () => {
    renderWithRouter('/main/order/news/123');

    expect(screen.getByText('123')).toBeInTheDocument();

    renderWithRouter('/main/order/news/456');

    expect(screen.getByText('456')).toBeInTheDocument();
  });

  it('main order(/main/order) 페이지가 렌더링 된다.', () => {
    renderWithRouter('/main/order');

    expect(screen.getByText('mainOrder')).toBeInTheDocument();
  });

  it('wrap가 지정되지 않으면 감싸는 Wrapper는 렌더링 되지 않는다.', () => {
    renderWithRouter('/product');

    expect(screen.queryByText('productWrapper')).not.toBeInTheDocument();
  });

  it('특정 path가 아니라면 fallback 페이지로 이동한다.', () => {
    renderWithRouter('/fallback');

    expect(screen.getByText('fallback')).toBeInTheDocument();
  });

  it('특정 main path가 아니라면 main fallback 페이지로 이동한다.', () => {
    renderWithRouter('/main/anything');

    expect(screen.getByText('mainFallback')).toBeInTheDocument();
  });
});
