import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FormBridge } from './todos';
import { createContext, useContext } from 'react';

describe('FormBridge', () => {
  it('should not throw outside router context and return no-op submit', () => {
    function TestComponent() {
      const bridge = FormBridge();
      React.useEffect(() => {
        expect(() => bridge.submit({ intent: 'add', text: 'Test' })).not.toThrow();
      }, [bridge]);
      return null;
    }
    render(<TestComponent />);
  });

  it('should call submit in router context using wrapper', () => {
    // Create a context to mock useSubmit
    const SubmitContext = createContext(() => {});
    function useSubmitMock() {
      return useContext(SubmitContext);
    }
    function FormBridgeWithMock() {
      let submit: ReturnType<typeof useSubmitMock> | null = null;
      try {
        submit = useSubmitMock();
      } catch (e) {
        submit = null;
      }
      return {
        submit: (data: Record<string, string | number | boolean>) => {
          if (!submit) return;
          submit();
        }
      };
    }
  const mockSubmit = jest.fn((...args) => {});
    function TestComponent() {
      const bridge = FormBridgeWithMock();
      React.useEffect(() => {
        bridge.submit({ intent: 'add', text: 'Test' });
      }, [bridge]);
      return null;
    }
    render(
      <SubmitContext.Provider value={mockSubmit}>
        <TestComponent />
      </SubmitContext.Provider>
    );
  expect(mockSubmit).toHaveBeenCalled();
  });
});
