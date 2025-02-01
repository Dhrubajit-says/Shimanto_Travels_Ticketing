import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './components/auth/Login';
import PrivateRoute from './utils/PrivateRoute';
import AdminDashboard from './components/admin/AdminDashboard';
import UserDashboard from './components/user/UserDashboard';
import CreateTrip from './components/admin/CreateTrip';
import ViewSchedule from './components/admin/ViewSchedule';
import CreateCounter from './components/admin/CreateCounter';
import ViewCounters from './components/admin/ViewCounters';
import BookTicket from './components/user/BookTicket';
import BookingHistory from './components/admin/BookingHistory';
import AdminProfile from './components/admin/AdminProfile';
import CounterManagement from './components/admin/CounterManagement';
import UserProfile from './components/user/UserProfile';
import MyBookings from './components/user/MyBookings';

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Protected Admin Routes */}
          <Route element={<PrivateRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/create-trip" element={<CreateTrip />} />
            <Route path="/admin/schedule" element={<ViewSchedule />} />
            <Route path="/admin/create-counter" element={<CreateCounter />} />
            <Route path="/admin/counters" element={<ViewCounters />} />
            <Route path="/admin/booking-history" element={<BookingHistory />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/admin/counters" element={<CounterManagement />} />
            {/* Add more admin routes here */}
          </Route>

          {/* Protected User Routes */}
          <Route element={<PrivateRoute allowedRoles={['user']} />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/book-ticket" element={<BookTicket />} />
            <Route path="/user/profile" element={<UserProfile />} />
            <Route path="/user/my-bookings" element={<MyBookings />} />
            {/* Add more user routes here */}
          </Route>

          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
