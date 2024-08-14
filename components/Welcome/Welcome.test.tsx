import { render, screen } from '@/test-utils'
import { Welcome } from './Welcome'
import data from '../../dictionaries/en.json'

describe('Welcome component', () => {
  it('has correct Next.js theming section link', () => {
    render(<Welcome dictionary={data} />);
    expect(screen.getByText('this guide')).toHaveAttribute(
      'href',
      'https://mantine.dev/guides/next/'
    );
  });
});
