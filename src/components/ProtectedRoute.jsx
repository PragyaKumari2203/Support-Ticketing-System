import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [user, loading] = useAuthState(auth);
  const [userRole, setUserRole] = useState(null);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    const verifyRole = async () => {
      if (user) {
        try {
          // Check for agent email first
          if (user.email === "agent@support.com") {
            setUserRole('agent');
            return;
          }
          
          // Check Firestore for role
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role || 'customer');
          } else {
            // Default role for authenticated users
            setUserRole('customer');
          }
        } catch (error) {
          console.error("Role verification failed:", error);
          setUserRole(null);
        } finally {
          setCheckingRole(false);
        }
      }
    };
    verifyRole();
  }, [user]);

  if (loading || checkingRole) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;