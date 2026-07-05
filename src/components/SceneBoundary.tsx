import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  failed: boolean;
}

/**
 * Isolates the WebGL scene so a lost GPU context (a laptop switching GPUs, a
 * driver reset, a backgrounded tab) degrades gracefully — the black hole
 * simply drops out and the rest of the site keeps working — instead of an
 * unhandled error in R3F's `<Canvas>` unmounting the whole page. One
 * automatic remount is attempted in case the loss was transient.
 */
const MAX_RETRIES = 3;

export class SceneBoundary extends Component<Props, State> {
  private retryTimer: ReturnType<typeof setTimeout> | undefined;
  private retries = 0;

  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidUpdate(_prev: Props, prevState: State) {
    if (this.state.failed && !prevState.failed && this.retries < MAX_RETRIES) {
      this.retries += 1;
      // Back off between attempts — a transient loss (tab wake, GPU switch)
      // usually recovers within a few seconds.
      this.retryTimer = setTimeout(() => this.setState({ failed: false }), 3000 * this.retries);
    }
  }

  componentWillUnmount() {
    if (this.retryTimer) clearTimeout(this.retryTimer);
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

