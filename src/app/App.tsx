import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { Button } from "./components/ui/button";
import { SplashScreen } from "./components/SplashScreen";
import { LandingPage } from "./components/LandingPage";
import { LoginPage } from "./components/LoginPage";
import { CustomerDashboard } from "./components/CustomerDashboard";
import { TechnicianApp } from "./components/TechnicianApp";
import { AdminDashboard } from "./components/AdminDashboard";
import { AdminDashboardNew } from "./components/AdminDashboardNew";
// import { DeleteBookings } from './components/utils/DeleteBookings'; // ✅ DISABLED: Auto-delete utility
import { DevQuickAccess } from "./components/utils/DevQuickAccess";
import { SupabaseConnectivityTest } from "./components/utils/SupabaseConnectivityTest";

type View =
  | "landing"
  | "login"
  | "customer"
  | "technician"
  | "admin";

function AppContent() {
  const [currentView, setCurrentView] =
    useState<View>("landing");
  const [showSplash, setShowSplash] = useState(true);
  const [splashComplete, setSplashComplete] = useState(false);
  const [quickLoginLoading, setQuickLoginLoading] =
    useState(false);
  const [showConnectivityTest, setShowConnectivityTest] =
    useState(false);
  const { user, profile, loading, signIn } = useAuth();

  // Global error handler to suppress AbortError warnings
  useEffect(() => {
    let abortErrorCount = 0;
    const MAX_LOGS = 1; // Only log once to avoid console spam

    const handleError = (event: ErrorEvent) => {
      if (
        event.error?.name === "AbortError" ||
        event.message?.includes("AbortError")
      ) {
        event.preventDefault();
        if (abortErrorCount < MAX_LOGS) {
          console.log(
            "ℹ️ AbortError suppressed (likely from React Strict Mode remounting)",
          );
          abortErrorCount++;
        }
      }
    };

    const handleUnhandledRejection = (
      event: PromiseRejectionEvent,
    ) => {
      if (
        event.reason?.name === "AbortError" ||
        event.reason?.message?.includes("AbortError")
      ) {
        event.preventDefault();
        if (abortErrorCount < MAX_LOGS) {
          console.log(
            "ℹ️ AbortError promise rejection suppressed (likely from React Strict Mode remounting)",
          );
          abortErrorCount++;
        }
      }
    };

    window.addEventListener("error", handleError);
    window.addEventListener(
      "unhandledrejection",
      handleUnhandledRejection,
    );

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );
    };
  }, []);

  // Handle splash screen completion
  const handleSplashComplete = () => {
    setSplashComplete(true);
  };

  // Only hide splash when BOTH splash animation is done AND auth is loaded
  useEffect(() => {
    if (splashComplete && !loading) {
      // Quick transition
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [splashComplete, loading]);

  // Auto-navigate based on user role
  useEffect(() => {
    console.log("🔄 AUTO-NAVIGATE CHECK:", {
      loading,
      hasUser: !!user,
      hasProfile: !!profile,
      currentView,
    });

    if (!loading && user && profile) {
      // 🔍 DEBUG: Log user and profile info
      console.log("🔍 AUTO-NAVIGATE DEBUG:");
      console.log("User email:", user.email);
      console.log("Profile role:", profile.role);
      console.log("Full profile:", profile);

      // Auto-navigate to appropriate dashboard based on role
      switch (profile.role) {
        case "customer":
          console.log("✅ Navigating to CUSTOMER dashboard");
          setCurrentView("customer");
          break;
        case "technician":
          console.log("✅ Navigating to TECHNICIAN dashboard");
          setCurrentView("technician");
          break;
        case "admin":
          console.log("✅ Navigating to ADMIN dashboard");
          setCurrentView("admin");
          break;
        default:
          console.log(
            "⚠️ Unknown role:",
            profile.role,
            "- Defaulting to customer",
          );
          setCurrentView("customer");
      }
    } else if (!loading && !user) {
      // If no user and not loading, show landing page
      console.log("❌ No user found, staying on landing/login");
      if (currentView !== "login") {
        setCurrentView("landing");
      }
    } else if (loading) {
      console.log("⏳ Still loading auth state...");
    }
  }, [user, profile, loading]);

  // Show splash screen on initial load
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Quick access handlers for development
  const handleQuickLoginAsAdmin = async () => {
    setQuickLoginLoading(true);
    console.log("🚀 Quick Access: Logging in as Admin...");

    try {
      const { error } = await signIn(
        "admin@demo.com",
        "password123",
      );

      if (error) {
        console.error("❌ Admin login failed:", error);
        toast.error(
          "Login gagal. Pastikan user admin sudah dibuat di database.",
        );
        setQuickLoginLoading(false);
        return;
      }

      console.log("✅ Admin login successful");
      // Auth context will auto-navigate to admin dashboard
    } catch (err) {
      console.error("❌ Admin login exception:", err);
      toast.error("Terjadi error saat login");
    } finally {
      setQuickLoginLoading(false);
    }
  };

  const handleQuickLoginAsCustomer = async () => {
    setQuickLoginLoading(true);
    console.log("🚀 Quick Access: Logging in as Customer...");

    try {
      const { error } = await signIn(
        "customer@demo.com",
        "password123",
      );

      if (error) {
        console.error("❌ Customer login failed:", error);
        toast.error(
          "Login gagal. Pastikan user customer sudah dibuat di database.",
        );
        setQuickLoginLoading(false);
        return;
      }

      console.log("✅ Customer login successful");
      // Auth context will auto-navigate to customer dashboard
    } catch (err) {
      console.error("❌ Customer login exception:", err);
      toast.error("Terjadi error saat login");
    } finally {
      setQuickLoginLoading(false);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case "landing":
        return (
          <LandingPage
            onNavigateToLogin={() => setCurrentView("login")}
          />
        );
      case "login":
        return (
          <LoginPage onBack={() => setCurrentView("landing")} />
        );
      case "customer":
        return (
          <CustomerDashboard onNavigate={setCurrentView} />
        );
      case "technician":
        return <TechnicianApp onNavigate={setCurrentView} />;
      case "admin":
        return (
          <AdminDashboardNew onNavigate={setCurrentView} />
        );
      default:
        return (
          <LandingPage
            onNavigateToLogin={() => setCurrentView("login")}
          />
        );
    }
  };

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" />
      {/* <DeleteBookings /> // ✅ DISABLED: Auto-delete utility */}
      <DevQuickAccess
        onLoginAsAdmin={handleQuickLoginAsAdmin}
        onLoginAsCustomer={handleQuickLoginAsCustomer}
        onTestConnection={() => setShowConnectivityTest(true)}
        isLoading={quickLoginLoading}
      />

      {/* Connectivity Test Modal */}
      {showConnectivityTest && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
          onClick={() => setShowConnectivityTest(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <SupabaseConnectivityTest />
            <Button
              onClick={() => setShowConnectivityTest(false)}
              className="mt-4 w-full"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {renderView()}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}