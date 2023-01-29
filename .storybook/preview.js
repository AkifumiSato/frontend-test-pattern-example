import { initialize, mswDecorator } from 'msw-storybook-addon'
import { handlers } from '../src/mocks/handlers'
import '../src/index.css'

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  msw: {
    handlers,
  }
}

// Initialize MSW
initialize();

export const decorators = [mswDecorator];
