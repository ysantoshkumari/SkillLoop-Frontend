import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const API_URL = 'http://localhost:5000/api';

function Dashboard() {
const navigate = useNavigate();

const [user] = useState(() => {
try {
return JSON.parse(localStorage.getItem('skillloopUser')) || {};
} catch {
return {};
}
});

const [activePage, setActivePage] = useState('Dashboard');
const [skills, setSkills] = useState([]);
const [mySkills, setMySkills] = useState([]);
const [requests, setRequests] = useState([]);
const [notifications, setNotifications] = useState([]);
const [loading, setLoading] = useState(true);
const [message, setMessage] = useState('');
const [search, setSearch] = useState('');
const [category, setCategory] = useState('All');

const [skillForm, setSkillForm] = useState({
name: '',
category: 'Technology',
description: ''
})
const apiRequest = useCallback(async (endpoint, options = {}) => {
const token = localStorage.getItem('skillloopToken');

const response = await fetch(`${API_URL}${endpoint}`, {
...options,
headers: {
'Content-Type': 'application/json',
Authorization: `Bearer ${token}`,
...options.headers
}
});

const data = await response.json().catch(() => ({}));

if (!response.ok) {
throw new Error(data.message || data.error || 'Request failed.');
}

return data;
}, []);

const loadSkills = useCallback(async () => {
  try {
    const data = await apiRequest('/skills');
    setSkills(Array.isArray(data) ? data : data.skills || []);
  } catch (error) {
    setMessage(error.message);
  }
}, [apiRequest]);

const loadMySkills = useCallback(async () => {
  try {
    const data = await apiRequest('/skills/mine');
    setMySkills(Array.isArray(data) ? data : data.skills || []);
  } catch {
    setMySkills([]);
  }
}, [apiRequest]);

const loadRequests = useCallback(async () => {
  try {
    const data = await apiRequest('/requests');
    setRequests(Array.isArray(data) ? data : data.requests || []);
  } catch {
    setRequests([]);
  }
}, [apiRequest]);

const loadNotifications = useCallback(async () => {
  try {
    const data = await apiRequest('/notifications');
    setNotifications(
      Array.isArray(data) ? data : data.notifications || []
    );
  } catch {
    setNotifications([]);
  }
}, [apiRequest]);

useEffect(() => {
  if (!localStorage.getItem('skillloopToken')) {
    navigate('/login');
    return;
  }

  let isMounted = true;

  async function initializeDashboard() {
    setLoading(true);

    try {
      await Promise.all([
        loadSkills(),
        loadMySkills(),
        loadRequests(),
        loadNotifications()
      ]);
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  }

  initializeDashboard();

  return () => {
    isMounted = false;
  };
}, [navigate, loadSkills, loadMySkills, loadRequests, loadNotifications]);

function showPage(page) {
  setActivePage(page);
  setMessage('');
}

function getUserId() {
  return user.id || user.userId;
}

function getSkillId(skill) {
  return skill.id || skill.skill_id;
}

function getSkillName(skill) {
  return skill.name || skill.skill_name || 'Untitled Skill';
}

function getTeacherName(skill) {
  return (
    skill.teacher_name ||
    skill.teacherName ||
    skill.teacher ||
    'SkillLoop Member'
  );
}

function isMySkill(skill) {
  return String(skill.teacher_id || skill.teacherId) === String(getUserId());
}

function getRequestStatus(request) {
  return request.status || 'Pending';
}

function getRequestSkillName(request) {
  return request.skill_name || request.skillName || 'Skill Exchange';
}

function isIncomingRequest(request) {
  return String(request.recipient_id) === String(getUserId());
}

function isOutgoingRequest(request) {
  return String(request.requester_id) === String(getUserId());
}

const categories = [
  'All',
  'Technology',
  'Design',
  'Communication',
  'Business',
  'Music',
  'Other'
];

const filteredSkills = skills.filter((skill) => {
  const searchText = search.toLowerCase();

  const matchesSearch =
    getSkillName(skill).toLowerCase().includes(searchText) ||
    (skill.description || '').toLowerCase().includes(searchText) ||
    getTeacherName(skill).toLowerCase().includes(searchText);

  const matchesCategory =
    category === 'All' || skill.category === category;

  return matchesSearch && matchesCategory && !isMySkill(skill);
});

const incomingRequests = requests.filter(isIncomingRequest);
const outgoingRequests = requests.filter(isOutgoingRequest);

const pendingRequests = requests.filter(
  (request) => getRequestStatus(request) === 'Pending'
);

async function sendRequest(skill) {
  try {
    await apiRequest('/requests', {
      method: 'POST',
      body: JSON.stringify({
        skillId: getSkillId(skill)
      })
    });

    setMessage('Skill exchange request sent successfully!');
    await loadRequests();
  } catch (error) {
    setMessage(error.message);
  }
}

async function updateRequestStatus(requestId, status) {
  try {
    await apiRequest(`/requests/${requestId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });

    setMessage(`Request ${status.toLowerCase()} successfully.`);
    await loadRequests();
  } catch (error) {
    setMessage(error.message);
  }
}

async function cancelRequest(requestId) {
  try {
    await apiRequest(`/requests/${requestId}/cancel`, {
      method: 'PATCH'
    });

    setMessage('Request cancelled successfully.');
    await loadRequests();
  } catch (error) {
    setMessage(error.message);
  }
}

async function completeRequest(requestId) {
  try {
    await apiRequest(`/requests/${requestId}/complete`, {
      method: 'PATCH'
    });

    setMessage('Exchange marked as completed!');
    await loadRequests();
  } catch (error) {
    setMessage(error.message);
  }
}

async function addSkill(event) {
  event.preventDefault();

  if (!skillForm.name.trim() || !skillForm.description.trim()) {
    setMessage('Please enter the skill name and description.');
    return;
  }

  try {
    await apiRequest('/skills', {
      method: 'POST',
      body: JSON.stringify({
        name: skillForm.name.trim(),
        category: skillForm.category,
        description: skillForm.description.trim()
      })
    });

    setSkillForm({
      name: '',
      category: 'Technology',
      description: ''
    });

    setMessage('Your skill has been published successfully!');

    await loadSkills();
    await loadMySkills();
  } catch (error) {
    setMessage(error.message);
  }
}

async function deleteSkill(skillId) {
  if (!window.confirm('Are you sure you want to delete this skill?')) {
    return;
  }

  try {
    await apiRequest(`/skills/${skillId}`, {
      method: 'DELETE'
    });

    setMessage('Skill deleted successfully.');

    await loadSkills();
    await loadMySkills();
  } catch (error) {
    setMessage(error.message);
  }
}

function logout() {
  localStorage.removeItem('skillloopToken');
  localStorage.removeItem('skillloopUser');
  navigate('/login');
}

function renderSkillCard(skill) {
  return (
    <article className="sl-skill-card" key={getSkillId(skill)}>
      <div className="sl-skill-card-content">
        <span className="sl-category">
          {skill.category || 'Other'}
        </span>

        <h3>{getSkillName(skill)}</h3>

        <p>{skill.description || 'No description provided.'}</p>

        <p>By {getTeacherName(skill)}</p>

        {isMySkill(skill) ? (
          <button
            type="button"
            onClick={() => deleteSkill(getSkillId(skill))}
          >
            Delete Skill
          </button>
        ) : (
          <button
            type="button"
            onClick={() => sendRequest(skill)}
          >
            Request Exchange
          </button>
        )}
      </div>
    </article>
  );
}

function renderRequestCard(request, type) {
  const requestId = request.id || request.request_id;
  const status = getRequestStatus(request);

  return (
    <article className="sl-skill-card" key={requestId}>
      <div className="sl-skill-card-content">
        <h3>{getRequestSkillName(request)}</h3>

        {type === 'incoming' && (
          <p>
            Requested by: {request.requester_name || 'SkillLoop Member'}
          </p>
        )}

        {type === 'outgoing' && (
          <p>
            Sent to: {request.recipient_name || 'SkillLoop Member'}
          </p>
        )}

        <p>
          Status: <strong>{status}</strong>
        </p>

        {type === 'incoming' && status === 'Pending' && (
          <>
            <button
              type="button"
              onClick={() => updateRequestStatus(requestId, 'Accepted')}
            >
              Accept
            </button>

            <button
              type="button"
              onClick={() => updateRequestStatus(requestId, 'Rejected')}
            >
              Reject
            </button>
          </>
        )}

        {type === 'outgoing' && status === 'Pending' && (
          <button
            type="button"
            onClick={() => cancelRequest(requestId)}
          >
            Cancel Request
          </button>
        )}

        {status === 'Accepted' && (
          <button
            type="button"
            onClick={() => completeRequest(requestId)}
          >
            Mark Completed
          </button>
        )}
      </div>
    </article>
  );
}

function renderDashboardHome() {
  return (
    <>
      <div className="sl-page-heading">
        <h1>Welcome back, {user.name || 'Learner'}!</h1>
        <p>Learn something new. Share what you know. Grow together.</p>
      </div>

      <div className="sl-stats-container">
        <div className="sl-stat-card">
          <h3>Available Skills</h3>
          <p>{skills.length}</p>
        </div>

        <div className="sl-stat-card">
          <h3>My Skills</h3>
          <p>{mySkills.length}</p>
        </div>

        <div className="sl-stat-card">
          <h3>Pending Requests</h3>
          <p>{pendingRequests.length}</p>
        </div>

        <div className="sl-stat-card">
          <h3>Notifications</h3>
          <p>{notifications.length}</p>
        </div>
      </div>

      <section className="sl-section">
        <div className="sl-section-heading">
          <h2>Explore Skills</h2>

          <button
            type="button"
            onClick={() => showPage('Explore Skills')}
          >
            View All
          </button>
        </div>

        <div className="sl-skills-grid">
          {filteredSkills.slice(0, 4).map(renderSkillCard)}
        </div>

        {filteredSkills.length === 0 && (
          <p>No skills available yet.</p>
        )}
      </section>
    </>
  );
}

function renderExploreSkills() {
  return (
    <>
      <div className="sl-page-heading">
        <h1>Explore Skills</h1>
        <p>Discover skills and connect with other learners.</p>
      </div>

      <div className="sl-search-container">
        <input
          type="text"
          placeholder="Search skills or members..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="sl-skills-grid">
        {filteredSkills.map(renderSkillCard)}
      </div>

      {filteredSkills.length === 0 && (
        <p>No matching skills found.</p>
      )}
    </>
  );
}

function renderTeachSkills() {
  return (
    <>
      <div className="sl-page-heading">
        <h1>Teach a Skill</h1>
        <p>Share your knowledge with the SkillLoop community.</p>
      </div>

      <form className="sl-form" onSubmit={addSkill}>
        <label htmlFor="skillName">Skill Name</label>

        <input
          id="skillName"
          type="text"
          placeholder="Example: Web Development"
          value={skillForm.name}
          onChange={(event) =>
            setSkillForm({
              ...skillForm,
              name: event.target.value
            })
          }
        />

        <label htmlFor="skillCategory">Category</label>

        <select
          id="skillCategory"
          value={skillForm.category}
          onChange={(event) =>
            setSkillForm({
              ...skillForm,
              category: event.target.value
            })
          }
        >
          {categories
            .filter((item) => item !== 'All')
            .map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
        </select>

        <label htmlFor="skillDescription">Description</label>

        <textarea
          id="skillDescription"
          rows="5"
          placeholder="Describe what you can teach..."
          value={skillForm.description}
          onChange={(event) =>
            setSkillForm({
              ...skillForm,
              description: event.target.value
            })
          }
        />

        <button type="submit">Publish Skill</button>
      </form>

      <section className="sl-section">
        <h2>My Published Skills</h2>

        <div className="sl-skills-grid">
          {mySkills.map(renderSkillCard)}
        </div>

        {mySkills.length === 0 && (
          <p>You have not published any skills yet.</p>
        )}
      </section>
    </>
  );
}

function renderExchangeRequests() {
  return (
    <>
      <div className="sl-page-heading">
        <h1>Skill Exchange</h1>
        <p>Manage the skill exchange requests you send and receive.</p>
      </div>

      <section className="sl-section">
        <h2>Received Requests</h2>

        <div className="sl-skills-grid">
          {incomingRequests.map((request) =>
            renderRequestCard(request, 'incoming')
          )}
        </div>

        {incomingRequests.length === 0 && (
          <p>You have not received any requests yet.</p>
        )}
      </section>

      <section className="sl-section">
        <h2>Sent Requests</h2>

        <div className="sl-skills-grid">
          {outgoingRequests.map((request) =>
            renderRequestCard(request, 'outgoing')
          )}
        </div>

        {outgoingRequests.length === 0 && (
          <p>You have not sent any requests yet.</p>
        )}
      </section>
    </>
  );
}

function renderNotifications() {
  return (
    <>
      <div className="sl-page-heading">
        <h1>Notifications</h1>
        <p>Stay updated on your learning and teaching activities.</p>
      </div>

      <section className="sl-section">
        {notifications.length === 0 ? (
          <p>You have no notifications yet.</p>
        ) : (
          <div className="sl-skills-grid">
            {notifications.map((notification, index) => (
              <article
                className="sl-skill-card"
                key={notification.id || notification.notification_id || index}
              >
                <div className="sl-skill-card-content">
                  <h3>
                    {notification.title || 'SkillLoop Notification'}
                  </h3>

                  <p>
                    {notification.message ||
                      notification.content ||
                      'You have a new update.'}
                  </p>

                  {notification.created_at && (
                    <small>
                      {new Date(notification.created_at).toLocaleString()}
                    </small>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function renderProfile() {
  return (
    <>
      <div className="sl-page-heading">
        <h1>My Profile</h1>
        <p>View your SkillLoop account details.</p>
      </div>

      <section className="sl-section">
        <div className="sl-skill-card">
          <div className="sl-skill-card-content">
            <h2>{user.name || 'SkillLoop Member'}</h2>

            <p>
              <strong>Email:</strong> {user.email || 'Not available'}
            </p>

            <p>
              <strong>User ID:</strong> {getUserId() || 'Not available'}
            </p>

            <p>
              <strong>Skills Published:</strong> {mySkills.length}
            </p>

            <p>
              <strong>Requests Sent:</strong> {outgoingRequests.length}
            </p>

            <p>
              <strong>Requests Received:</strong> {incomingRequests.length}
            </p>

            <button type="button" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

function renderActivePage() {
  switch (activePage) {
    case 'Explore Skills':
      return renderExploreSkills();

    case 'Teach a Skill':
      return renderTeachSkills();

    case 'Skill Exchange':
      return renderExchangeRequests();

    case 'Notifications':
      return renderNotifications();

    case 'My Profile':
      return renderProfile();

    default:
      return renderDashboardHome();
  }
}

return (
  <div className="sl-dashboard">
    <aside className="sl-sidebar">
      <div className="sl-logo">
        <h2>SkillLoop</h2>
        <p>Learn • Teach • Build • Verify</p>
      </div>

      <nav className="sl-navigation">
        <button
          type="button"
          className={activePage === 'Dashboard' ? 'active' : ''}
          onClick={() => showPage('Dashboard')}
        >
          Dashboard
        </button>

        <button
          type="button"
          className={activePage === 'Explore Skills' ? 'active' : ''}
          onClick={() => showPage('Explore Skills')}
        >
          Explore Skills
        </button>

        <button
          type="button"
          className={activePage === 'Teach a Skill' ? 'active' : ''}
          onClick={() => showPage('Teach a Skill')}
        >
          Teach a Skill
        </button>

        <button
          type="button"
          className={activePage === 'Skill Exchange' ? 'active' : ''}
          onClick={() => showPage('Skill Exchange')}
        >
          Skill Exchange
        </button>

        <button
          type="button"
          className={activePage === 'Notifications' ? 'active' : ''}
          onClick={() => showPage('Notifications')}
        >
          Notifications
          {notifications.length > 0 && (
            <span className="sl-notification-count">
              {notifications.length}
            </span>
          )}
        </button>

        <button
          type="button"
          className={activePage === 'My Profile' ? 'active' : ''}
          onClick={() => showPage('My Profile')}
        >
          My Profile
        </button>
      </nav>

      <div className="sl-sidebar-footer">
        <p>Growing together, one skill at a time.</p>

        <button type="button" onClick={logout}>
          Logout
        </button>
      </div>
    </aside>

    <main className="sl-main">
      <header className="sl-topbar">
        <div>
          <p>Welcome to your learning space</p>
          <h2>{activePage}</h2>
        </div>

        <div className="sl-user-info">
          <div className="sl-avatar">
            {(user.name || 'U').charAt(0).toUpperCase()}
          </div>

          <div>
            <strong>{user.name || 'Learner'}</strong>
            <p>{user.email || ''}</p>
          </div>
        </div>
      </header>

      {message && (
        <div className="sl-message" role="status">
          <span>{message}</span>

          <button
            type="button"
            onClick={() => setMessage('')}
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      )}

      <div className="sl-content">
        {loading ? (
          <div className="sl-loading">
            <p>Loading your SkillLoop dashboard...</p>
          </div>
        ) : (
          renderActivePage()
        )}
      </div>
    </main>
  </div>
);
}

export default Dashboard;