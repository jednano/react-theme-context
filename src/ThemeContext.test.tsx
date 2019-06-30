import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import ThemeContext from './ThemeContext'

const defaultTheme = {
	primaryColor: 'red',
}

const setProperty = jest.fn()
const { style } = window.document.documentElement
const saveSetProperty = style.setProperty
style.setProperty = setProperty

describe('new ThemeContext(defaultTheme)', () => {
	const themeContext = new ThemeContext(defaultTheme)

	beforeEach(() => {
		setProperty.mockReset()
	})

	afterAll(() => {
		style.setProperty = saveSetProperty
	})

	describe('#prop', () => {
		it('converts `primaryColor` into CSS custom property syntax: `var(--primary-color)`', () => {
			expect(themeContext.prop('primaryColor')).toBe('var(--primary-color)')
		})
	})

	describe('#Provider', () => {
		it('provides a theme', () => {
			const rendered = renderApp()

			expect(rendered.getByText('red')).toBeDefined()
		})
	})

	describe('#use', () => {
		it('returns [theme, setTheme], which respectively gets and sets the theme', () => {
			const rendered = renderApp()

			fireEvent.click(rendered.getByText('red') as HTMLElement)

			expect(rendered.getByText('blue')).toBeDefined()
		})
	})

	describe('#useLayoutEffect', () => {
		it('sets a CSS custom property on the root document element', () => {
			renderApp()

			expect(setProperty).toHaveBeenCalledWith('--primary-color', 'red')
		})

		it('updates the custom property when the theme changes', () => {
			const rendered = renderApp()

			fireEvent.click(rendered.getByText('red') as HTMLElement)

			expect(setProperty).toHaveBeenCalledWith('--primary-color', 'blue')
		})

		it('sets class names on provided element', () => {
			const element = document.createElement('html')

			renderApp({ element, classNames: ['foo', 'bar'] })

			expect(element.className).toEqual('foo bar')
		})
	})

	function renderApp({
		element,
		classNames,
	}: {
		element?: HTMLElement
		classNames?: string[]
	} = {}) {
		const App = () => {
			themeContext.useLayoutEffect(
				element || classNames ? { element, classNames } : undefined,
			)
			const [theme, setTheme] = themeContext.use()
			return (
				<button
					onClick={() => {
						setTheme({ primaryColor: 'blue' })
					}}
				>
					{theme.primaryColor}
				</button>
			)
		}

		return render(
			<themeContext.Provider>
				<App />
			</themeContext.Provider>,
		)
	}
})
