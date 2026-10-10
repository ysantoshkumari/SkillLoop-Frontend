import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';

function Signup() {
const navigate = useNavigate();


const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);

const handleSignup = async (event) => {
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
        const response = await fetch(
            'http://localhost:5000/api/auth/register',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || 'Signup failed. Please try again.'
            );
        }

        if (data.token) {
            localStorage.setItem('skillloopToken', data.token);
        }

        if (data.user) {
            localStorage.setItem(
                'skillloopUser',
                JSON.stringify(data.user)
            );
        }

        navigate('/login');
    } catch (error) {
        setError(
            error.message || 'Unable to connect to the server.'
        );
    } finally {
        setLoading(false);
    }
};

return (
    <div className="signup-page">
        <div className="signup-card">
            <h1>Join SkillLoop</h1>
            <p>Learn skills, share knowledge, and grow together.</p>

            <form onSubmit={handleSignup}>
                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                        required
                    />
                </div>

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
                        placeholder="Create a password (minimum 8 characters)"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        minLength={8}
                        required
                    />
                </div>

                {error && (
                    <p className="error-message" role="alert">
                        {error}
                    </p>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? 'Creating account...' : 'Sign Up'}
                </button>
            </form>

            <p className="signup-footer">
                Already have an account? <Link to="/login">Log in</Link>
            </p>
        </div>
    </div>
);


}

export default Signup;
