import React, { lazy } from 'react';
import { useParams } from 'react-router-dom';

import { ModuleRouteModel } from './useRouteSystem.model';
import { useRouteSystem } from './useRouteSystem';

interface WrapperProps {
  children: React.ReactNode;
}
const createTestWrapper = (text: string) =>
  function Wrap({ children }: WrapperProps) {
    return (
      <section>
        <h1>{text}</h1>
        {children}
      </section>
    );
  };

const createTestComp = (text: string) => {
  return function Test() {
    return <div>{text}</div>;
  };
};

const createLazyComp = (text: string) =>
  lazy(async () => {
    return {
      default: await createTestComp(text),
    };
  });

const createTestPathComp = () => {
  return function Test() {
    const params = useParams();
    return <div>{params.id}</div>;
  };
};

export const routes: ModuleRouteModel[] = [
  {
    path: '/',
    wrap: createTestWrapper('indexWrapper'),
    element: createTestComp('index'),
  },
  {
    path: '/main',
    wrap: createTestWrapper('mainWrapper'),
    element: createTestComp('main'),
    children: [
      {
        path: 'order',
        element: createTestComp('mainOrder'),
        children: [
          {
            path: 'news',
            element: createTestComp('mainOrderNews'),
            children: [
              {
                path: ':id',
                element: createTestPathComp(),
              },
            ],
          },
          { path: ':id', element: createTestPathComp() },
        ],
      },
      {
        path: '*',
        element: createTestComp('mainFallback'),
      },
    ],
  },
  {
    path: '/hello',
    children: [
      {
        path: '',
        element: createTestComp('hello world'),
      },
    ],
  },
  {
    path: '/redirect',
    wrap: createTestWrapper('redirect wrap'),
    element: createTestComp('redirect'),
    redirect: '/hello',
  },
  {
    path: '/lazy',
    element: createLazyComp('lazy'),
    fallback: 'loading',
    children: [
      {
        path: 'child',
        element: createLazyComp('lazy child'),
        fallback: 'child loading',
      },
    ],
  },
  {
    path: '*',
    element: createTestComp('fallback'),
  },
];

export function App() {
  return useRouteSystem(routes);
}

export function AllLazyApp() {
  return useRouteSystem(
    [
      {
        path: '/lazy',
        element: createLazyComp('lazy'),
        children: [
          {
            path: 'child',
            element: createLazyComp('lazy child'),
          },
        ],
      },
    ],
    { fallback: 'lazy loading...' }
  );
}
