import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import ThemeContext from './ThemeContext'

const defaultTheme = {
	primaryColor: 'red',
}

let setProperty = jest.fn()
const { style } = window.document.documentElement
const saveSetProperty = style.setProperty
style.setProperty = setProperty

describe('new ThemeContext(defaultTheme)', () => {
	const themeContext = new ThemeContext(defaultTheme)
	let rendered: ReturnType<typeof render>

	beforeEach(() => {
		setProperty.mockReset()

		const App = () => {
			themeContext.useLayoutEffect()
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

		rendered = render(
			<themeContext.Provider>
				<App />
			</themeContext.Provider>,
		)
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
			expect(rendered.getByText('red')).toBeDefined()
		})
	})

	describe('#use', () => {
		it('returns [theme, setTheme], which respectively gets and sets the theme', () => {
			fireEvent.click(rendered.getByText('red') as HTMLElement)
			expect(rendered.getByText('blue')).toBeDefined()
		})
	})

	describe('#useLayoutEffect', () => {
		it('sets a CSS custom property on the root document element', () => {
			expect(setProperty).toHaveBeenCalledWith('--primary-color', 'red')
		})

		it('updates the custom property when the theme changes', () => {
			fireEvent.click(rendered.getByText('red') as HTMLElement)
			expect(setProperty).toHaveBeenCalledWith('--primary-color', 'blue')
		})
	})
})
