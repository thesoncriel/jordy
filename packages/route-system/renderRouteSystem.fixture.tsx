import React from 'react';
import { useParams } from 'react-router-dom';

import { ModuleRouteModel } from './moduleRoute.model';
import { RenderRouteSystem } from './renderRouteSystem';

interface WrapperProps {
  title: string;
  children: React.ReactNode;
}
const createTestWrapper = (text: string) =>
  function Wrap({ children }: WrapperProps) {
    return (
      <section>
        <h1 data-testid={text}>{text}</h1>
        {children}
      </section>
    );
  };

const createTestComp = (text: string) => {
  return function Test() {
    return <div data-testid={text}>{text}</div>;
  };
};

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
    path: '*',
    element: createTestComp('fallback'),
  },
];

export default function App() {
  return RenderRouteSystem(routes);
}
