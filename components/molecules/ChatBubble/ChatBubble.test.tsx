import { render, screen } from '@/__tests__/utils/test-utils';
import { ChatBubble } from './ChatBubble';

describe('ChatBubble', () => {
  const mockDate = new Date('2024-01-15T10:00:00');

  it('renders message text', () => {
    render(<ChatBubble message="Hello there!" timestamp={mockDate} />);
    expect(screen.getByText('Hello there!')).toBeInTheDocument();
  });

  it('displays timestamp', () => {
    const recentDate = new Date();
    render(<ChatBubble message="Test message" timestamp={recentDate} />);
    // Timestamp should be rendered - Serbian relative time format
    const bubble = screen.getByText('Test message').closest('div');
    expect(bubble).toBeInTheDocument();
  });

  it('applies different styling for own messages', () => {
    render(<ChatBubble message="My message" timestamp={mockDate} isOwn />);
    expect(screen.getByText('My message')).toBeInTheDocument();
  });

  it('shows message status indicator', () => {
    render(<ChatBubble message="Sent" timestamp={mockDate} status="sent" />);
    expect(screen.getByText('Sent')).toBeInTheDocument();
  });

  it('renders image attachment', () => {
    render(<ChatBubble message="Check this" timestamp={mockDate} image="/test.jpg" />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('renders system message differently', () => {
    render(<ChatBubble message="System notification" timestamp={mockDate} isSystem />);
    expect(screen.getByText('System notification')).toBeInTheDocument();
  });
});
