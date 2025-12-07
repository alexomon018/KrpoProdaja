import { render, screen } from '@/__tests__/utils/test-utils';
import { ConditionBadge } from './ConditionBadge';

describe('ConditionBadge', () => {
  it('renders new condition correctly', () => {
    render(<ConditionBadge condition="new" />);
    expect(screen.getByText('Novo')).toBeInTheDocument();
  });

  it('renders very-good condition correctly', () => {
    render(<ConditionBadge condition="very-good" />);
    expect(screen.getByText('Veoma dobro')).toBeInTheDocument();
  });

  it('renders good condition correctly', () => {
    render(<ConditionBadge condition="good" />);
    expect(screen.getByText('Dobro')).toBeInTheDocument();
  });

  it('renders satisfactory condition correctly', () => {
    render(<ConditionBadge condition="satisfactory" />);
    expect(screen.getByText('Zadovoljavajuće')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<ConditionBadge condition="new" className="custom-class" />);
    const badge = screen.getByText('Novo');
    expect(badge).toHaveClass('custom-class');
  });

  it('forwards ref to span element', () => {
    const ref = { current: null };
    render(<ConditionBadge condition="new" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});
