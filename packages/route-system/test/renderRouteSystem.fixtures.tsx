import React from 'react';
import { ModuleRouteModel } from '../src/moduleRoute.model';

function createTestComp(text: string) {
  const TestComp: React.FC = ({ children }) => (
    <div className={text}>
      {text}
      <article>{children}</article>
    </div>
  );

  TestComp.displayName = `SamplePage${text.toUpperCase()}`;

  return TestComp;
}

export interface TestRouteModel extends ModuleRouteModel {
  linkTo?: string;
}

const normal: TestRouteModel[] = [
  {
    path: '/thorn',
    component: createTestComp('thorn'),
  },
  {
    path: '/haha',
    component: createTestComp('haha'),
  },
  {
    path: '/gotoOther',
    redirect: '/haha',
  },
  {
    path: '/wrapped',
    component: createTestComp('wrapped'),
  },
  {
    path: '/sonic/:id',
    linkTo: '/sonic/1234',
    component: createTestComp('sonicId'),
  },
  {
    path: '/sonic',
    exact: true,
    component: createTestComp('sonic'),
  },
  {
    path: '/multi',
    child: [
      {
        path: '/multi/flex',
        component: createTestComp('multi_flex'),
      },
    ],
  },
];

const guardSystem: TestRouteModel[] = [
  {
    path: '/theson',
    component: createTestComp('theson'),
  },
  {
    path: '/hidden',
    component: createTestComp('hidden'),
  },
  {
    path: '/forRedirect',
    component: createTestComp('forRedirect'),
  },
  {
    path: '/forFail',
    component: createTestComp('forFail'),
    failComponent: createTestComp('thisIsFail'),
  },
];

const childRender: TestRouteModel[] = [
  {
    path: '/theson',
    child: [
      {
        path: '/theson/genius',
        component: createTestComp('theson_genius'),
      },
      {
        path: '/theson/fullstack',
        component: createTestComp('theson_fullstack'),
      },
    ],
  },
  {
    path: '/root',
    child: [
      {
        path: '/root/depth1',
        child: [
          {
            path: '/root/depth1/depth2',
            child: [
              {
                path: '/root/depth1/depth2/depth3',
                component: createTestComp('fourDepth'),
              },
            ],
          },
          {
            path: '/root/depth1/otherSide',
            component: createTestComp('otherSide'),
          },
        ],
      },
    ],
  },
  {
    path: '/wrap',
    wrap: createTestComp('my-wrap'),
    child: [
      {
        path: '/wrap/first',
        component: createTestComp('wrap-first'),
      },
      {
        path: '/wrap/second',
        component: createTestComp('wrap-second'),
      },
      {
        path: '/wrap/third',
        component: createTestComp('wrap-third'),
      },
    ],
  },
];

function createComplexChild(): TestRouteModel {
  return {
    path: '/cpxWrap',
    wrap: createTestComp('cpxWrap'),
    child: [
      {
        path: '/cpxWrap/call',
        component: createTestComp('call'),
      },
      {
        path: '/cpxWrap/inner',
        wrap: createTestComp('innerWrap'),
        child: [
          {
            path: '/cpxWrap/inner/banner',
            wrap: createTestComp('banner'),
            child: [
              {
                path: '/cpxWrap/inner/banner/yes',
                component: createTestComp('yes'),
              },
              {
                path: '/cpxWrap/inner/banner/no',
                component: createTestComp('no'),
              },
              {
                path: '/cpxWrap/inner/banner/neutral',
                component: createTestComp('neutral'),
                wrap: createTestComp('neutralWrap'),
              },
            ],
          },
          {
            path: 'cpxWrap/outer/aside',
            component: createTestComp('aside'),
          },
        ],
      },
    ],
  };
}

childRender.push(createComplexChild());

export const asyncRouteFixtures = {
  normal,
  guardSystem,
  childRender,
  createTestComp,
  createComplexChild,
};
