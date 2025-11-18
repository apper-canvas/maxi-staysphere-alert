import { createBrowserRouter } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import Layout from "@/components/organisms/Layout";

const Home = lazy(() => import("@/components/pages/Home"));
const PropertyDetails = lazy(() => import("@/components/pages/PropertyDetails"));
const SearchResults = lazy(() => import("@/components/pages/SearchResults"));
const HostProfile = lazy(() => import("@/components/pages/HostProfile"));
const HostManagement = lazy(() => import("@/components/pages/HostManagement"));
const AddProperty = lazy(() => import("@/components/pages/AddProperty"));
const Messages = lazy(() => import("@/components/pages/Messages"));
const Conversation = lazy(() => import("@/components/pages/Conversation"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600">
    </div>
  </div>
);

const mainRoutes = [
  {
    path: "",
    index: true,
    element: <Suspense fallback={<LoadingSpinner />}><Home /></Suspense>
  },
  {
    path: "search",
    element: <Suspense fallback={<LoadingSpinner />}><SearchResults /></Suspense>
  },
  {
    path: "property/:id",
    element: <Suspense fallback={<LoadingSpinner />}><PropertyDetails /></Suspense>
  },
  {
    path: "add-property",
    element: <Suspense fallback={<LoadingSpinner />}><AddProperty /></Suspense>
  },
  {
    path: "host/:hostId",
    element: <Suspense fallback={<LoadingSpinner />}><HostProfile /></Suspense>
  },
  {
    path: "host-management/:hostId",
    element: <Suspense fallback={<LoadingSpinner />}><HostManagement /></Suspense>
  },
  {
    path: "messages",
    element: <Suspense fallback={<LoadingSpinner />}><Messages /></Suspense>
  },
  {
    path: "messages/:bookingId",
    element: <Suspense fallback={<LoadingSpinner />}><Conversation /></Suspense>
  },
  {
    path: "*",
    element: <Suspense fallback={<LoadingSpinner />}><NotFound /></Suspense>
  }
];

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [...mainRoutes],
  },
];

export const router = createBrowserRouter(routes);