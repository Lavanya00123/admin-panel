import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import CallLog from "./components/CallLog"; // Make sure component name is consistent
import Messages from "./components/Messages";
import Location from "./components/Location";
import Header from "./components/Header";
import Employee from "./components/Employee";
import Register from "./components/Register";
import CallLogTable from "./components/CallLogTable";
import CallLogDetails from "./components/CallLogDetails";
import MessageDetails from "./components/MessageDetails";
import AttendanceTable from "./components/AttendanceTable";
import AttendanceDetails from "./components/AttendanceDetails";
import Complaints from "./components/Complaints";
import LeaveForm from "./components/LeaveForm";
import UserRequest from "./components/UserRequest";
import EmployeeDetails from "./components/EmployeeDetails";

// Private Route component (for protected routes)
const PrivateRoute = ({ children }) => {
  const auth = localStorage.getItem("user"); // Check if user is authenticated
  return auth ? children : <Navigate to="/register" />; // If not authenticated, redirect to register
};

function Layout() {
  const location = useLocation(); // This works inside Router
  return (
    <div className="h-screen flex flex-col ">
      {/* Header */}
      <Header />

      <div className="flex flex-1">
        {/* Conditionally render Sidebar only if the current route is not /register */}
        {location.pathname !== "/register" && <Sidebar />}

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
          <Routes>
            {/* Public Routes */}
            <Route path="/register" element={<Register />} />

            {/* Private Routes */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/call-logs"
              element={
                <PrivateRoute>
                  <CallLog /> {/* Ensure this is consistent */}
                </PrivateRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <PrivateRoute>
                  <MessageDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/call-details"
              element={
                <PrivateRoute>
                  <CallLogDetails />
                </PrivateRoute>
              }
            />

            {/* Route for Employee's Call Logs */}
            <Route
              path="/employees/:employeeId/call-logs"
              element={<CallLogTable />}
            />

            {/* Route for Employee's Messages */}
            <Route
              path="/employees/:employeeId/messages"
              element={
                <PrivateRoute>
                  <Messages />
                </PrivateRoute>
              }
            />

            <Route
              path="/location"
              element={
                <PrivateRoute>
                  <Location />
                </PrivateRoute>
              }
            />
            <Route
              path="/employees"
              element={
                <PrivateRoute>
                  <Employee />
                </PrivateRoute>
              }
            />

            <Route
              path="/employees/:employeeId/attendance-list"
              element={<AttendanceTable />}
            />

            <Route path="/attendance-details" element={<AttendanceDetails />} />

            <Route
              path="/employees/:employeeId/attendance-list/complaints"
              element={<Complaints />}
            />

            <Route
              path="/employees/:employeeId/attendance-list/leaves"
              element={<LeaveForm />}
            />

            <Route path="/user-request" element={<UserRequest/>} />

            <Route
              path="/employees/:employeeId/details"
              element={<EmployeeDetails />}
            />

          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
