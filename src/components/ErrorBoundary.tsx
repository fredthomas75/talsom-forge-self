import { Component, type ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { C, HDR_FONT } from "@/lib/constants";

interface Props { children: ReactNode; dark?: boolean }
interface State { hasError: boolean; error?: Error }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const dark = this.props.dark;

    return (
      <div className={`min-h-screen flex items-center justify-center p-8 ${dark ? "bg-gray-950" : "bg-gray-50"}`}>
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "#FEE2E2" }}>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className={`text-xl font-bold mb-2 ${dark ? "text-white" : "text-gray-900"}`} style={HDR_FONT}>
            Something went wrong
          </h2>
          <p className={`text-sm mb-6 ${dark ? "text-white/40" : "text-gray-500"}`}>
            An unexpected error occurred. Try refreshing the page.
          </p>
          {this.state.error && (
            <pre className={`text-xs text-left mb-6 p-3 rounded-xl overflow-auto max-h-24 ${dark ? "bg-white/5 text-white/30" : "bg-gray-100 text-gray-500"}`}>
              {this.state.error.message}
            </pre>
          )}
          <div className="flex gap-3 justify-center">
            <Button onClick={this.handleReset} variant="outline" className="rounded-full" style={{ borderColor: C.green, color: C.green }}>
              <RefreshCw className="w-3.5 h-3.5 mr-2" />
              Try again
            </Button>
            <Button onClick={() => window.location.reload()} className="rounded-full border-0" style={{ background: C.green, color: "white" }}>
              Refresh page
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
