import { timeout } from '@common/util';
import { mount } from 'enzyme';
import { createMemoryHistory } from 'history';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Route, Router, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import {
  asyncRouteFixtures as fixtures,
  TestRouteModel,
} from './renderRouteSystem.fixtures';
import { renderRouteSystem } from '../src/renderRouteSystem';

describe('renderRouteSystem', () => {
  const CLICK_ARG = { button: 0 };
  let history = createMemoryHistory();

  interface Props {
    routes: TestRouteModel[];
    depth?: string;
  }

  const NavComp: React.FC<Props> = ({ routes, depth = '' }) => (
    <ul>
      {routes.map((route, index) => {
        const id = depth + index;
        return (
          <li key={route.path}>
            <Link id={`link${id}`} to={route.linkTo || route.path}>
              {route.path}
            </Link>
            {route.child && <NavComp routes={route.child} depth={`${id}_`} />}
          </li>
        );
      })}
    </ul>
  );

  const NotFound: React.FC = () => (
    <section className="not-found">not found</section>
  );

  const TestComp: React.FC<Props> = ({ routes }) => (
    <Router history={history}>
      <nav>
        <NavComp routes={routes} />
      </nav>
      <Switch>
        <Route exact path="/">
          <div id="root">root</div>
        </Route>
      </Switch>
      {renderRouteSystem(routes, true)}
    </Router>
  );

  const TogetherTestComp: React.FC<Props> = ({ routes }) => (
    <Router history={history}>
      <nav>
        <NavComp routes={routes} />
      </nav>
      <Switch>
        <Route exact path="/">
          <div id="root">root</div>
        </Route>
        <Route path="/comp">
          <div className="comp">comp</div>
        </Route>
        {renderRouteSystem(routes)}
        <Route component={NotFound} />
      </Switch>
    </Router>
  );

  function testCaseByCustomComponent(TestComp: React.FC<Props>) {
    it('기반이 되는 라우터가 정상 동작된다.', () => {
      const target = mount(<TestComp routes={[fixtures.normal[0]]} />);
      const elemRoot = target.find('#root');
      const elem = target.find('.thorn');

      expect(elemRoot).toHaveLength(1);
      expect(elemRoot.text()).toBe('root');
      expect(elem).toHaveLength(0);
    });

    it('제공된 path 와 component 로 렌더링이 가능하다.', () => {
      const target = mount(<TestComp routes={[fixtures.normal[0]]} />);
      const elemLink = target.find('nav a#link0');

      elemLink.simulate('click', CLICK_ARG);

      const elem0 = target.find('.thorn');
      const elem1 = target.find('.theson');

      const elemRoot = target.find('#root');

      expect(history.location.pathname).toBe('/thorn');
      expect(elem0).toHaveLength(1);
      expect(elem1).toHaveLength(0);
      expect(elemRoot).toHaveLength(0);
    });
    it('redirect 가 있다면 제공된 path 로 왔을 때 지정된 redirect 경로로 이동된다.', () => {
      const target = mount(<TestComp routes={fixtures.normal} />);
      const elemLink = target.find('nav a#link2');

      elemLink.simulate('click', CLICK_ARG);

      const elem0 = target.find('.thorn');
      const elem1 = target.find('.haha');

      expect(history.location.pathname).toBe('/haha');
      expect(elem0).toHaveLength(0);
      expect(elem1).toHaveLength(1);
    });
    it('wrap 이 제공되면 component 렌더링 시 외부에 감싸서 함께 출력된다.', () => {
      const localFixtures = [...fixtures.normal];
      const WrapComp: React.FC = jest.fn(({ children }) => (
        <section className="wrap-section">{children}</section>
      ));

      localFixtures[3] = {
        ...localFixtures[3],
        wrap: WrapComp,
      };

      const target = mount(<TestComp routes={localFixtures} />);
      const elemLink = target.find('nav a#link3');

      elemLink.simulate('click', CLICK_ARG);

      const elem0 = target.find('.wrapped');
      const elem1 = target.find('.wrap-section');

      expect(history.location.pathname).toBe('/wrapped');
      expect(WrapComp).toBeCalled();
      expect(elem0).toHaveLength(1);
      expect(elem1).toHaveLength(1);
    });
    it('exact 가 제공되면 정확히 일치하는 경로일 때만 component 를 렌더링 한다.', () => {
      const target = mount(<TestComp routes={fixtures.normal} />);
      const elemLink = target.find('nav a#link5');

      elemLink.simulate('click', CLICK_ARG);

      let elem0 = target.find('.sonicId');
      let elem1 = target.find('.sonic');

      expect(history.location.pathname).toBe('/sonic');
      expect(elem0).toHaveLength(0);
      expect(elem1).toHaveLength(1);

      const elemLink1 = target.find('nav a#link4');

      elemLink1.simulate('click', CLICK_ARG);

      elem0 = target.find('.sonicId');
      elem1 = target.find('.sonic');

      expect(history.location.pathname).toBe('/sonic/1234');
      expect(elem0).toHaveLength(1);
      expect(elem1).toHaveLength(0);
    });
  }

  describe('normal spec', () => {
    beforeEach(() => {
      history = createMemoryHistory();
    });

    describe('일반적인 렌더링', () => {
      testCaseByCustomComponent(TestComp);
    });

    describe('수행 환경 주변에 다른 라우트가 있을 때', () => {
      testCaseByCustomComponent(TogetherTestComp);
    });
  });

  describe('not found config', () => {
    beforeEach(() => {
      history = createMemoryHistory();
    });

    it('설정된 정상적인 경로로 접근 시 설정된 notFound 컴포넌트가 렌더링되지 않는다.', () => {
      const localFixtures = [...fixtures.normal];

      // localFixtures.push({
      //   path: '',
      //   component: NotFound
      // });

      const target = mount(<TogetherTestComp routes={localFixtures} />);

      history.push('/thorn');
      target.update();

      const elem0 = target.find('.not-found');
      const elem1 = target.find('.thorn');

      expect(history.location.pathname).toBe('/thorn');
      expect(elem0).toHaveLength(0);
      expect(elem1).toHaveLength(1);
    });

    it('매칭 되지 않는 경로라면 Not Found 를 렌더링 한다.', () => {
      const localFixtures = [...fixtures.normal];
      const target = mount(<TogetherTestComp routes={localFixtures} />);

      expect(history.location.pathname).toBe('/');
      expect(target.find('#root')).toHaveLength(1);
      expect(target.find('.not-found')).toHaveLength(0);

      history.push('/eggman');
      target.update();

      expect(history.location.pathname).toBe('/eggman');
      expect(target.find('#root')).toHaveLength(0);
      expect(target.find('.not-found')).toHaveLength(1);
    });
  });

  describe('guard system', () => {
    describe('synchronous results', () => {
      beforeEach(() => {
        history = createMemoryHistory();
      });
      it('guard 조건이 주어지면 그 값이 true 일 때 렌더링 된다.', async () => {
        const localFixtures = [...fixtures.guardSystem];
        const fnGuard = jest.fn().mockReturnValue(true);

        localFixtures[0] = {
          ...localFixtures[0],
          guard: fnGuard,
        };

        const target = mount(<TestComp routes={localFixtures} />);
        const elemLink = target.find('nav a#link0');

        await act(async () => {
          elemLink.simulate('click', CLICK_ARG);

          await timeout(0);

          target.update();
        });

        expect(history.location.pathname).toBe('/theson');
        expect(target.find('.theson')).toHaveLength(1);
        expect(fnGuard).toHaveBeenCalled();
      });
      it('guard 가 false 라면 제공된 redirect 를 통해 페이지를 넘긴다.', async () => {
        const localFixtures = [...fixtures.guardSystem];
        const fnGuard = jest.fn(() => false);

        localFixtures[0] = {
          ...localFixtures[0],
          guard: fnGuard,
          redirect: '/hidden',
        };

        const target = mount(<TestComp routes={localFixtures} />);
        const elemLink = target.find('nav a#link0');

        await act(async () => {
          elemLink.simulate('click', CLICK_ARG);

          await timeout(0);

          target.update();
        });

        expect(fnGuard).toHaveBeenCalled();
        expect(history.location.pathname).toBe('/hidden');
        expect(target.find('.theson')).toHaveLength(0);
        expect(target.find('.hidden')).toHaveLength(1);
      });
      it('guard 가 false 일 때 failComponent 가 설정 되어 있다면 그것을 출력한다.', async () => {
        const localFixtures = [...fixtures.guardSystem];
        const fnGuard = jest.fn().mockReturnValue(false);

        localFixtures[3] = {
          ...localFixtures[3],
          guard: fnGuard,
        };

        const target = mount(<TestComp routes={localFixtures} />);
        const elemLink = target.find('nav a#link3');

        await act(async () => {
          elemLink.simulate('click', CLICK_ARG);

          await timeout(0);

          target.update();
        });

        expect(fnGuard).toHaveBeenCalled();
        expect(target.find('.forFail')).toHaveLength(0);
        expect(target.find('.thisIsFail')).toHaveLength(1);
        expect(history.location.pathname).toBe('/forFail');
      });
      it('guard 가 false 인데 redirect, failComponent 둘 다 없다면 root 페이지로 넘어간다.', async () => {
        const localFixtures = [...fixtures.guardSystem];
        const fnGuard = jest.fn(() => false);

        localFixtures[0] = {
          ...localFixtures[0],
          guard: fnGuard,
        };

        const target = mount(<TestComp routes={localFixtures} />);
        const elemLink = target.find('nav a#link0');

        await act(async () => {
          elemLink.simulate('click', CLICK_ARG);

          await timeout(0);

          target.update();
        });

        expect(fnGuard).toHaveBeenCalled();
        expect(history.location.pathname).toBe('/');
        expect(target.find('.theson')).toHaveLength(0);
        expect(target.find('.hidden')).toHaveLength(0);
        expect(target.find('#root')).toHaveLength(1);
      });
    });
    describe('asynchronous results', () => {
      beforeEach(() => {
        history = createMemoryHistory();
      });
      it('비동기로도 guard 조건을 통해 렌더링이 가능하다..', async () => {
        const localFixtures = [...fixtures.guardSystem];
        const fnGuard = jest.fn().mockResolvedValue(true);

        localFixtures[0] = {
          ...localFixtures[0],
          guard: fnGuard,
        };

        const target = mount(<TestComp routes={localFixtures} />);
        const elemLink = target.find('nav a#link0');

        expect(fnGuard).not.toBeCalled();

        await act(async () => {
          elemLink.simulate('click', CLICK_ARG);

          await timeout(0);

          target.update();
        });

        expect(fnGuard).toBeCalled();
        expect(history.location.pathname).toBe('/theson');
        expect(target.find('.theson')).toHaveLength(1);
        expect(fnGuard).toHaveBeenCalled();
      });
      it('guard 가 false 라면 제공된 redirect 를 통해 페이지를 넘긴다.', async () => {
        const localFixtures = [...fixtures.guardSystem];
        const fnGuard = jest.fn().mockResolvedValue(false);

        localFixtures[0] = {
          ...localFixtures[0],
          guard: fnGuard,
          redirect: '/hidden',
        };

        const target = mount(<TestComp routes={localFixtures} />);
        const elemLink = target.find('nav a#link0');

        await act(async () => {
          elemLink.simulate('click', CLICK_ARG);

          await timeout(0);

          target.update();
        });

        expect(fnGuard).toHaveBeenCalled();
        expect(history.location.pathname).toBe('/hidden');
        expect(target.find('.theson')).toHaveLength(0);
        expect(target.find('.hidden')).toHaveLength(1);
      });
      it('guard 가 catch 로 떨어지면 제공된 redirect 를 통해 페이지를 넘긴다.', async () => {
        try {
          const localFixtures = [...fixtures.guardSystem];
          const fnGuard = jest.fn().mockRejectedValue(new Error('error!'));

          localFixtures[0] = {
            ...localFixtures[0],
            guard: fnGuard,
            redirect: '/hidden',
          };

          const target = mount(<TestComp routes={localFixtures} />);
          const elemLink = target.find('nav a#link0');

          await act(async () => {
            elemLink.simulate('click', CLICK_ARG);

            target.update();
          });

          expect(fnGuard).toHaveBeenCalled();
          expect(history.location.pathname).toBe('/hidden');
          expect(target.find('.theson')).toHaveLength(0);
          expect(target.find('.hidden')).toHaveLength(1);
        } catch (error) {
          //
        }
      });
      it('guard 가 false 인데 redirect 가 없다면 root 페이지로 넘어간다.', async () => {
        try {
          const localFixtures = [...fixtures.guardSystem];
          const fnGuard = jest.fn().mockResolvedValue(false);

          localFixtures[0] = {
            ...localFixtures[0],
            guard: fnGuard,
          };

          const target = mount(<TestComp routes={localFixtures} />);
          const elemLink = target.find('nav a#link0');

          await act(async () => {
            elemLink.simulate('click', CLICK_ARG);

            target.update();
          });

          expect(fnGuard).toHaveBeenCalled();
          expect(history.location.pathname).toBe('/');
          expect(target.find('.theson')).toHaveLength(0);
          expect(target.find('.hidden')).toHaveLength(0);
          expect(target.find('#root')).toHaveLength(1);
        } catch (error) {
          //
        }
      });
    });
  });

  describe('child render', () => {
    beforeEach(() => {
      history = createMemoryHistory();
    });

    it('child 가 제공되면 하위 라우트를 렌더링 한다.', () => {
      const localFixtures = [...fixtures.childRender];
      const target = mount(<TestComp routes={localFixtures} />);
      const elemLink0 = target.find('nav a#link0_0');

      elemLink0.simulate('click', CLICK_ARG);

      const elem0 = target.find('.theson_genius');

      expect(history.location.pathname).toBe('/theson/genius');
      expect(elem0).toHaveLength(1);

      const elemLink1 = target.find('nav a#link0_1');

      elemLink1.simulate('click', CLICK_ARG);

      const elem1 = target.find('.theson_fullstack');

      expect(history.location.pathname).toBe('/theson/fullstack');
      expect(elem1).toHaveLength(1);
    });
    it('child 는 제공된 자료의 depth 만큼 하위 라우트를 렌더링 할 수 있다.', () => {
      const localFixtures = [...fixtures.childRender];
      const target = mount(<TestComp routes={localFixtures} />);
      const elemLink0 = target.find('nav a#link1_0_0_0');

      elemLink0.simulate('click', CLICK_ARG);

      const elem0 = target.find('.fourDepth');

      expect(history.location.pathname).toBe('/root/depth1/depth2/depth3');
      expect(elem0).toHaveLength(1);

      const elemLink1 = target.find('nav a#link1_0_1');

      elemLink1.simulate('click', CLICK_ARG);

      const elem1 = target.find('.otherSide');

      expect(history.location.pathname).toBe('/root/depth1/otherSide');
      expect(elem1).toHaveLength(1);
    });
    it('하위 라우트 렌더링 시 wrap 이 있을 경우 하위 component 를 감싸서 함께 렌더링 된다.', () => {
      const localFixtures = [...fixtures.childRender];
      const target = mount(<TestComp routes={localFixtures} />);
      const elemLink0 = target.find('nav a#link2_0');

      elemLink0.simulate('click', CLICK_ARG);

      const elem0 = target.find('.wrap-first');
      const elemWrap = target.find('.my-wrap');

      expect(elemWrap).toHaveLength(1);

      expect(history.location.pathname).toBe('/wrap/first');
      expect(elem0).toHaveLength(1);
    });
    it('wrap 이 중첩 되어도 정상적으로 렌더링 할 수 있다.', () => {
      const localFixtures = [...fixtures.childRender];
      const target = mount(<TestComp routes={localFixtures} />);
      const elemLink0 = target.find('nav a#link3_1_0_1');

      elemLink0.simulate('click', CLICK_ARG);

      const elem0 = target.find('.no');
      const elemWrap0 = target.find('.cpxWrap');
      const elemWrap1 = target.find('.innerWrap');
      const elemWrap2 = target.find('.banner');

      expect(elemWrap0).toHaveLength(1);
      expect(elemWrap1).toHaveLength(1);
      expect(elemWrap2).toHaveLength(1);

      expect(history.location.pathname).toBe('/cpxWrap/inner/banner/no');
      expect(elem0).toHaveLength(1);
    });
    it('중첩된 라우트의 최하위 wrap 과 component 가 동시에 설정되어 있다면 이들을 렌더링 할 수 있다.', () => {
      const localFixtures = [...fixtures.childRender];
      const target = mount(<TestComp routes={localFixtures} />);
      const elemLink0 = target.find('nav a#link3_1_0_2');

      elemLink0.simulate('click', CLICK_ARG);

      const elem0 = target.find('.neutral');
      const elemWrap0 = target.find('.cpxWrap');
      const elemWrap1 = target.find('.innerWrap');
      const elemWrap2 = target.find('.banner');
      const elemWrap3 = target.find('.neutralWrap');

      expect(elemWrap0).toHaveLength(1);
      expect(elemWrap1).toHaveLength(1);
      expect(elemWrap2).toHaveLength(1);
      expect(elemWrap3).toHaveLength(1);

      expect(history.location.pathname).toBe('/cpxWrap/inner/banner/neutral');
      expect(elem0).toHaveLength(1);
    });
    it('중첩된 라우트에 각각 guard 가 설정되어 있다면, 최종 컴포넌트 렌더링시에 한꺼번에 검증한다.', async () => {
      type RequiredType = Required<typeof fixtures.childRender[number]>;

      const localFixtures = [...fixtures.childRender] as RequiredType[];
      const fnGuard0 = jest.fn().mockResolvedValue(true);
      const fnGuard1 = jest.fn().mockResolvedValue(true);
      const fnGuard2 = jest.fn().mockResolvedValue(true);

      localFixtures[3] = fixtures.createComplexChild() as RequiredType;

      localFixtures[3].guard = fnGuard0;
      localFixtures[3].child[1].guard = fnGuard1;
      (
        (localFixtures[3].child[1] as RequiredType).child[0] as RequiredType
      ).child[2].guard = fnGuard2;

      await act(async () => {
        const target = mount(<TestComp routes={localFixtures} />);

        target.find('nav a#link1_0_0').simulate('click', CLICK_ARG);

        expect(history.location.pathname).not.toBe('/');

        expect(fnGuard0).not.toBeCalled();
        expect(fnGuard1).not.toBeCalled();
        expect(fnGuard2).not.toBeCalled();

        const elemLink0 = target.find('nav a#link3_1_0_2');

        elemLink0.simulate('click', CLICK_ARG);

        await timeout(0);

        target.update();

        expect(fnGuard0).toBeCalled();
        expect(fnGuard1).toBeCalled();
        expect(fnGuard2).toBeCalled();
        expect(history.location.pathname).toBe('/cpxWrap/inner/banner/neutral');
        expect(target.find('.neutral')).toHaveLength(1);
      });
    });
  });
});
