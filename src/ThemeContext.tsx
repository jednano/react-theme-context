import kebabCase from '@queso/kebab-case'
import React, {
	createContext,
	Dispatch,
	FC,
	SetStateAction,
	useContext,
	useLayoutEffect,
	useState,
} from 'react'

/**
 * Creates `React.Context` for a theme, exposes its `Provider` as well as some
 * utility functions and hooks for getting and setting the theme.
 */
export default class ThemeContext<T extends object> {
	private Context: React.Context<[T, Dispatch<SetStateAction<T>>]>

	/**
	 * @see https://reactjs.org/docs/context.html#contextprovider
	 */
	public Provider: FC

	public constructor(defaultTheme: T) {
		this.Context = createContext<[T, Dispatch<SetStateAction<T>>]>([
			defaultTheme,
			/* istanbul ignore next */
			() => {},
		])
		this.Provider = props => {
			const [theme, setTheme] = useState(defaultTheme)
			return (
				<this.Context.Provider value={[theme, setTheme]}>
					{props.children}
				</this.Context.Provider>
			)
		}
	}

	/**
	 * Converts a theme `property` into [CSS custom property](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) syntax.
	 * @example
	 * themeContext.prop('primaryColor')
	 * // 'var(--primary-color)'
	 */
	public prop(property: keyof T) {
		return `var(--${kebabCase(property as string)})`
	}

	/**
	 * Sets theme properties as [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
	 * on the provided `element` or the root `documentElement` by default.
	 * If the theme is updated, these props are updated too.
	 * This enables live theme switching!
	 * @suggestion use inside your root `App` component.
	 * @example
	 * const App = () => {
	 * 	themeContext.useLayoutEffect()
	 * 	return null
	 *	}
	 */
	public useLayoutEffect(
		element = document.documentElement,
	): [T, Dispatch<SetStateAction<T>>] {
		const [theme, setTheme] = this.use()
		useLayoutEffect(() => {
			Object.keys(theme).forEach(setProp)
		}, [theme])
		return [theme, setTheme]
		function setProp(key: string) {
			element.style.setProperty(
				`--${kebabCase(key)}`,
				(theme as Record<string, string>)[key],
			)
		}
	}

	/**
	 * @returns the result of [`React.useContext`](https://reactjs.org/docs/hooks-reference.html#usecontext).
	 * @example
	 * const [theme, setTheme] = themeContext.use()
	 */
	public use() {
		return useContext(this.Context)
	}
}
