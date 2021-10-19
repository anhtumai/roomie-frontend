import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  RouteProps,
} from "react-router-dom";
import useAuth, { AuthProvider } from "./contexts/auth";

import "./App.css";
import { NotificationProvider } from "./contexts/notification";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import InvitationPage from "./pages/InvitationPage";

function ContextWrapper() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
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
  return isAuthenticated() ? <Route {...rest} /> : <Redirect to="/login" />;
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
    </Router>
  );
}

export default ContextWrapper;
