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

export interface RouteItemProps extends DefaultRouteProps {
  children?: RouteItemProps[];
  // disable string[]
  path?: string;
  // for rediect ability
  redirect?: string;

  RouteWrapper?: React.ComponentType;
};

interface RouterProps {
  // custom props
  routes: RouteItemProps[];
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
  routes: RouteItemProps[];
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
            const { RouteWrapper, component, ...others } = route;
            if (RouteWrapper) {
              const RouteComponent = component;
              return (
                <Route
                  key={id}
                  {...others}
                  render={(props: RouteComponentProps) => {
                    return (
                      <RouteWrapper {...others} {...props}>
                        <RouteComponent {...props} />
                      </RouteWrapper>
                    );
                  }}
                />
              );
            } else {
              return <Route key={id} component={component} {...others} />;
            }
          }
        } else {
          const { component: LayoutComponent, children, RouteWrapper, ...others } = route;
          const RenderComponent = (props: RouteComponentProps) => (
            <LayoutComponent {...props}>
              <Routes routes={children} />
            </LayoutComponent>
          );
          const ComponentWithWrapper = RouteWrapper ? (props: RouteComponentProps) => (
            <RouteWrapper {...others} {...props}><RenderComponent {...props} /></RouteWrapper>
          ) : RenderComponent;
          return (
            <Route
              key={id}
              {...others}
              component={ComponentWithWrapper}
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
function formatRoutes(routes: RouteItemProps[], parentPath: string): RouteItemProps[] {
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
