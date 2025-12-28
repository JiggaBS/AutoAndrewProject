import React, { Component, ErrorInfo, ReactNode } from 'react';
import * as Sentry from '@sentry/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);
    console.error('Component stack:', errorInfo.componentStack);
    
    // Send to Sentry for error tracking (if initialized)
    try {
      Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack,
          },
        },
        tags: {
          errorBoundary: true,
        },
        extra: {
          errorInfo,
        },
      });
    } catch (sentryError) {
      // Sentry not initialized or error sending to Sentry
      console.warn('Failed to send error to Sentry:', sentryError);
    }
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const message = this.state.error?.message || "Errore sconosciuto";
      const stack = this.state.error?.stack;

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-xl w-full">
            <CardHeader>
              <CardTitle>Qualcosa è andato storto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Si è verificato un errore imprevisto. Per favore, ricarica la pagina.
              </p>

              <div className="rounded-md border bg-muted/30 p-3 text-sm">
                <div className="font-medium">Dettagli errore</div>
                <div className="mt-1 text-muted-foreground break-words">{message}</div>
                {stack ? (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-muted-foreground">
                      Stack trace
                    </summary>
                    <pre className="mt-2 max-h-56 overflow-auto rounded-md bg-background p-3 text-xs text-foreground">
                      {stack}
                    </pre>
                  </details>
                ) : null}
              </div>

              <Button onClick={() => window.location.reload()}>Ricarica Pagina</Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

