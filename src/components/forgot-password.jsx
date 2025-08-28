// import React, { useState } from 'react';
// import { sendPasswordResetEmail } from 'firebase/auth';
// import { auth } from '../firebase';
// import { useNavigate } from 'react-router-dom';
// import { Link } from 'react-router-dom';

// const ForgotPassword = () => {
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//   e.preventDefault();
  
//   if (!email) {
//     setError('Email is required');
//     return;
//   }

//   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//     setError('Please enter a valid email address');
//     return;
//   }

//   try {
//     setLoading(true);
//     setError('');
//     setMessage('');
    
//     await sendPasswordResetEmail(auth, email);
//     setMessage(`Password reset email sent to ${email}. Check your inbox (and spam folder).`);
//   } catch (err) {
//     let errorMessage = 'Failed to send reset email. Please try again.';
    
//     // Handle specific Firebase errors
//     if (err.code === 'auth/user-not-found') {
//       errorMessage = 'No account found with this email address.';
//     } else if (err.code === 'auth/too-many-requests') {
//       errorMessage = 'Too many requests. Please try again later.';
//     }
    
//     setError(errorMessage);
//     console.error("Password reset error:", err.code, err.message);
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
//       <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
//         <h1 className="text-2xl font-bold text-center text-red-500 mb-6">Reset Password</h1>
        
//         {message ? (
//           <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
//             {message}
//             <button 
//               onClick={() => navigate('/')}
//               className="mt-4 w-full py-2 px-4 text-white bg-red-500 hover:bg-red-600 rounded-md"
//             >
//               Back to Login
//             </button>
//           </div>
//         ) : (
//           <>
//             <p className="text-sm text-gray-600 mb-6">
//               Enter your email address and we'll send you a link to reset your password.
//             </p>
            
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                   Email Address
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full px-4 py-2 border rounded-md focus:ring-red-500 focus:border-red-500"
//                   required
//                 />
//               </div>
              
//               {error && <p className="text-sm text-red-600">{error}</p>}
              
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`w-full py-2 px-4 text-white rounded-md ${loading ? 'bg-red-400' : 'bg-red-500 hover:bg-red-600'}`}
//               >
//                 {loading ? 'Sending...' : 'Send Reset Link'}
//               </button>
//             </form>
            
//             <div className="mt-4 text-center">
//               <Link 
//                 to="/" 
//                 className="text-sm text-red-500 hover:underline"
//               >
//                 Back to Login
//               </Link>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;

















import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset messages
    setError('');
    setMessage('');
    
    // Validate email
    if (!email) {
      setError('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      
      // Send password reset email
      await sendPasswordResetEmail(auth, email);
      
      // Success message
      setMessage(`Password reset email sent to ${email}. Check your inbox (and spam folder).`);
      setEmail(''); // Clear the email field
    } catch (err) {
      console.error("Password reset error:", err);
      
      // Handle specific Firebase errors
      switch (err.code) {
        case 'auth/user-not-found':
          setError('No account found with this email address.');
          break;
        case 'auth/invalid-email':
          setError('The email address is not valid.');
          break;
        case 'auth/too-many-requests':
          setError('Too many requests. Please try again later.');
          break;
        default:
          setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-red-500 mb-6">Reset Password</h1>
        
        {message ? (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
            {message}
            <button 
              onClick={() => navigate('/login')}
              className="mt-4 w-full py-2 px-4 text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
              
              {error && (
                <div className="p-2 text-sm text-red-600 bg-red-50 rounded-md">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 text-white rounded-md transition-colors ${
                  loading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : 'Send Reset Link'}
              </button>
            </form>
            
            <div className="mt-4 text-center">
              <Link 
                to="/login" 
                className="text-sm text-red-500 hover:underline transition-colors"
              >
                Remember your password? Sign in
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;