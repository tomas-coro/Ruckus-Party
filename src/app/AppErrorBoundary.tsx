import { Component, type ReactNode } from 'react';

export interface AppErrorBoundaryProps {
  readonly children: ReactNode;
  readonly fallback: ReactNode;
  readonly onUnexpected: (code: 'UNEXPECTED_UI_ERROR') => void;
}

interface AppErrorBoundaryState {
  readonly failed: boolean;
}

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  override state: AppErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { failed: true };
  }

  override componentDidCatch(): void {
    this.props.onUnexpected('UNEXPECTED_UI_ERROR');
  }

  override render(): ReactNode {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
