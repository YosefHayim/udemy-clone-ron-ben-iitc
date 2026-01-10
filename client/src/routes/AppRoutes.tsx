import { Route, Routes } from "react-router-dom";

import AccountSecurity from "@/pages/ProfilePage/SwitchPagesProfile/AccountSecurity";
import ApiClients from "@/pages/ProfilePage/SwitchPagesProfile/ApiClients";
import CloseAccount from "@/pages/ProfilePage/SwitchPagesProfile/CloseAccount";
import EnrollFreeCourse from "@/pages/EnrollFreeCourse/EnrollFreeCourse";
import Footer from "../pages/Home/Footer/Footer";
import Homepage from "@/pages/Home/Homepage";
import InstructorProfile from "@/pages/InstructorProfile/InstructorProfile";
import LessonPage from "../pages/Lesson/LessonPage";
import Loader from "@/components/Loader/Loader";
import Login from "@/pages/Login/Login";
import Logout from "@/pages/Logout/Logout";
import Messages from "@/pages/Messages/Messages";
import Navbar from "@/components/Navbar/Navbar";
import NotFound from "../pages/404/NotFound";
import NotificationPreferences from "@/pages/ProfilePage/SwitchPagesProfile/NotificationPreferences";
import OrganizationLogin from "@/pages/OrganizationLogin/OrganizationLogin";
import Payment from "@/pages/Payment/Payment";
import PaymentMethods from "@/components/Navbar/DropDownMenu/PaymentMethods/PaymentMethods";
import PersonalPlan from "@/pages/PersonalPlan/PersonalPlan";
import PersonalizeField from "@/pages/PersonalizeField/PersonalizeField";
import Photo from "@/pages/ProfilePage/SwitchPagesProfile/Photo";
import Privacy from "@/pages/ProfilePage/SwitchPagesProfile/Privacy";
import ProfilePage from "@/pages/ProfilePage/ProfilePage";
import Promotions from "../pages/Terms/TermsPages/Promotions";
import PublicProfile from "@/components/Navbar/DropDownMenu/PublicProfile/PublicProfile";
import PurchaseHistory from "@/components/Navbar/DropDownMenu/PurchaseHistory/PurchaseHistory";
import ReceiptCart from "@/components/Navbar/DropDownMenu/PurchaseHistory/ReceiptCart/ReceiptCart";
import SearchNotFound from "@/pages/Search/SearchNotFound/SearchNotFound";
import SearchPage from "@/pages/Search/SearchPage";
import ShoppingCart from "@/pages/ShoppingCart/ShoppingCart";
import SignUp from "@/pages/SignUp/Signup";
import SignUpOrganization from "@/pages/SignUpOrganization/SignUpOrganization";
import Subscription from "@/components/Navbar/DropDownMenu/Subscription/Subscription";
import Terms from "../pages/Terms/Terms";
import UdemyBusinessContact from "@/components/Navbar/DropDownMenu/UdemyBusinessContact/UdemyBusinessContact";
import UdemyCredits from "@/components/Navbar/DropDownMenu/UdemyCredits/UdemyCredits";
import VerifyCode from "../pages/VerifyCode/VerifyCode";
import ViewCoursePageInfo from "@/pages/ViewCoursePageInfo/ViewCoursePageInfo";
import Wishlist from "@/pages/Wishlist/Wishlist";

const LayoutWithNavbarAndFooter = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/dashboard/credit-history" element={<UdemyCredits />} />
        <Route path="/user/edit-profile" element={<ProfilePage />} />
        <Route path="/user/edit-privacy" element={<Privacy />} />
        <Route path="/dashboard/purchase-history/" element={<PurchaseHistory />} />
        <Route path="/user/manage-subscriptions/" element={<Subscription />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/dashboard/cart-receipt/" element={<ReceiptCart />} />
        <Route path="/user/public-profile" element={<PublicProfile />} />
        <Route path="/user/edit-account" element={<AccountSecurity />} />
        <Route path="/user/close-account" element={<CloseAccount />} />
        <Route path="/cart/subscribe/course/:courseId" element={<EnrollFreeCourse />} />
        <Route path="/user/photo" element={<Photo />} />
        <Route path="/user/edit-api-clients" element={<ApiClients />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/message" element={<Messages />} />
        <Route path="/loader" element={<Loader useSmallLoading={false} hSize="" />} />
        <Route path="/user/edit-notifications/" element={<NotificationPreferences />} />
        <Route path="/user/edit-payment-methods/" element={<PaymentMethods />} />
        <Route path="/user/instructor/:instructorId" element={<InstructorProfile />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/Signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/courses/search" element={<SearchPage />} />
        <Route path="/not/search/not/found/:searchTerm" element={<SearchNotFound />} />
        <Route path="/course-view/:courseId" element={<ViewCoursePageInfo />} />
        <Route path="/terms-of-use" element={<Terms />} />
        <Route path="/personal-plan/local=en_US" element={<PersonalPlan />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
};

const AppRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        {/* Routes that use Navbar and Footer */}
        <Route path="*" element={<LayoutWithNavbarAndFooter />} />
        {/* Routes without Navbar */}
        <Route path="/demo-business" element={<UdemyBusinessContact />} />
        <Route path="/payment/checkout/" element={<Payment />} />
        <Route path="/course/:courseId/lesson/:id/*" element={<LessonPage />} />
        <Route path="/personalize/field/" element={<PersonalizeField />} />
        <Route path="/terms/promotions" element={<Promotions />} />
        <Route path="/organization/global-login/email" element={<OrganizationLogin />} />
        <Route path="hc/en-us/requests/new/ticket_form_id" element={<SignUpOrganization />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
