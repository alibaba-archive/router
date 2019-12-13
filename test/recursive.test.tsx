import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { Router } from '../src/index';

function Page(props: any) {
  return <>{props.match.path}</>;
}
function Layout({ children }: any) {
  return <div className="layout">{children}</div>;
}

const routes = [
  {
    component: Layout,
    path: '/bzb',
    children: [
      {
        path: '/user/login',
        component: Page,
      },
      {
        path: '/login',
        redirect: '/user/login',
      },
      {
        path: '/project',
        component: Layout,
        children: [
          {
            path: '/',
            exact: true,
            redirect: '/bzb/project/list',
          },
          {
            path: '/list',
            component: Page,
          },
          {
            path: '/detail',
            component: Page,
          },
          {
            path: '/login',
            redirect: '/bzb/user/login',
          },
        ],
      },
    ],
  },
];

it('/bzb/project/list should match', () => {
  const tree = renderer
    .create(
      <Router
        type="memory"
        initialEntries={['/bzb/project/list']}
        routes={routes}
      />,
    )
    .toJSON();

  expect(tree).toMatchInlineSnapshot(`
    <div
      className="layout"
    >
      <div
        className="layout"
      >
        /bzb/project/list
      </div>
    </div>
  `);
});

it('/bzb/project/login should match /bzb/user/login', () => {
  const tree = renderer
    .create(
      <Router
        type="memory"
        initialEntries={['/bzb/project/login']}
        routes={routes}
      />,
    )
    .toJSON();

  expect(tree).toMatchInlineSnapshot(`
    <div
      className="layout"
    >
      /bzb/user/login
    </div>
  `);
});

it('/bzb/project should match /bzb/project/list', () => {
  const tree = renderer
    .create(
      <Router
        type="memory"
        initialEntries={['/bzb/project']}
        routes={routes}
      />,
    )
    .toJSON();

  expect(tree).toMatchInlineSnapshot(`
    <div
      className="layout"
    >
      <div
        className="layout"
      >
        /bzb/project/list
      </div>
    </div>
  `);
});
