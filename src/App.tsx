import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  RouteProps,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";

import useAuth, { AuthProvider } from "./contexts/auth";
import { ApartmentProvider } from "./contexts/apartment";
import { InvitationsProvider } from "./contexts/invitations";

import ChannelToastProvider from "./components/ChannelToastProvider";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import InvitationPage from "./pages/InvitationPage";
import TaskRequestPage from "./pages/TaskRequestPage";
import TaskCollectionPage from "./pages/TaskCollectionPage";
import TaskPage from "./pages/TaskPage";

import "./App.css";
import "react-toastify/dist/ReactToastify.css";

function PublicRoutes() {
  return (
    <Switch>
      <Route exact path="/login">
        <LoginPage />
      </Route>
      <Route exact path="/register">
        <RegisterPage />
      </Route>
      <Route exact path="/">
        <Redirect to="/login" />
      </Route>
    </Switch>
  );
}

function ProtectedRoute({ ...rest }: RouteProps) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated() ? (
    <ApartmentProvider>
      <InvitationsProvider>
        <ChannelToastProvider>
          <Route {...rest} />
        </ChannelToastProvider>
      </InvitationsProvider>
    </ApartmentProvider>
  ) : (
    <Redirect to="/login" />
  );
}

function AppRoutes() {
  return (
    <>
      <Switch>
        <ProtectedRoute exact path="/home">
          <HomePage />
        </ProtectedRoute>
        <ProtectedRoute exact path="/invitations">
          <InvitationPage />
        </ProtectedRoute>
        <ProtectedRoute path="/tasks/:id">
          <TaskPage />
        </ProtectedRoute>
        <ProtectedRoute exact path="/tasks">
          <TaskCollectionPage />
        </ProtectedRoute>
        <ProtectedRoute exact path="/task_requests">
          <TaskRequestPage />
        </ProtectedRoute>
        <PublicRoutes />
      </Switch>
      <ToastContainer />
    </>
  );
}

function ContextWrapper() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default ContextWrapper;
