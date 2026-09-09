import type { Preview } from '@storybook/nextjs-vite'
import '../src/app/globals.css'

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: [
          'Design System',
          [
            'Foundations',
            'Buttons',
            'Cards & Containers',
            'Badges & Progress',
            'HUD & Navigation',
            'Media',
          ],
          'Application',
          ['Full Flow', 'Screens', 'Home'],
        ],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default preview
