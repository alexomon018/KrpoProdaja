import { render, screen } from '@/__tests__/utils/test-utils';
import { Typography, Price } from './Typography';

describe('Typography', () => {
  it('renders children text', () => {
    render(<Typography>Hello World</Typography>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('renders h1 variant as h1 element', () => {
    render(<Typography variant="h1" as="h1">Heading 1</Typography>);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Heading 1');
  });

  it('renders h2 variant as h2 element', () => {
    render(<Typography variant="h2" as="h2">Heading 2</Typography>);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
  });

  it('renders body text in paragraph', () => {
    render(<Typography variant="body">Body text</Typography>);
    expect(screen.getByText('Body text')).toBeInTheDocument();
  });

  it('allows custom element override with as prop', () => {
    render(<Typography variant="h1" as="span">Span Text</Typography>);
    expect(screen.getByText('Span Text')).toBeInTheDocument();
  });
});

describe('Price', () => {
  it('formats price correctly', () => {
    render(<Price amount={2500} />);
    expect(screen.getByText(/2\.500/)).toBeInTheDocument();
  });

  it('displays currency symbol', () => {
    render(<Price amount={1000} />);
    expect(screen.getByText(/RSD/)).toBeInTheDocument();
  });

  it('shows original price when provided', () => {
    render(<Price amount={2000} originalPrice={3000} />);
    expect(screen.getByText(/2\.000/)).toBeInTheDocument();
    expect(screen.getByText(/3\.000/)).toBeInTheDocument();
  });

  it('applies large variant', () => {
    render(<Price amount={5000} large />);
    expect(screen.getByText(/5\.000/)).toBeInTheDocument();
  });

  it('uses custom currency', () => {
    render(<Price amount={100} currency="EUR" />);
    expect(screen.getByText(/EUR/)).toBeInTheDocument();
  });
});
