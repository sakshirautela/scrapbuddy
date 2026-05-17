export default function validateRegistration(data) {
 const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLinkSent, setIsLinkSent] = useState(false);
   const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');
    setLoading(true);

    try {

      await authApi.forgotPassword(email);

      setMessage('OTP sent successfully to your email');
      setIsLinkSent(true);

    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };
   const handleNavigate = async () => {
    try {

      await authApi.verifyOtp(email, otp);

      navigate('/reset-password', {
        state: { email }
      });

    } catch (err) {
      setError('Invalid OTP');
    }
  };
  return (
    <div>
 {isLinkSent && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="otp-input"
            />

            <button
              type="button"
              onClick={handleNavigate}
              className="verify-btn"
            >
              Verify OTP
            </button>
          </>
        )}
    </div>
  )
}       