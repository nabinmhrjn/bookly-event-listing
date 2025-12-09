import PublicRoute from "@/components/PublicRoute";

export default function AuthLayout({ children }) {
  return (
    <PublicRoute>
      {children}
    </PublicRoute>
  );
}

