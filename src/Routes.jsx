import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import PaymentCodeGeneration from "pages/payment-code-generation";
import UploadConfirmationStatus from "pages/upload-confirmation-status";
import AdminLogin from "pages/admin-login";
import ReceiptUpload from "pages/receipt-upload";
import ReceiptReviewDetail from "pages/receipt-review-detail";
import AdminDashboard from "pages/admin-dashboard";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<PaymentCodeGeneration />} />
        <Route path="/payment-code-generation" element={<PaymentCodeGeneration />} />
        <Route path="/upload-confirmation-status" element={<UploadConfirmationStatus />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/receipt-upload" element={<ReceiptUpload />} />
        <Route path="/receipt-review-detail" element={<ReceiptReviewDetail />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;