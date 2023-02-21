/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode, Suspense } from 'react';
import { Navigate, Outlet, RouteObject, useRoutes } from 'react-router-dom';
import {
  ModuleRouteChildModel,
  ModuleRouteDefaultOption,
  ModuleRouteModel,
} from './useRouteSystem.model';

function Redirect(path = '/') {
  return <Navigate to={path} />;
}

interface ToJSXElementModel {
  Wrapper?: React.ComponentType<any>;
  Element?: React.ComponentType<any>;
  redirect?: string;
  fallback?: ReactNode;
}

function toJSXElement({
  Wrapper,
  Element,
  redirect,
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
    return (
      <>
        {fallback ? (
          <Suspense fallback={fallback}>
            <Element />
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
  redirect,
  children = [],
}: ModuleRouteChildModel): RouteObject {
  if ((element && children.length > 0) || fallback) {
    return {
      path,
      children: [
        {
          index: true,
          element: toJSXElement({ Element: element, fallback, redirect }),
        },
        ...children.map(recursionChildren),
      ],
    };
  }

  return {
    path,
    element: toJSXElement({ Element: element, fallback, redirect }),
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
  defaultOption?: ModuleRouteDefaultOption
) => {
  const routeObject: RouteObject[] = moduleRoutes.map(
    ({ path, wrap, element, redirect, fallback, children = [] }) => {
      const componentFallback = fallback || defaultOption?.fallback;

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

      if ((wrap && element) || componentFallback) {
        return {
          path,
          element: toJSXElement({ Wrapper: wrap }),
          children: [
            {
              index: true,
              element: toJSXElement({
                Element: element,
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
