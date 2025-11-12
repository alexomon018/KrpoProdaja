import { render, screen } from '@/__tests__/utils/test-utils';
import { Badge, ConditionBadge, SizeBadge } from './Badge';

describe('Badge', () => {
  it('renders with children', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('applies default variant', () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText('Default');
    expect(badge).toBeInTheDocument();
  });

  it('applies primary variant', () => {
    render(<Badge variant="primary">Primary</Badge>);
    expect(screen.getByText('Primary')).toBeInTheDocument();
  });

  it('applies different sizes', () => {
    render(<Badge size="lg">Large Badge</Badge>);
    expect(screen.getByText('Large Badge')).toBeInTheDocument();
  });
});

describe('ConditionBadge', () => {
  it('renders correct label for condition type', () => {
    render(<ConditionBadge condition="new" />);
    expect(screen.getByText('Novo sa etiketom')).toBeInTheDocument();
  });

  it('renders very good condition', () => {
    render(<ConditionBadge condition="very-good" />);
    expect(screen.getByText('Vrlo dobro')).toBeInTheDocument();
  });
});

describe('SizeBadge', () => {
  it('renders size correctly', () => {
    render(<SizeBadge clothingSize="M" />);
    expect(screen.getByText('M')).toBeInTheDocument();
  });
});
