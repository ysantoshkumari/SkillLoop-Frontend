import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
const navigate = useNavigate();


const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);

const handleLogin = async (event) => {
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
        const response = await fetch(
            'http://localhost:5000/api/auth/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || 'Login failed. Please try again.'
            );
        }

        localStorage.setItem('skillloopToken', data.token);

        if (data.user) {
            localStorage.setItem(
                'skillloopUser',
                JSON.stringify(data.user)
            );
        }

        navigate('/');
    } catch (error) {
        setError(
            error.message || 'Unable to connect to the server.'
        );
    } finally {
        setLoading(false);
    }
};

return (
    <div className="login-page">
        <div className="login-card">
            <h1>Welcome Back!</h1>
            <p>Log in to continue your SkillLoop journey.</p>

            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        required
                    />
                </div>

                {error && (
                    <p className="error-message" role="alert">
                        {error}
                    </p>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <p className="login-footer">
                Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
        </div>
    </div>
);


}

export default Login;
