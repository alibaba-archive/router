import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { Router } from '../src/index';

function RouteWrapper(props: any) {
  return <div className="wrapper">{props.children}</div>;
}

function SubWrapper(props: any) {
  return <div className="sub-wrapper">{props.children}</div>;
}

function Test() {
  return <div>test</div>;
}

function Layout({ children }) {
  return <div className="layout">{children}</div>;
}



const routes = [
  {
    component: Layout,
    path: '/',
    RouteWrapper,
    children: [
      {
        path: '/test',
        component: Test,
      },
      {
        path: '/wrapper',
        component: Test,
        RouteWrapper: SubWrapper,
      },
    ],
  },
];

it('RouterWrapper: /test', () => {
  const aboutTree = renderer
    .create(
      <Router type="memory" initialEntries={['/test']} routes={routes} />,
    )
    .toJSON();

  expect(aboutTree).toMatchInlineSnapshot(`
    <div
      className="wrapper"
    >
      <div
        className="layout"
      >
        <div>
          test
        </div>
      </div>
    </div>
  `);
});

it('RouterWrapper: /wrapper', () => {
  const aboutTree = renderer
    .create(
      <Router type="memory" initialEntries={['/wrapper']} routes={routes} />,
    )
    .toJSON();

  expect(aboutTree).toMatchInlineSnapshot(`
    <div
      className="wrapper"
    >
      <div
        className="layout"
      >
        <div
          className="sub-wrapper"
        >
          <div>
            test
          </div>
        </div>
      </div>
    </div>
  `);
});
