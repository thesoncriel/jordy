import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter, NavigateOptions, To } from 'react-router-dom';
import '@testing-library/jest-dom';

import { ModuleRouteModel, useRouteSystem } from '../../route-system';
import { SearchParamsOptions, useNavigate } from '../useNavigate';

function Home() {
  const navigate = useNavigate();

  const handleMoveCurried =
    (params: string | To, option?: NavigateOptions) => () => {
      navigate(params, option);
    };

  const handleQueryCurried =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (query: Record<string, any>, option?: SearchParamsOptions) => () => {
      navigate(query, option);
    };

  return (
    <div>
      <h1>Home</h1>
      <button onClick={handleMoveCurried('/route')}>goRoute</button>

      <button
        onClick={handleMoveCurried({ pathname: '/route', search: '?page=1' })}
      >
        goRoute2
      </button>

      <button onClick={handleQueryCurried({ page: 1, size: 10 })}>
        pagination
      </button>
      <button onClick={handleQueryCurried({ color: 'red' })}>color</button>
      <button
        onClick={handleQueryCurried({
          color: undefined,
          light: null,
          width: '',
          height: 0,
          success: false,
        })}
      >
        validCheck
      </button>
      <button onClick={handleQueryCurried({ sort: 'newst' }, { merge: false })}>
        sort
      </button>
    </div>
  );
}

function RouteTestComp() {
  return <div />;
}

function QueryTestComp() {
  return <div />;
}

function App() {
  const routes: ModuleRouteModel[] = [
    {
      path: '/',
      element: Home,
      children: [
        {
          path: 'route',
          element: RouteTestComp,
        },
        {
          path: 'query',
          element: QueryTestComp,
        },
      ],
    },
    {
      path: '/fallback',
      element: () => <div>I am fallback</div>,
    },
  ];

  return useRouteSystem(routes);
}

describe('useNavigate', () => {
  beforeEach(() => {
    render(<App />, { wrapper: BrowserRouter });
    window.history.pushState({}, '', 'http://localhost:3000/');
  });

  describe('<App />의 렌더링', () => {
    it('<App />이 올바르게 렌더링된다.', () => {
      expect(screen.getByText('Home')).toBeInTheDocument();
    });
  });

  describe('react-router-dom의 useNavigate() 형식을 사용할 수 있다. 사용 및 동작 방식은 동일하다.', () => {
    it('string으로 page를 이동시킨다.', () => {
      const button = screen.getByText('goRoute');

      fireEvent.click(button);

      const pathname = window.location.pathname;
      expect(pathname).toBe('/route');
    });

    it('navigate의 To 타입 인자를 넘겨 page를 이동시킨다.', () => {
      const button = screen.getByText('goRoute2');

      fireEvent.click(button);

      const pathname = window.location.pathname;
      const search = window.location.search;
      expect(pathname + search).toBe('/route?page=1');
    });
  });

  describe('react-router-dom의 useSearchParams()를 이용해 query를 이동시킨다.', () => {
    it('임의의 객체를 넘기면 현재 페이지의 query를 변경한다.', () => {
      const button = screen.getByText('pagination');

      fireEvent.click(button);

      const search = window.location.search;
      expect(search).toBe('?page=1&size=10');
    });

    it('현재 페이지에 query가 이미 존재한다면 덮어씌워 변경한다.', () => {
      const button = screen.getByText('color');

      fireEvent.click(button);

      const search = window.location.search;
      expect(search).toBe('?page=1&size=10&color=red');
    });

    it('만약 덮어씌우고 싶지 않다면, 두번째 인자의 merge 속성을 false로 설정하면 된다.', () => {
      const button = screen.getByText('sort');

      fireEvent.click(button);

      const search = window.location.search;
      expect(search).toBe('?sort=newst');
    });

    it('보내려는 query 중 빈 값, undefined, null이 있다면 해당 쿼리는 제외하여 변경한다.', () => {
      const button = screen.getByText('validCheck');

      fireEvent.click(button);

      const search = window.location.search;
      expect(search).not.toBe(
        '?sort=newst&color=undefined&light=null&width&height=0&success=false'
      );
      expect(search).toBe('?sort=newst&height=0&success=false');
    });
  });
});
