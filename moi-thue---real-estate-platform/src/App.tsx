/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import ScrollToTop from '@/components/layout/ScrollToTop';
import BackToTop from '@/components/layout/BackToTop';
import RouteFallback from '@/components/layout/RouteFallback';
import { AuthProvider } from '@/contexts/AuthContext';
import SeoRouteHead from '@/components/seo/SeoRouteHead';

const Home = lazy(() => import('@/pages/Home'));
const Search = lazy(() => import('@/pages/Search'));
const PropertyDetail = lazy(() => import('@/pages/PropertyDetail'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const VerifyEmail = lazy(() => import('@/pages/VerifyEmail'));
const Contact = lazy(() => import('@/pages/Contact'));
const About = lazy(() => import('@/pages/About'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const Profile = lazy(() => import('@/pages/Profile'));
const ManageRentals = lazy(() => import('@/pages/ManageRentals'));
const AdminPostProperty = lazy(() => import('@/pages/AdminPostProperty'));
const AdminBlogList = lazy(() => import('@/pages/AdminBlogList'));
const AdminBlogForm = lazy(() => import('@/pages/AdminBlogForm'));
const AdminContact = lazy(() => import('@/pages/AdminContact'));
const AdminContactMessages = lazy(() => import('@/pages/AdminContactMessages'));
const SavedRentals = lazy(() => import('@/pages/SavedRentals'));
const Notifications = lazy(() => import('@/pages/Notifications'));
const Settings = lazy(() => import('@/pages/Settings'));
const Blog = lazy(() => import('@/pages/Blog'));
const BlogDetail = lazy(() => import('@/pages/BlogDetail'));
const Guide = lazy(() => import('@/pages/Guide'));

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster richColors position="top-center" />
        <SeoRouteHead />
        <ScrollToTop />
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/manage-rentals" element={<ManageRentals />} />
            <Route path="/admin/post-property" element={<AdminPostProperty />} />
            <Route path="/admin/blog" element={<AdminBlogList />} />
            <Route path="/admin/blog/new" element={<AdminBlogForm />} />
            <Route path="/admin/blog/:id/edit" element={<AdminBlogForm />} />
            <Route path="/admin/contact" element={<AdminContact />} />
            <Route path="/admin/contact/messages" element={<AdminContactMessages />} />
            <Route path="/saved" element={<SavedRentals />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/guide" element={<Guide />} />
          </Routes>
        </Suspense>
        <BackToTop />
      </BrowserRouter>
    </AuthProvider>
  );
}
