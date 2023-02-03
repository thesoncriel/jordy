/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode, Suspense, lazy as ReactLazy } from 'react';
import { Navigate, Outlet, RouteObject, useRoutes } from 'react-router-dom';
import {
  ModuleRouteChildModel,
  ModuleRouteDefaultLazyOption,
  ModuleRouteModel,
} from './useRouteSystem.model';

function Redirect(path = '/') {
  return <Navigate to={path} />;
}

interface ToJSXElementModel {
  Wrapper?: React.ComponentType<any>;
  Element?: React.ComponentType<any>;
  redirect?: string;
  lazy?: boolean;
  fallback?: ReactNode;
}

function toJSXElement({
  Wrapper,
  Element,
  redirect,
  lazy,
  fallback,
}: ToJSXElementModel) {
  if (redirect) {
    return Redirect(redirect);
  }

  if (!Wrapper && !Element) {
    return;
  }

  if (Wrapper) {
    return (
      <Wrapper>
        <Outlet />
      </Wrapper>
    );
  }

  if (Element) {
    const LazyComponent =
      lazy &&
      ReactLazy(async () => {
        return {
          default: await Element,
        };
      });

    return (
      <>
        {LazyComponent ? (
          <Suspense fallback={fallback}>
            <LazyComponent />
          </Suspense>
        ) : (
          <Element />
        )}
      </>
    );
  }
}

function recursionChildren({
  path,
  element,
  fallback,
  lazy,
  redirect,
  children = [],
}: ModuleRouteChildModel): RouteObject {
  if ((element && children.length > 0) || lazy) {
    return {
      path,
      children: [
        {
          index: true,
          element: toJSXElement({ Element: element, lazy, fallback, redirect }),
        },
        ...children.map(recursionChildren),
      ],
    };
  }

  return {
    path,
    element: toJSXElement({ Element: element, lazy, fallback, redirect }),
    children: children.map(recursionChildren),
  };
}

/**
 * react-router-dom V6의 route system을 적용하는 hooks
 *
 * 내부적으로 useRoutes()를 사용한다.
 *
 * @example
 * ```tsx
 * const routes = [
 *  {
 *    path: "/",
 *    wrap: Wrapper,
 *    element: Element,
 *    children: [{
 *      path: "main", // '/main'
 *      element: Element,
 *      children: [{
 *        path: ":id", // '/main/:id'
 *        element: Element
 *      }]
 *    }]
 *  }
 * ]
 * ```
 *
 * renderRouteSystem을 사용하기 위해선 `BrowserRouter`로 감싸주어야 한다.
 * ```ts
 * <BrowserRouter>{renderRouteSystem(routes)}</BrowserRouter>
 * ```
 *
 * @param moduleRoutes
 * @returns
 */
export const useRouteSystem = (
  moduleRoutes: ModuleRouteModel[],
  lazyOption?: ModuleRouteDefaultLazyOption
) => {
  const routeObject: RouteObject[] = moduleRoutes.map(
    ({ path, wrap, element, redirect, lazy, fallback, children = [] }) => {
      const componentLazy = lazy || lazyOption?.lazy;
      const componentFallback = fallback || lazyOption?.fallback;

      if (redirect) {
        return Object.assign(
          { path },
          children.length > 0
            ? {
                children: [
                  { index: true, element: Redirect(redirect) },
                  ...children.map(recursionChildren),
                ],
              }
            : { element: Redirect(redirect) }
        );
      }

      if ((wrap && element) || componentLazy) {
        return {
          path,
          element: toJSXElement({ Wrapper: wrap }),
          children: [
            {
              index: true,
              element: toJSXElement({
                Element: element,
                lazy: componentLazy,
                fallback: componentFallback,
              }),
            },
            ...children.map(recursionChildren),
          ],
        };
      }

      return {
        path,
        element: toJSXElement({
          Element: element,
        }),
        children: children?.map(recursionChildren),
      };
    }
  );

  return useRoutes(routeObject);
};
