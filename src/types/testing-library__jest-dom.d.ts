// Type definitions for @testing-library/jest-dom
import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toBeVisible(): R;
      toBeEmpty(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toBeInvalid(): R;
      toBeRequired(): R;
      toBeChecked(): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveClass(...classNames: string[]): R;
      toHaveFocus(): R;
      toHaveFormValues(values: Record<string, any>): R;
      toHaveStyle(style: Record<string, any>): R;
      toHaveTextContent(text: string | RegExp): R;
      toHaveValue(value?: string | string[] | number): R;
      toBeInTheDOM(): R;
      toContainElement(element: HTMLElement | null): R;
      toContainHTML(htmlText: string): R;
    }
  }
}
