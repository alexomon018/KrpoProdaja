import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { FormProvider, UseFormReturn } from 'react-hook-form';

interface AllTheProvidersProps {
  children: React.ReactNode;
  formMethods?: UseFormReturn<any>;
}

function AllTheProviders({ children, formMethods }: AllTheProvidersProps) {
  if (formMethods) {
    return (
      <ThemeProvider>
        <FormProvider {...formMethods}>{children}</FormProvider>
      </ThemeProvider>
    );
  }

  return <ThemeProvider>{children}</ThemeProvider>;
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  formMethods?: UseFormReturn<any>;
}

const customRender = (
  ui: ReactElement,
  options?: CustomRenderOptions
) => {
  const { formMethods, ...renderOptions } = options || {};

  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders formMethods={formMethods}>{children}</AllTheProviders>
    ),
    ...renderOptions,
  });
};

export * from '@testing-library/react';
export { customRender as render };
