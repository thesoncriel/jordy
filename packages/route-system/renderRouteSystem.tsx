/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Outlet, RouteObject, useRoutes } from 'react-router-dom';
import { ModuleRouteChildModel, ModuleRouteModel } from './moduleRoute.model';

function toJSXElement(
  Wrapper?: React.ComponentType<any>,
  Element?: React.ComponentType<any>
) {
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
    return <Element />;
  }
}

function recursionChildren({
  path,
  element,
  children = [],
}: ModuleRouteChildModel): RouteObject {
  if (element && children.length > 0) {
    return {
      path,
      children: [
        { index: true, element: toJSXElement(undefined, element) },
        ...children.map(recursionChildren),
      ],
    };
  }

  return {
    path,
    element: toJSXElement(undefined, element),
    children: children.map(recursionChildren),
  };
}

/**
 * react-router-dom V6의 route system을 적용한다.
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
export const RenderRouteSystem = (moduleRoutes: ModuleRouteModel[]) => {
  const routeObject: RouteObject[] = moduleRoutes.map(
    ({ path, wrap, element, children = [] }) => {
      if (wrap && element) {
        return {
          path,
          element: toJSXElement(wrap),
          children: [
            { index: true, element: toJSXElement(undefined, element) },
            ...children.map(recursionChildren),
          ],
        };
      }

      return {
        path,
        element: toJSXElement(wrap, element),
        children: children?.map(recursionChildren),
      };
    }
  );

  return useRoutes(routeObject);
};
