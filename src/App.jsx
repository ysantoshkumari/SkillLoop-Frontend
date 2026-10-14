import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import "./App.css";

const initialSkills = [
  { id: 1, name: "Java Programming", category: "Programming", teacher: "Rahul", level: "Intermediate" },
  { id: 2, name: "Web Development", category: "Development", teacher: "Priya", level: "Beginner" },
  { id: 3, name: "Python", category: "Programming", teacher: "Arjun", level: "Advanced" },
  { id: 4, name: "UI/UX Design", category: "Design", teacher: "Meera", level: "Intermediate" }
];

function Navbar() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("skillloopUser") || "null");
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const updateUser = () => {
      try {
        setUser(JSON.parse(localStorage.getItem("skillloopUser") || "null"));
      } catch {
        setUser(null);
      }
    };

    window.addEventListener("skillloop-auth-change", updateUser);
    return () => window.removeEventListener("skillloop-auth-change", updateUser);
  }, []);

  function logout() {
    localStorage.removeItem("skillloopUser");
    setUser(null);
    window.dispatchEvent(new Event("skillloop-auth-change"));
  }

  return (
    <header className="navbar">
      <Link className="brand" to="/">Skill<span>Loop</span></Link>
      <nav>
        <Link to="/">Home</Link>
        {user && <Link to="/dashboard">Dashboard</Link>}
        <Link to="/discover">Discover Skills</Link>
        {user ? (
          <>
            <span>Hi, {user.name || user.email}!</span>
            <button className="button secondary" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </nav>
    </header>
  );
}
function Sidebar() {
  const links = [
    ["Dashboard", "/dashboard"],
    ["My Profile", "/profile"],
    ["Discover Skills", "/discover"],
    ["Skill Requests", "/requests"],
    ["Projects & Challenges", "/projects"],
    ["Notifications", "/notifications"],
    ["Skill Passport", "/passport"],
    ["Skill Credits", "/credits"]
  ];

  return (
    <aside className="sidebar">
      <p className="sidebar-title">YOUR WORKSPACE</p>
      {links.map(([label, path]) => (
        <Link key={path} to={path}>{label}</Link>
      ))}
    </aside>
  );
}

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <div className="workspace">
        <Sidebar />
        <main className="content">{children}</main>
      </div>
    </>
  );
}

function Home() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("skillloopUser") || "null");
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const updateUser = () => {
      try {
        setUser(JSON.parse(localStorage.getItem("skillloopUser") || "null"));
      } catch {
        setUser(null);
      }
    };

    window.addEventListener("skillloop-auth-change", updateUser);
    return () => window.removeEventListener("skillloop-auth-change", updateUser);
  }, []);

  return (
    <div className="hero">
      <div className="hero-badge">LEARN • TEACH • BUILD • VERIFY</div>
      <h1>
        {user ? (
          <>Welcome back, <span>{user.name || user.email}!</span></>
        ) : (
          <>Your skills can take you <span>further.</span></>
        )}
      </h1>
      <p>
        Learn from fellow students, share what you know, collaborate on projects,
        and build a portfolio of verified achievements.
      </p>
      <div className="hero-actions">
        {user ? (
          <Link className="button primary" to="/dashboard">Go to Dashboard</Link>
        ) : (
          <>
            <Link className="button primary" to="/get-started">Get Started</Link>
            <Link className="button secondary" to="/discover">Explore Skills</Link>
          </>
        )}
      </div>
      <div className="hero-stats">
        <div><strong>Learn</strong><small>Discover new skills</small></div>
        <div><strong>Teach</strong><small>Share your knowledge</small></div>
        <div><strong>Build</strong><small>Make real projects</small></div>
      </div>
    </div>
  );
}
function AuthChoice() {
  return (
    <div className="auth-page">
      <div className="form-card auth-card">
        <Link className="brand" to="/">Skill<span>Loop</span></Link>
        <h1>Welcome to SkillLoop!</h1>
        <p className="muted">
          Learn new skills, teach others, and grow together.
        </p>

        <Link className="button primary" to="/login">
          Login
        </Link>

        <Link className="button secondary" to="/signup">
          Create an Account
        </Link>

        <p className="muted">
          Join a community where students learn from each other.
        </p>

        <Link to="/">Back to Home</Link>
      </div>
    </div>
  );
}
function Dashboard() {
  const cards = [
    ["My Profile", "Manage your skills and learning goals.", "/profile"],
    ["Discover Skills", "Find students who can teach you.", "/discover"],
    ["Skill Requests", "Manage your exchange requests.", "/requests"],
    ["Projects & Challenges", "Collaborate and put skills into practice.", "/projects"],
    ["Skill Passport", "Showcase your learning journey.", "/passport"],
    ["Skill Credits", "Review your learning credits.", "/credits"]
  ];

  return (
    <Layout>
      <p className="eyebrow">YOUR WORKSPACE</p>
      <h1>Welcome to SkillLoop ??</h1>
      <p className="muted">Your learning journey starts with one small step.</p>
      <div className="stat-grid">
        <Stat label="Skills Explored" value="04" />
        <Stat label="Active Requests" value="00" />
        <Stat label="Projects" value="00" />
        <Stat label="Skill Credits" value="00" />
      </div>
      <h2 className="section-heading">Explore your workspace</h2>
      <div className="card-grid">
        {cards.map(([title, description, path]) => (
          <Link className="feature-card" to={path} key={title}>
            <h3>{title} ?</h3>
            <p>{description}</p>
          </Link>
        ))}
      </div>
    </Layout>
  );
}

function Stat({ label, value }) {
  return <div className="stat-card"><strong>{value}</strong><span>{label}</span></div>;
}

function DiscoverSkills() {
  const [skills, setSkills] = useState(initialSkills);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  function sendRequest(skill) {
    const saved = JSON.parse(localStorage.getItem("skillloop_demo_requests") || "[]");
    saved.push({ id: Date.now(), skill: skill.name, teacher: skill.teacher, status: "Pending" });
    localStorage.setItem("skillloop_demo_requests", JSON.stringify(saved));
    setMessage(`Demo request created for ${skill.name}.`);
  }

  return (
    <Layout>
      <p className="eyebrow">FIND YOUR NEXT SKILL</p>
      <h1>Discover Skills</h1>
      <p className="muted">Explore what other students can teach you.</p>
      <input className="search-input" placeholder="Search skills or categories..." value={search} onChange={e => setSearch(e.target.value)} />
      {message && <p className="success-message">{message}</p>}
      <div className="card-grid">
        {skills.filter(s => `${s.name} ${s.category} ${s.teacher}`.toLowerCase().includes(search.toLowerCase())).map(skill => (
          <article className="feature-card" key={skill.id}>
            <span className="tag">{skill.category}</span>
            <h3>{skill.name}</h3>
            <p>Teacher: {skill.teacher}</p>
            <p>Level: {skill.level}</p>
            <button className="button primary" onClick={() => sendRequest(skill)}>Request to Learn</button>
          </article>
        ))}
      </div>
    </Layout>
  );
}

function MyProfile() {
  const [profile, setProfile] = useState(() => JSON.parse(localStorage.getItem("skillloop_demo_profile") || '{"name":"","course":"","teach":"","learn":""}'));
  const [message, setMessage] = useState("");

  function save(e) {
    e.preventDefault();
    localStorage.setItem("skillloop_demo_profile", JSON.stringify(profile));
    setMessage("Demo profile saved in this browser.");
  }

  return (
    <Layout>
      <h1>My Profile</h1>
      <p className="muted">Tell the community what you know and what you want to learn.</p>
      <form className="form-card" onSubmit={save}>
        <label>Full name<input required value={profile.name} onChange={e => setProfile({...profile, name:e.target.value})} /></label>
        <label>Course / Department<input value={profile.course} onChange={e => setProfile({...profile, course:e.target.value})} /></label>
        <label>Skills I can teach<input value={profile.teach} onChange={e => setProfile({...profile, teach:e.target.value})} placeholder="Java, design, communication..." /></label>
        <label>Skills I want to learn<input value={profile.learn} onChange={e => setProfile({...profile, learn:e.target.value})} placeholder="Python, web development..." /></label>
        <button className="button primary">Save Profile</button>
        {message && <p className="success-message">{message}</p>}
      </form>
    </Layout>
  );
}

function SkillRequests() {
  const [requests, setRequests] = useState(() => JSON.parse(localStorage.getItem("skillloop_demo_requests") || "[]"));

  function update(id, status) {
    const next = requests.map(r => r.id === id ? {...r, status} : r);
    setRequests(next);
    localStorage.setItem("skillloop_demo_requests", JSON.stringify(next));
  }

  return (
    <Layout>
      <h1>Skill Exchange Requests</h1>
      <p className="muted">Requests created from Discover Skills appear here.</p>
      {requests.length === 0 ? <Empty text="No requests yet. Discover a skill to get started." /> :
        requests.map(r => (
          <article className="list-card" key={r.id}>
            <div><h3>{r.skill}</h3><p>Teacher: {r.teacher} ï¿½ Status: {r.status}</p></div>
            {r.status === "Pending" && <div className="inline-actions"><button className="button secondary" onClick={() => update(r.id, "Cancelled")}>Cancel</button></div>}
          </article>
        ))}
    </Layout>
  );
}

function ProjectsChallenges() {
  const [projects, setProjects] = useState(() => JSON.parse(localStorage.getItem("skillloop_demo_projects") || '[{"id":1,"title":"Build a Portfolio","description":"Create a personal portfolio website."},{"id":2,"title":"Coding Challenge","description":"Solve a programming problem and explain your approach."}]'));
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function add(e) {
    e.preventDefault();
    const next = [...projects, {id:Date.now(), title, description}];
    setProjects(next);
    localStorage.setItem("skillloop_demo_projects", JSON.stringify(next));
    setTitle("");
    setDescription("");
  }

  function remove(id) {
    const next = projects.filter(p => p.id !== id);
    setProjects(next);
    localStorage.setItem("skillloop_demo_projects", JSON.stringify(next));
  }

  return (
    <Layout>
      <h1>Projects & Challenges</h1>
      <p className="muted">Learn by building, experimenting, and collaborating.</p>
      <form className="form-card" onSubmit={add}>
        <h2>Create a project</h2>
        <label>Project title<input required value={title} onChange={e => setTitle(e.target.value)} /></label>
        <label>Description<textarea required value={description} onChange={e => setDescription(e.target.value)} /></label>
        <button className="button primary">Add Project</button>
      </form>
      {projects.map(p => <article className="list-card" key={p.id}><div><h3>{p.title}</h3><p>{p.description}</p></div><button className="button secondary" onClick={() => remove(p.id)}>Delete</button></article>)}
    </Layout>
  );
}

function Notifications() {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem("skillloop_demo_notifications") || '[{"id":1,"text":"Welcome to SkillLoop! Explore the skills shared by students.","read":false}]'));

  function markRead(id) {
    const next = items.map(n => n.id === id ? {...n, read:true} : n);
    setItems(next);
    localStorage.setItem("skillloop_demo_notifications", JSON.stringify(next));
  }

  return (
    <Layout>
      <h1>Notifications</h1>
      {items.map(n => <article className="list-card" key={n.id}><div><p>{n.text}</p><span className="tag">{n.read ? "Read" : "Unread"}</span></div>{!n.read && <button className="button secondary" onClick={() => markRead(n.id)}>Mark as read</button>}</article>)}
    </Layout>
  );
}

function SkillPassport() {
  return (
    <Layout>
      <p className="eyebrow">YOUR LEARNING JOURNEY</p>
      <h1>Skill Passport</h1>
      <p className="muted">A place to showcase completed projects, challenges, assessments, and feedback.</p>
      <div className="card-grid">
        <article className="feature-card"><h3>?? Projects</h3><p>Completed projects will be recorded here when backend integration is added.</p></article>
        <article className="feature-card"><h3>?? Challenges</h3><p>Your challenge progress will appear here.</p></article>
        <article className="feature-card"><h3>? Assessments</h3><p>Assessment results and qualifications will appear here.</p></article>
      </div>
    </Layout>
  );
}

function SkillCredits() {
  const [transactions] = useState(() => JSON.parse(localStorage.getItem("skillloop_demo_credit_transactions") || "[]"));
  return (
    <Layout>
      <p className="eyebrow">LEARN AND SHARE</p>
      <h1>Skill Credits</h1>
      <div className="credit-panel"><span>Demo balance</span><strong>0 credits</strong><p>In the full application, credits will be earned by teaching and spent on learning sessions.</p></div>
      <h2 className="section-heading">Transaction history</h2>
      {transactions.length === 0 ? <Empty text="No transactions yet. Credit tracking will be connected to the backend." /> : transactions.map((t,i) => <article className="list-card" key={i}>{t.description}: {t.amount}</article>)}
    </Layout>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setMessage("");
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email.trim(),
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed.");
      }

      localStorage.setItem("skillloopUser", JSON.stringify(data));
      setSuccess(true);
      setMessage("Login successful! Welcome back.");

      navigate("/");
    } catch (error) {
      if (error instanceof TypeError) {
        setMessage("Cannot connect to the server. Check that the backend is running.");
      } else {
        setMessage(error.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="form-card auth-card" onSubmit={submit}>
        <Link className="brand" to="/">
          Skill<span>Loop</span>
        </Link>

        <h1>Welcome Back!</h1>
        <p className="muted">
          Login to continue your learning journey.
        </p>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>

        <button className="button primary" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && (
          <p
            className={success ? "success-message" : "notice-message"}
            role="status"
          >
            {message}
          </p>
        )}

        <p>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>

        <p>
          <Link to="/get-started">Back</Link>
        </p>
      </form>
    </div>
  );
}
function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function submit(e) {
    e.preventDefault();

    setMessage("");
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Account creation failed.");
      }

      setSuccess(true);
      setMessage("Account created successfully! Welcome to SkillLoop.");

      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      setSuccess(false);

      if (error instanceof TypeError) {
        setMessage(
          "Cannot connect to the server. Please check that the backend is running."
        );
      } else {
        setMessage(error.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="form-card auth-card" onSubmit={submit}>
        <Link className="brand" to="/">
          Skill<span>Loop</span>
        </Link>

        <h1>Create your account</h1>

        <p className="muted">
          Join a community where students teach and learn together.
        </p>

        <label>
          Full name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={100}
            autoComplete="name"
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            maxLength={150}
            autoComplete="email"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
            autoComplete="new-password"
          />
        </label>

        <button
          className="button primary"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        {message && (
          <p
            className={success ? "success-message" : "notice-message"}
            role="status"
          >
            {message}
          </p>
        )}

        <p>
          Already registered? <Link to="/login">Login</Link>
        </p>

        <p>
          <Link to="/get-started">Back</Link>
        </p>
      </form>
    </div>
  );
}

function Empty({ text }) {
  return <div className="empty-state"><p>{text}</p></div>;
}

function NotFound() {
  return <Layout><h1>Page not found</h1><Link to="/dashboard">Return to Dashboard</Link></Layout>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/get-started" element={<AuthChoice />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/discover" element={<DiscoverSkills />} />
        <Route path="/requests" element={<SkillRequests />} />
        <Route path="/projects" element={<ProjectsChallenges />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/passport" element={<SkillPassport />} />
        <Route path="/credits" element={<SkillCredits />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
