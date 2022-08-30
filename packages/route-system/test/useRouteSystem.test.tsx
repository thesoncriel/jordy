import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

import App from '../useRouteSystem.fixture';

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

  it('wrap과 element가 동시에 설정되어 있으면 설정된 element가 wrap에 감싸져 렌더링 된다.', () => {
    renderWithRouter('/main');

    expect(screen.getByText('mainWrapper')).toBeInTheDocument();
    expect(screen.getByText('main')).toBeInTheDocument();
  });

  it('wrap가 적용된 main order 페이지가 렌더링 된다.', () => {
    renderWithRouter('/main/order');

    expect(screen.getByText('mainWrapper')).toBeInTheDocument();
    expect(screen.getByText('mainOrder')).toBeInTheDocument();
  });

  it('wrap가 적용된 main order news 페이지가 렌더링 된다.', () => {
    renderWithRouter('/main/order/news');

    expect(screen.getByText('mainWrapper')).toBeInTheDocument();
    expect(screen.getByText('mainOrderNews')).toBeInTheDocument();
  });

  it('wrap가 적용된 :id에 따른 main order news 페이지가 렌더링 된다.', () => {
    renderWithRouter('/main/order/news/123');

    expect(screen.getByText('mainWrapper')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('만약 wrap가 지정되지 않으면 wrap는 렌더링 되지 않는다.', () => {
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

  it('특정 path에 element가 지정되지 않았어도, children에 path="" 속성이 있다면 element로 적용된다.', () => {
    renderWithRouter('/hello');

    expect(screen.getByText('hello world')).toBeInTheDocument();
  });
});
