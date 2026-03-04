import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { GA4TrackingProvider } from "./components/GA4TrackingProvider";
import Home from "./pages/Home";
import EnterprisePage from '@/pages/EnterprisePage';
import MarketingHome from "./pages/MarketingHome";
import Features from "./pages/Features";
import HowItWorks from "./pages/HowItWorks";
import Security from "./pages/Security";
import Dashboard from "./pages/Dashboard";
import SubscriptionManagement from "./pages/SubscriptionManagement";
import AIDocumentQuestionnaire from "./pages/AIDocumentQuestionnaire";
import DocumentList from "./pages/DocumentList";
import UploadDocument from "./pages/UploadDocument";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import CheckoutComplete from "@/pages/CheckoutComplete";
import OrderConfirmation from "./pages/OrderConfirmation";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import DocumentEditor from "./pages/DocumentEditor";
import GenerateDocument from "./pages/GenerateDocument";
import FAQ from "./pages/FAQ";
import Comparison from "./pages/Comparison";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from './pages/ForgotPassword';
import TemplateLibrary from "./pages/TemplateLibrary";
import Templates from "./pages/Templates";
import Profile from "./pages/Profile";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Admin from "./pages/Admin";
import AdminManagement from './pages/AdminManagement';
import Credits from "./pages/Credits";
import SignDocument from "./pages/SignDocument";
import RecipientPortal from "./pages/RecipientPortal";
import OnboardingPage from "./pages/OnboardingPage";
import ContractGenerator from "./pages/ContractGenerator";
import InvoiceGenerator from "./pages/InvoiceGenerator";
import About from "./pages/About";
import Compliance from "./pages/Compliance";
import Trust from "./pages/Trust";
import Help from "./pages/Help";
import Docs from "./pages/Docs";
import Industries from "./pages/Industries";
import IndustryPage from "./pages/IndustryPage";
import { IndustryLandingPage, industryConfigs } from "./pages/IndustryLanding";
import { CompetitorCapturePage, competitorConfigs } from "./pages/CompetitorCapture";
import { DocuSignComparison, HelloSignComparison, DocuSignAlternatives } from "./pages/compare";

// Programmatic SEO pages
import PandaDocComparison from './pages/seo/compare/PandaDocComparison';
import AdobeSignComparison from './pages/seo/compare/AdobeSignComparison';
import DropboxSignComparison from './pages/seo/compare/DropboxSignComparison';
import SignNowComparison from './pages/seo/compare/SignNowComparison';
import DocuSignBusinessComparison from './pages/seo/compare/DocuSignBusinessComparison';
import DocuSignAlternative from './pages/seo/DocuSignAlternative';
import PandaDocAlternative from './pages/seo/PandaDocAlternative';
import HelloSignAlternative from './pages/seo/HelloSignAlternative';
import AdobeSignAlternative from './pages/seo/AdobeSignAlternative';
import DropboxSignAlternative from './pages/seo/DropboxSignAlternative';
import SignNowAlternative from './pages/seo/SignNowAlternative';
import DocuSignCheaperAlternative from './pages/seo/DocuSignCheaperAlternative';
import FreeDocuSignAlternative from './pages/seo/FreeDocuSignAlternative';
import LawFirmESignature from './pages/seo/LawFirmESignature';
import AIWorkflowAudit from './pages/AIWorkflowAudit';
// Vertical Landing Pages (Phase 2)
import LawVerticalPage from './pages/LawVerticalPage';
import RealEstateVerticalPage from './pages/RealEstateVerticalPage';
import ConstructionVerticalPage from './pages/ConstructionVerticalPage';
import StaffingVerticalPage from './pages/StaffingVerticalPage';
import InsuranceVerticalPage from './pages/InsuranceVerticalPage';
import MortgageVerticalPage from './pages/MortgageVerticalPage';
import AccountingVerticalPage from './pages/AccountingVerticalPage';
import HealthcareVerticalPage from './pages/HealthcareVerticalPage';
import RealEstateESignature from './pages/seo/RealEstateESignature';
import HRESignature from './pages/seo/HRESignature';
import SmallBusinessESignature from './pages/seo/SmallBusinessESignature';
import FreelancerESignature from './pages/seo/FreelancerESignature';
import HealthcareESignature from './pages/seo/HealthcareESignature';
import InsuranceESignature from './pages/seo/InsuranceESignature';
import MortgageESignature from './pages/seo/MortgageESignature';
import AccountingESignature from './pages/seo/AccountingESignature';
import ConsultingESignature from './pages/seo/ConsultingESignature';
import DocuSignTooExpensive from './pages/seo/DocuSignTooExpensive';
import CutDocuSignCosts from './pages/seo/CutDocuSignCosts';
import ReplaceDocuSignSmallBusiness from './pages/seo/ReplaceDocuSignSmallBusiness';
import DocuSignPriceIncrease from './pages/seo/DocuSignPriceIncrease';
import AIDocumentSigning from './pages/seo/AIDocumentSigning';
import OnlineContractSigning from './pages/seo/OnlineContractSigning';
import ElectronicSignatureSoftware from './pages/seo/ElectronicSignatureSoftware';
import DigitalSignatureSoftware from './pages/seo/DigitalSignatureSoftware';
import WarModeDashboard from './pages/WarModeDashboard';

function Router() {
  const [location] = useLocation();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={MarketingHome} />
      <Route path="/features" component={Features} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/security" component={Security} />
      <Route path="/onboarding" component={OnboardingPage} />
      <Route path="/dashboard" component={Dashboard} />
          <Route path="/subscription" component={SubscriptionManagement} />
          <Route path="/ai-generator" component={AIDocumentQuestionnaire} />
          <Route path="/documents" component={DocumentList} />
      <Route path="/upload" component={UploadDocument} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/enterprise" component={EnterprisePage} />
          <Route path="/contact" component={Contact} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/checkout/complete" component={CheckoutComplete} />
      <Route path="/checkout/success" component={OrderConfirmation} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/document/:id" component={DocumentEditor} />
      <Route path="/documents/:id" component={DocumentEditor} />
      <Route path="/documents/:id/edit" component={DocumentEditor} />
      <Route path="/generate" component={GenerateDocument} />
      <Route path="/templates" component={Templates} />
      <Route path="/template-library" component={TemplateLibrary} />
      <Route path="/generate/:documentId" component={GenerateDocument} />
      <Route path="/faq" component={FAQ} />
      <Route path="/comparison" component={Comparison} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/profile" component={Profile} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/about" component={About} />
      <Route path="/trust" component={Trust} />
      <Route path="/compliance" component={Compliance} />
      <Route path="/help" component={Help} />
      <Route path="/docs" component={Docs} />
      <Route path="/credits" component={Credits} />
      <Route path="/sign/:token" component={RecipientPortal} />
      <Route path="/executive-dashboard" component={Admin} />
      <Route path="/admin-management" component={AdminManagement} />
      
      {/* VIRAL TOOLS - Free traffic generators */}
      <Route path="/industries" component={Industries} />
      <Route path="/industries/:industry" component={IndustryPage} />
      <Route path="/tools/contract-generator" component={ContractGenerator} />
      <Route path="/tools/invoice-generator" component={InvoiceGenerator} />
      
      {/* SEO COMPARISON PAGES - High-intent keywords */}
      <Route path="/compare/docusign" component={DocuSignComparison} />
      <Route path="/compare/hellosign" component={HelloSignComparison} />
      <Route path="/compare/adobe-sign" component={AdobeSignComparison} />
      <Route path="/compare/pandadoc" component={PandaDocComparison} />
      <Route path="/alternatives/docusign" component={DocuSignAlternatives} />
      

      {/* INDUSTRY LANDING PAGES - High-intent SEO */}
      <Route path="/real-estate-document-automation" component={() => <IndustryLandingPage config={industryConfigs["real-estate-document-automation"]} />} />
      <Route path="/lease-agreement-generator" component={() => <IndustryLandingPage config={industryConfigs["lease-agreement-generator"]} />} />
      <Route path="/real-estate-esignature" component={() => <IndustryLandingPage config={industryConfigs["real-estate-esignature"]} />} />
      <Route path="/offer-letter-generator" component={() => <IndustryLandingPage config={industryConfigs["offer-letter-generator"]} />} />
      <Route path="/employee-onboarding-documents" component={() => <IndustryLandingPage config={industryConfigs["employee-onboarding-documents"]} />} />
      <Route path="/employment-contract-esignature" component={() => <IndustryLandingPage config={industryConfigs["employment-contract-esignature"]} />} />
      <Route path="/construction-contract-template" component={() => <IndustryLandingPage config={industryConfigs["construction-contract-template"]} />} />
      <Route path="/contractor-estimate-generator" component={() => <IndustryLandingPage config={industryConfigs["contractor-estimate-generator"]} />} />
      <Route path="/change-order-form-generator" component={() => <IndustryLandingPage config={industryConfigs["change-order-form-generator"]} />} />
      <Route path="/engagement-letter-generator" component={() => <IndustryLandingPage config={industryConfigs["engagement-letter-generator"]} />} />
      <Route path="/tax-client-intake-forms" component={() => <IndustryLandingPage config={industryConfigs["tax-client-intake-forms"]} />} />
      <Route path="/accounting-esignature-software" component={() => <IndustryLandingPage config={industryConfigs["accounting-esignature-software"]} />} />
      <Route path="/medical-consent-form-generator" component={() => <IndustryLandingPage config={industryConfigs["medical-consent-form-generator"]} />} />
      <Route path="/patient-intake-form-automation" component={() => <IndustryLandingPage config={industryConfigs["patient-intake-form-automation"]} />} />
      <Route path="/insurance-application-automation" component={() => <IndustryLandingPage config={industryConfigs["insurance-application-automation"]} />} />
      <Route path="/broker-agreement-generator" component={() => <IndustryLandingPage config={industryConfigs["broker-agreement-generator"]} />} />
      {/* Logistics Industry Pages */}
      {/* E-Commerce Industry Pages */}
      {/* Finance Industry Pages */}
      {/* Legal Industry Pages */}

      {/* COMPETITOR CAPTURE PAGES - High-conversion */}
      <Route path="/docusign-alternative" component={() => <CompetitorCapturePage config={competitorConfigs["docusign-alternative"]} />} />
      <Route path="/pandadoc-alternative" component={() => <CompetitorCapturePage config={competitorConfigs["pandadoc-alternative"]} />} />
      <Route path="/hellosign-alternative" component={() => <CompetitorCapturePage config={competitorConfigs["hellosign-alternative"]} />} />
      <Route path="/cut-docusign-costs" component={() => <CompetitorCapturePage config={competitorConfigs["cut-docusign-costs"]} />} />
      <Route path="/replace-docusign-for-small-business" component={() => <CompetitorCapturePage config={competitorConfigs["replace-docusign-for-small-business"]} />} />

      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
        <Route path="/logistics-contract-management" element={<IndustryLandingPage config={industryConfigs["logistics-contract-management"]} />} />
        <Route path="/logistics-bill-of-lading-signature" element={<IndustryLandingPage config={industryConfigs["logistics-bill-of-lading-signature"]} />} />
        <Route path="/logistics-vendor-agreements" element={<IndustryLandingPage config={industryConfigs["logistics-vendor-agreements"]} />} />
        <Route path="/logistics-driver-agreements" element={<IndustryLandingPage config={industryConfigs["logistics-driver-agreements"]} />} />
        <Route path="/ecommerce-vendor-contracts" element={<IndustryLandingPage config={industryConfigs["ecommerce-vendor-contracts"]} />} />
        <Route path="/ecommerce-influencer-agreements" element={<IndustryLandingPage config={industryConfigs["ecommerce-influencer-agreements"]} />} />
        <Route path="/ecommerce-supplier-contracts" element={<IndustryLandingPage config={industryConfigs["ecommerce-supplier-contracts"]} />} />
        <Route path="/ecommerce-order-terms" element={<IndustryLandingPage config={industryConfigs["ecommerce-order-terms"]} />} />
        <Route path="/finance-client-agreements" element={<IndustryLandingPage config={industryConfigs["finance-client-agreements"]} />} />
        <Route path="/finance-loan-documents" element={<IndustryLandingPage config={industryConfigs["finance-loan-documents"]} />} />
        <Route path="/finance-compliance-documents" element={<IndustryLandingPage config={industryConfigs["finance-compliance-documents"]} />} />
        <Route path="/finance-investor-agreements" element={<IndustryLandingPage config={industryConfigs["finance-investor-agreements"]} />} />
        <Route path="/legal-client-engagement" element={<IndustryLandingPage config={industryConfigs["legal-client-engagement"]} />} />
        <Route path="/legal-retainer-agreements" element={<IndustryLandingPage config={industryConfigs["legal-retainer-agreements"]} />} />
        <Route path="/legal-document-signing" element={<IndustryLandingPage config={industryConfigs["legal-document-signing"]} />} />
        <Route path="/legal-contract-automation" element={<IndustryLandingPage config={industryConfigs["legal-contract-automation"]} />} />
            <Route path="/war-mode" element={<WarModeDashboard />} />
    
      {/* Programmatic SEO Routes */}
      <Route path="/compare/dropbox-sign" component={DropboxSignComparison} />
      <Route path="/compare/signnow" component={SignNowComparison} />
      <Route path="/compare/docusign-business" component={DocuSignBusinessComparison} />
      <Route path="/adobe-sign-alternative" component={AdobeSignAlternative} />
      <Route path="/dropbox-sign-alternative" component={DropboxSignAlternative} />
      <Route path="/signnow-alternative" component={SignNowAlternative} />
      <Route path="/docusign-cheaper-alternative" component={DocuSignCheaperAlternative} />
      <Route path="/free-docusign-alternative" component={FreeDocuSignAlternative} />
      <Route path="/e-signature-for-law-firms" component={LawFirmESignature} />
      <Route path="/ai-workflow-audit" component={AIWorkflowAudit} />
      <Route path="/ai-for-law-firms" component={LawVerticalPage} />
      <Route path="/ai-for-real-estate" component={RealEstateVerticalPage} />
      <Route path="/ai-for-construction" component={ConstructionVerticalPage} />
      <Route path="/ai-for-staffing" component={StaffingVerticalPage} />
      <Route path="/ai-for-insurance" component={InsuranceVerticalPage} />
      <Route path="/ai-for-mortgage" component={MortgageVerticalPage} />
      <Route path="/ai-for-accounting" component={AccountingVerticalPage} />
      <Route path="/ai-for-healthcare" component={HealthcareVerticalPage} />
      <Route path="/e-signature-for-real-estate" component={RealEstateESignature} />
      <Route path="/e-signature-for-hr" component={HRESignature} />
      <Route path="/e-signature-for-small-business" component={SmallBusinessESignature} />
      <Route path="/e-signature-for-freelancers" component={FreelancerESignature} />
      <Route path="/e-signature-for-healthcare" component={HealthcareESignature} />
      <Route path="/e-signature-for-insurance" component={InsuranceESignature} />
      <Route path="/e-signature-for-mortgage" component={MortgageESignature} />
      <Route path="/e-signature-for-accounting" component={AccountingESignature} />
      <Route path="/e-signature-for-consulting" component={ConsultingESignature} />
      <Route path="/docusign-too-expensive" component={DocuSignTooExpensive} />
      <Route path="/docusign-price-increase" component={DocuSignPriceIncrease} />
      <Route path="/ai-document-signing" component={AIDocumentSigning} />
      <Route path="/online-contract-signing" component={OnlineContractSigning} />
      <Route path="/electronic-signature-software" component={ElectronicSignatureSoftware} />
      <Route path="/digital-signature-software" component={DigitalSignatureSoftware} />
</Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <GA4TrackingProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </GA4TrackingProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
