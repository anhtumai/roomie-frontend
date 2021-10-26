import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  RouteProps,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";

import useAuth, { AuthProvider } from "./contexts/auth";
import ChannelToastProvider from "./components/ChannelToastProvider";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import InvitationPage from "./pages/InvitationPage";

import "./App.css";
import "react-toastify/dist/ReactToastify.css";

function ContextWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

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
    <ChannelToastProvider>
      <Route {...rest} />
    </ChannelToastProvider>
  ) : (
    <Redirect to="/login" />
  );
}

function App() {
  return (
    <Router>
      <Switch>
        <ProtectedRoute exact path="/home">
          <HomePage />
        </ProtectedRoute>
        <ProtectedRoute exact path="/invitations">
          <InvitationPage />
        </ProtectedRoute>

        <PublicRoutes />
      </Switch>
      <ToastContainer />
    </Router>
  );
}

export default ContextWrapper;
