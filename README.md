# react-theme-context

[![Travis Build Status](https://img.shields.io/travis/com/jedmao/react-theme-context.svg?style=popout-square&logo=travis)](https://travis-ci.com/jedmao/react-theme-context)
[![codecov](https://img.shields.io/codecov/c/gh/jedmao/react-theme-context.svg?style=popout-square&token=202a1ea4-a048-44a2-8bd8-527f6effec6a)](https://codecov.io/gh/jedmao/react-theme-context)
[![npm version](https://img.shields.io/npm/v/react-theme-context/latest.svg?style=popout-square&logo=npm)](https://www.npmjs.com/package/react-theme-context)

Provides theme [context](https://reactjs.org/docs/context.html) and
[hooks](https://reactjs.org/docs/hooks-reference.html). Supports theme switching
via
[CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*).

## Usage

_The following example uses [TypeScript](http://www.typescriptlang.org/)._

- You only want to create a single theme context and reuse it throughout your
  application.
- You can create as many themes as you want.
- A `Theme` is expected to be of type:
  `Record<string, string | number | boolean>`.

### themeContext.tsx

```tsx
import ThemeContext from 'react-theme-context'

const defaultTheme = { primaryColor: 'red' }

export default new ThemeContext(defaultTheme)
```

### App.tsx

```tsx
import React, { FC } from 'react'

import themeContext from './themeContext'

const App: FC = () => {
  themeContext.useLayoutEffect()
  const [theme, setTheme] = themeContext.use()
  return (
    <div style={`background: ${themeContext.prop('primaryColor')}`}>
      <button
        onClick={() => {
          setTheme({ primaryColor: 'blue' })
        }}
      >
        {theme.primaryColor}
      </button>
    </div>
  )
}

export default App
```

### index.tsx

```tsx
import React from 'react'
import ReactDOM from 'react-dom'

import themeContext from './themeContext'
import App from './App'

const renderApp = () =>
  ReactDOM.render(
    <themeContext.Provider>
      <App />
    </themeContext.Provider>,
    document.getElementById('root'),
  )

renderApp()
```

## ThemeContext API

### `#Provider`

_See:
[React Docs | Context Provider](https://reactjs.org/docs/context.html#contextprovider)_

### `#prop(property: keyof Theme): string`

Converts `property` into
[CSS custom property](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
syntax. In TypeScript, it also prevents you from using a theme property that is
not defined.

#### Example

```ts
themeContext.prop('primaryColor')
// 'var(--primary-color)'
```

### `#useLayoutEffect(element = document.documentElement)`

_Returns: `[T, Dispatch<SetStateAction<T>>]`_

Sets theme properties as
[CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) on
the provided `element` or the root `documentElement` by default. If the theme is
updated, these props are updated too. This enables live theme switching!

_See:
[React Hooks API Reference | useLayoutEffect](https://reactjs.org/docs/hooks-reference.html#uselayouteffect)_

### `#use()`

_Returns: the result of
[`React.useContext`](https://reactjs.org/docs/hooks-reference.html#usecontext)_

## Available Scripts

In the project directory, you can run:

### `npm test`

Launches the [Jest][https://jestjs.io/] test runner in the interactive
[watch](https://jestjs.io/docs/en/cli#watch) mode.

For a coverage report, run `npm test -- --coverage`.

### `npm run lint`

Runs [ESLint](https://eslint.org/).

### `npm run commit`

Runs [commitizen](https://www.npmjs.com/package/commitizen), prompting you to
fill out any required commit fields at commit time.

### `npm run build`

Builds the library for [npm](https://www.npmjs.com/) into the `dist` folder.
