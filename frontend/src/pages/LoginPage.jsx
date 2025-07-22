import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const email = user.email;

      if (!email.endsWith('@srmist.edu.in')) {
        alert('Only SRM emails are allowed!');
        return;
      }

      const idToken = await user.getIdToken();

      // TODO: send this token to backend for verification
      console.log('Token:', idToken);
      console.log('Logged in:', email);

      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login Page</h2>
      <button onClick={handleLogin}>Sign in with Google</button>
    </div>
  );
}

export default LoginPage;
