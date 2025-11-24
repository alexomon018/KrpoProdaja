import { render, screen } from '@/__tests__/utils/test-utils';
import { ConditionBadge } from './ConditionBadge';

describe('ConditionBadge', () => {
  it('renders new condition correctly', () => {
    render(<ConditionBadge condition="new" />);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('renders very-good condition correctly', () => {
    render(<ConditionBadge condition="very-good" />);
    expect(screen.getByText('Very Good')).toBeInTheDocument();
  });

  it('renders good condition correctly', () => {
    render(<ConditionBadge condition="good" />);
    expect(screen.getByText('Good')).toBeInTheDocument();
  });

  it('renders satisfactory condition correctly', () => {
    render(<ConditionBadge condition="satisfactory" />);
    expect(screen.getByText('Satisfactory')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<ConditionBadge condition="new" className="custom-class" />);
    const badge = screen.getByText('New');
    expect(badge).toHaveClass('custom-class');
  });

  it('forwards ref to span element', () => {
    const ref = { current: null };
    render(<ConditionBadge condition="new" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});
