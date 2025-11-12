import { render, screen } from '@/__tests__/utils/test-utils';
import { Container } from './Container';

describe('Container', () => {
  it('renders children correctly', () => {
    render(<Container>Test Content</Container>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies default size', () => {
    render(<Container>Content</Container>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies wide size', () => {
    render(<Container size="wide">Wide Content</Container>);
    expect(screen.getByText('Wide Content')).toBeInTheDocument();
  });

  it('applies grid layout when withGrid is true', () => {
    render(<Container withGrid>Grid Content</Container>);
    expect(screen.getByText('Grid Content')).toBeInTheDocument();
  });

  it('renders as a div element', () => {
    const { container } = render(<Container>Content</Container>);
    expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
  });
});
