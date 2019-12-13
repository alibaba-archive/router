import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { Router } from '../src/index';

function Page(props: any) {
  return <div>{props.match.path}</div>;
}
function NotFound(props: any) {
  return <>404</>;
}
function Layout({ children }: any) {
  return <div className="layout">{children}</div>;
}

const routes = [
  {
    component: Layout,
    path: '/user',
    children: [
      {
        path: '/about',
        component: Page,
      },
      {
        path: '/about/x',
        component: Page,
      },
      {
        path: '/home',
        exact: true,
        redirect: '/user/about',
      },
      {
        path: '/home2',
        component: Page,
      },
      {
        component: NotFound,
      },
    ],
  },
];

it('simple match: /user/about', () => {
  const aboutTree = renderer
    .create(
      <Router type="memory" initialEntries={['/user/about']} routes={routes} />,
    )
    .toJSON();

  expect(aboutTree).toMatchInlineSnapshot(`
    <div
      className="layout"
    >
      <div>
        /user/about
      </div>
    </div>
  `);
});

it('/user/about/x should match /urer/about because no exact', () => {
  const about2Tree = renderer
    .create(
      <Router
        type="memory"
        initialEntries={['/user/about/x']}
        routes={routes}
      />,
    )
    .toJSON();
  expect(about2Tree).toMatchInlineSnapshot(`
    <div
      className="layout"
    >
      <div>
        /user/about
      </div>
    </div>
  `);
});

it('/user/home should match /user/about because of redirect', () => {
  const homeTree = renderer
    .create(
      <Router type="memory" initialEntries={['/user/home']} routes={routes} />,
    )
    .toJSON();
  expect(homeTree).toMatchInlineSnapshot(`
    <div
      className="layout"
    >
      <div>
        /user/about
      </div>
    </div>
  `);
});

it('/user/home2 should match /user/home2/ because /user/home has exact', () => {
  const home2Tree = renderer
    .create(
      <Router type="memory" initialEntries={['/user/home2']} routes={routes} />,
    )
    .toJSON();
  expect(home2Tree).toMatchInlineSnapshot(`
    <div
      className="layout"
    >
      <div>
        /user/home2
      </div>
    </div>
  `);
});

it('/user/xxxxx should match 404', () => {
  const notFoundTree = renderer
    .create(
      <Router type="memory" initialEntries={['/user/xxxxx']} routes={routes} />,
    )
    .toJSON();
  expect(notFoundTree).toMatchInlineSnapshot(`
    <div
      className="layout"
    >
      404
    </div>
  `);
});

it('/ should match nothing', () => {
  const nothingTree = renderer
    .create(<Router type="memory" initialEntries={['/']} routes={routes} />)
    .toJSON();
  expect(nothingTree).toMatchInlineSnapshot('null');
});
