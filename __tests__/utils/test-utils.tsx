import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { FormProvider, UseFormReturn } from 'react-hook-form';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

interface AllTheProvidersProps {
  children: React.ReactNode;
  formMethods?: UseFormReturn<any>;
}

function AllTheProviders({ children, formMethods }: AllTheProvidersProps) {
  const testQueryClient = createTestQueryClient();

  if (formMethods) {
    return (
      <QueryClientProvider client={testQueryClient}>
        <ThemeProvider>
          <FormProvider {...formMethods}>{children}</FormProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={testQueryClient}>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>
  );
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
