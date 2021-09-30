import { timeout } from '@common/util';
import { mount } from 'enzyme';
import { createMemoryHistory } from 'history';
import React, { ComponentType, FC } from 'react';
import { act } from 'react-dom/test-utils';
import { Router } from 'react-router';
import { Link, Route, Switch } from 'react-router-dom';
import { AsyncGuard } from '../src/AsyncGuard';

describe('AsyncGuard', () => {
  let history = createMemoryHistory();

  const CLICK_ARG = { button: 0 };

  interface Props {
    guard?: () => boolean | Promise<boolean>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    failComponent?: ComponentType<any>;
    redirect?: string;
  }

  const TestComp: FC<Props> = ({ guard, redirect, failComponent }) => (
    <Router history={history}>
      <section>
        <nav>
          <Link className="link_asyncTest" to="/asyncTest">
            asyncTest
          </Link>
          <Link className="link_otherPath" to="/otherPath">
            otherPath
          </Link>
        </nav>
      </section>
      <Switch>
        <Route exact path="/">
          <div id="root">root</div>
        </Route>
        <Route path="/asyncTest">
          <AsyncGuard
            guard={guard}
            redirect={redirect}
            failComponent={failComponent}
          >
            <div className="asyncTest">success</div>
          </AsyncGuard>
        </Route>
        <Route path="/otherPath">
          <div className="otherPath">other path</div>
        </Route>
      </Switch>
    </Router>
  );

  beforeEach(() => {
    history = createMemoryHistory();
  });

  describe('동기적 설정', () => {
    it('guard 가 설정되어 있지 않다면 그대로 렌더링 한다.', async () => {
      const target = mount(<TestComp />);

      await act(async () => {
        target.find('nav a.link_asyncTest').simulate('click', CLICK_ARG);

        await timeout(0);

        target.update();
      });

      expect(target.find('.asyncTest')).toHaveLength(1);
    });

    it('guard 가 설정되어 있고 그 결과가 true 면 렌더링 한다.', async () => {
      const guard = jest.fn().mockReturnValue(true);
      const target = mount(<TestComp guard={guard} />);

      await act(async () => {
        target.find('nav a.link_asyncTest').simulate('click', CLICK_ARG);

        await timeout(0);

        target.update();
      });

      expect(target.find('.asyncTest')).toHaveLength(1);
    });

    it('guard 가 설정되어 있고 그 결과가 false 면 root 로 redirect 된다.', async () => {
      const guard = jest.fn().mockReturnValue(false);
      const target = mount(<TestComp guard={guard} />);

      await act(async () => {
        target.find('nav a.link_asyncTest').simulate('click', CLICK_ARG);

        await timeout(0);

        target.update();
      });

      expect(history.location.pathname).toBe('/');
      expect(guard).toBeCalled();
      expect(target.find('.asyncTest')).toHaveLength(0);
      expect(target.find('#root')).toHaveLength(1);
    });

    it('guard 결과가 false 인데 redirect 가 설정되어 있다면 그 곳으로 이동한다.', async () => {
      const guard = jest.fn().mockReturnValue(false);
      const target = mount(<TestComp guard={guard} redirect="/otherPath" />);

      await act(async () => {
        target.find('nav a.link_asyncTest').simulate('click', CLICK_ARG);

        await timeout(0);

        target.update();
      });

      expect(history.location.pathname).toBe('/otherPath');
      expect(guard).toBeCalled();
      expect(target.find('.asyncTest')).toHaveLength(0);
      expect(target.find('.otherPath')).toHaveLength(1);
    });
  });

  describe('비동기 설정', () => {
    it('guard 가 비동기로 설정되어 있고 그 결과가 true 면 렌더링 된다.', async () => {
      const guard = jest.fn().mockResolvedValue(true);
      const target = mount(<TestComp guard={guard} />);

      await act(async () => {
        target.find('nav a.link_asyncTest').simulate('click', CLICK_ARG);

        await timeout(0);

        target.update();
      });

      expect(history.location.pathname).toBe('/asyncTest');
      expect(guard).toBeCalled();
      expect(target.find('.asyncTest')).toHaveLength(1);
      expect(target.find('#root')).toHaveLength(0);
    });

    it('guard 가 비동기로 설정되어 있고 그 결과가 false 면 root 로 redirect 된다.', async () => {
      const guard = jest.fn().mockResolvedValue(true);

      await act(async () => {
        const target = mount(<TestComp guard={guard} />);
        target.find('nav a.link_asyncTest').simulate('click', CLICK_ARG);

        await timeout(0);

        target.update();

        expect(history.location.pathname).toBe('/asyncTest');
        expect(guard).toBeCalled();
        expect(target.find('.asyncTest')).toHaveLength(1);
        expect(target.find('#root')).toHaveLength(0);
      });
    });

    it('guard 가 비동기로 설정되어 있고 오류가 발생되었다면 root 로 redirect 된다.', async () => {
      const guard = jest
        .fn()
        .mockImplementation(() => Promise.reject(new Error('error')));

      await act(async () => {
        const target = mount(<TestComp guard={guard} />);

        target.find('nav a.link_asyncTest').simulate('click', CLICK_ARG);

        await timeout(0);

        target.update();

        expect(history.location.pathname).toBe('/');
        expect(guard).toBeCalled();
        expect(target.find('.asyncTest')).toHaveLength(0);
        expect(target.find('#root')).toHaveLength(1);
      });
    });

    it('비동기 guard 결과가 false 인데 redirect 가 설정되어 있다면 그 곳으로 이동한다.', async () => {
      const guard = jest.fn().mockReturnValue(Promise.resolve(false));
      const target = mount(<TestComp guard={guard} redirect="/otherPath" />);

      await act(async () => {
        target.find('nav a.link_asyncTest').simulate('click', CLICK_ARG);

        await timeout(0);

        target.update();
      });

      expect(history.location.pathname).toBe('/otherPath');
      expect(guard).toBeCalled();
      expect(target.find('.asyncTest')).toHaveLength(0);
      expect(target.find('.otherPath')).toHaveLength(1);
    });
  });

  describe('failComponent 렌더링', () => {
    const FailComp: FC = () => <div className="failSection">failSection</div>;

    it('설정된 guard 결과가 false 면 failComponent 를 렌더링 할 수 있다.', async () => {
      const guard = jest.fn().mockReturnValue(false);
      const target = mount(<TestComp guard={guard} failComponent={FailComp} />);

      await act(async () => {
        target.find('nav a.link_asyncTest').simulate('click', CLICK_ARG);

        await timeout(0);

        target.update();
      });

      expect(history.location.pathname).toBe('/asyncTest');
      expect(guard).toBeCalled();
      expect(target.find('.asyncTest')).toHaveLength(0);
      expect(target.find('.failSection')).toHaveLength(1);
    });

    it('비동기 guard 결과가 false 면 failComponent 를 렌더링 할 수 있다.', async () => {
      const guard = jest.fn().mockReturnValue(Promise.resolve(false));
      const target = mount(<TestComp guard={guard} failComponent={FailComp} />);

      await act(async () => {
        target.find('nav a.link_asyncTest').simulate('click', CLICK_ARG);

        await timeout(0);

        target.update();
      });

      expect(history.location.pathname).toBe('/asyncTest');
      expect(guard).toBeCalled();
      expect(target.find('.asyncTest')).toHaveLength(0);
      expect(target.find('.failSection')).toHaveLength(1);
    });

    it('비동기 guard 결과가 실패면 failComponent 를 렌더링 할 수 있다.', async () => {
      const guard = jest
        .fn()
        .mockImplementation(() => Promise.reject(new Error('error')));

      await act(async () => {
        const target = mount(
          <TestComp guard={guard} failComponent={FailComp} />
        );

        target.find('nav a.link_asyncTest').simulate('click', CLICK_ARG);

        await timeout(0);

        target.update();

        expect(history.location.pathname).toBe('/asyncTest');
        expect(guard).toBeCalled();
        expect(target.find('.asyncTest')).toHaveLength(0);
        expect(target.find('.failSection')).toHaveLength(1);
      });
    });

    it('failComponent 가 설정되어 있어도 guard 가 true 면 렌더링 하지 않는다.', async () => {
      const guard = jest.fn().mockReturnValue(Promise.resolve(true));
      const target = mount(<TestComp guard={guard} failComponent={FailComp} />);

      await act(async () => {
        target.find('nav a.link_asyncTest').simulate('click', CLICK_ARG);

        await timeout(0);

        target.update();
      });

      expect(history.location.pathname).toBe('/asyncTest');
      expect(guard).toBeCalled();
      expect(target.find('.asyncTest')).toHaveLength(1);
      expect(target.find('.failSection')).toHaveLength(0);
    });
  });
});
