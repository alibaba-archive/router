# @ice/router

[![NPM version](https://img.shields.io/npm/v/@ice/router.svg?style=flat)](https://npmjs.org/package/@ice/router) [![build status](https://img.shields.io/travis/com/ice-lab/router.svg?style=flat-square)](https://travis-ci.com/ice-lab/router) [![Test coverage](https://img.shields.io/codecov/c/github/ice-lab/router.svg?style=flat-square)](https://codecov.io/gh/ice-lab/router) [![NPM downloads](http://img.shields.io/npm/dm/@ice/router.svg?style=flat)](https://npmjs.org/package/@ice/router) [![David deps](https://img.shields.io/david/ice-lab/router.svg?style=flat-square)](https://david-dm.org/ice-lab/router)

Support config routes, and include all react-router-dom abilities, based on react-router-dom.

## Install

```bash
$ npm i --save @ice/router
```

## Usage

Write router config:

```js
// src/config/routes.js
import UserLayout from '../layouts/UserLayout';
import Home from '../pages/Home';
import UserLogin from '../pages/UserLogin';
import UserRegistry from '../pages/UserRegistry';

const routerConfig = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/user',
    component: UserLayout,
    children: [{
      path: '/login',
      exact: true,
      component: UserLogin
    }, {
      path: '/registry',
      component: UserRegistry
    }, {
      path: '/',
      redirect: '/user/login'
    }]
  }
];
export default routerConfig;
```

Render router config by `@ice/app`:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from '@ice/router';
import routerConfig from './config/routes';

ReactDOM.render(
  <Router routes={routerConfig} />,
  mountNode
);
```

## API

```js
import {
  Router,

  // same with react-router-dom
  BrowserRouter,
  HashRouter,
  Link,
  Switch,
  Redirect,
  Route,
  withRouter,
  useHistory,
  useLocation,
  useParams,
  Prompt,
  NavLink,
  MemoryRouter,
  StaticRouter,
  generatePath,
  matchPath,
  useRouteMatch,
} from '@ice/router';
```

`Router` Component props:

- routes: array
- basename: string
- type: 'hash' | 'browser'
