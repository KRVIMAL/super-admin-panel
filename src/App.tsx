import './App.css';
import ProtectedRoute from './layouts/protected-route.component';
import RolesAndPermissions from './layouts/RolesAndPermissions';
import Login from './screens/login/login.screen';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/clients" replace />} />
        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <RolesAndPermissions />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

