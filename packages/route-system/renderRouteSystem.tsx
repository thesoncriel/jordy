/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ComponentType, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { AsyncGuard } from './AsyncGuard';
import { ModuleRouteModel } from './moduleRoute.model';

type GuardFunctionType = () => boolean | Promise<boolean>;

function toPromiseList(guardList: GuardFunctionType[]) {
  return guardList.map((fn) => {
    const ret = fn();

    if (ret instanceof Promise) {
      return ret;
    }
    return Promise.resolve(ret);
  });
}

function renderSubRoute(
  route: ModuleRouteModel,
  notFound?: ComponentType<any>,
  guardList: GuardFunctionType[] = []
) {
  const Comp = route.component;
  const Wrap = route.wrap || React.Fragment;

  if (route.guard) {
    guardList.push(route.guard);

    if (route.child) {
      return (
        <Wrap>
          {renderRouteSystem(route.child, true, notFound, [...guardList])}
        </Wrap>
      );
    }

    const guardResults = () =>
      Promise.all(toPromiseList(guardList)).then((items) =>
        items.every(Boolean)
      );

    return (
      <Wrap>
        <Suspense fallback={<></>}>
          <AsyncGuard
            guard={guardResults}
            redirect={route.redirect}
            failComponent={route.failComponent}
          >
            {Comp && <Comp />}
          </AsyncGuard>
        </Suspense>
      </Wrap>
    );
  }

  if (route.redirect) {
    return <Redirect to={route.redirect} />;
  }
  if (route.child) {
    return (
      <Wrap>
        {renderRouteSystem(route.child, true, notFound, [...guardList])}
      </Wrap>
    );
  }

  if (guardList.length > 0) {
    const guardResults = () =>
      Promise.all(toPromiseList(guardList)).then((items) =>
        items.every(Boolean)
      );

    return (
      <Wrap>
        <Suspense fallback={<></>}>
          <AsyncGuard
            guard={guardResults}
            redirect={route.redirect}
            failComponent={route.failComponent}
          >
            {Comp && <Comp />}
          </AsyncGuard>
        </Suspense>
      </Wrap>
    );
  }

  return (
    <Wrap>
      <Suspense fallback={<></>}>{Comp && <Comp />}</Suspense>
    </Wrap>
  );
}

export const renderRouteSystem = (
  routes: ModuleRouteModel[],
  withSwitch?: boolean,
  notFound?: ComponentType<any>,
  guardList: GuardFunctionType[] = []
): JSX.Element | JSX.Element[] => {
  const NotFound = notFound;

  if (withSwitch) {
    return (
      <Switch>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} exact={route.exact}>
            {renderSubRoute(route, notFound, [...guardList])}
          </Route>
        ))}
        {NotFound && <NotFound />}
      </Switch>
    );
  }

  const renders = routes.map((route) => (
    <Route key={route.path} path={route.path} exact={route.exact}>
      {renderSubRoute(route, notFound, [...guardList])}
    </Route>
  ));

  if (NotFound) {
    renders.push(<NotFound key="%%not-found%%" />);
  }

  return renders;
};
