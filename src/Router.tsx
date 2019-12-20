import * as React from 'react';
import * as path from 'path';
import {
  HashRouter,
  BrowserRouter,
  MemoryRouter,
  Switch,
  Route,
  Redirect,

  RouteProps as DefaultRouteProps,
  RouteComponentProps,
} from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cloneDeep = require('lodash.clonedeep');

interface RouteProps extends DefaultRouteProps {
  children?: RouteProps[];
  // disable string[]
  path?: string;
  // for rediect ability
  redirect?: string;
};

interface RouterProps {
  // custom props
  routes: RouteProps[];
  type?: 'hash' | 'browser' | 'memory';
  // common props for BrowserRouter&HashRouter&MemoryRouter
  basename?: string;
  getUserConfirmation?: ((message: string, callback: (ok: boolean) => void) => void);
  forceRefresh?: boolean;
  // for BrowserRouter
  keyLength?: number;
  // for HashRouter
  hashType?: 'slash' | 'noslash' | 'hashbang';
  // for MemoryRouter
  initialEntries?: string[];
  initialIndex?: number;
};

interface RoutesProps {
  routes: RouteProps[];
};

export interface IRoutes {
  [index: number]: RouteProps[];
};

export function Router(props: RouterProps) {
  const { type = 'hash', routes, ...others } = props;
  const typeToComponent = {
    hash: HashRouter,
    browser: BrowserRouter,
    // for test case
    memory: MemoryRouter,
  };
  const RouterComponent: React.ComponentType<any> = typeToComponent[type];
  const formatedRoutes = formatRoutes(cloneDeep(routes), '');

  return (
    <RouterComponent {...others}>
      <Routes routes={formatedRoutes} />
    </RouterComponent>
  );
}

function Routes({ routes }: RoutesProps) {
  return (
    <Switch>
      {routes.map((route, id) => {
        const { children } = route;

        if (!children) {
          if (route.redirect) {
            const { redirect, path, ...others } = route;
            return <Redirect key={id} from={route.path} to={redirect} {...others} />;
          } else {
            return <Route key={id} {...route} />;
          }
        } else {
          const { component: LayoutComponent, children, ...others } = route;
          return (
            <Route
              key={id}
              {...others}
              component={(props: RouteComponentProps) => {
                return (
                  <LayoutComponent {...props}>
                    <Routes routes={children} />
                  </LayoutComponent>
                );
              }}
            />
          );
        }
      })}
    </Switch>
  );
}

/**
 * join path
 */
function formatRoutes(routes: RouteProps[], parentPath: string): RouteProps[] {
  return routes.map((item) => {
    if (item.path) {
      const joinPath = path.join(parentPath || '', item.path);
      // react-router: path=/project/ not match /project
      item.path = joinPath === '/' ? '/' : joinPath.replace(/\/$/, '');
    }

    if (item.children) {
      item.children = formatRoutes(item.children, item.path);
    }
    return item;
  });
}
