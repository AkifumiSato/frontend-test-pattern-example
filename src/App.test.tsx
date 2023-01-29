import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import * as stories from './App.stories';

const { TodoApp } = composeStories(stories);

test('TodoAppにボタンが存在すること', async () => {
  render(<TodoApp />)
  expect(await screen.findByRole('button')).toBeInTheDocument()
})
