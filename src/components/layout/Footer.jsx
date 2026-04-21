import { Copyright } from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer mt-auto py-4">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
        <p className="mb-0 small">Glory Mart - E-commerce Store</p>
        <p className="mb-0 small d-flex align-items-center gap-2">
          <Copyright size={14} />
          <span>2026 All rights are reserved.</span>
        </p>
      </div>
    </footer>
  );
}
