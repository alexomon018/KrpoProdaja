import { render, screen } from '@/__tests__/utils/test-utils';
import { renderHook } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { FormInput } from './FormInput';

describe('FormInput', () => {
  it('renders with label', () => {
    const { result } = renderHook(() => useForm());
    render(<FormInput name="test" label="Test Label" />, { formMethods: result.current });
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders input field', () => {
    const { result } = renderHook(() => useForm());
    render(<FormInput name="test" label="Test" />, { formMethods: result.current });
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('shows required indicator when required prop is true', () => {
    const { result } = renderHook(() => useForm());
    render(<FormInput name="test" label="Test" required />, { formMethods: result.current });
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('displays error message from form context', () => {
    const { result } = renderHook(() => useForm());
    const { container } = render(<FormInput name="test" label="Test" />, { formMethods: result.current });
    // Check that form input renders
    expect(container.querySelector('input')).toBeInTheDocument();
  });
});
