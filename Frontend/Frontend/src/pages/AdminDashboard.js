import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import UserInfoCard from "../pages/AdminContents/UserInfoCard";
import ProjectList from "./TeamMember/ProjectList";
import ActivityList from "../components/ActivityList";

const AdminDashboard = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const { adminId } = useParams();
  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const token = userData?.token;
  const backendBaseUrl = process.env.REACT_APP_BACKEND_BASE_URL;

  const [admin, setAdmin] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);
  const [projects, setProjects] = useState([]);
  const [membersList, setMembersList] = useState([]);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    if (!token || !adminId) return;

    const fetchAdmin = axios.get(`${backendBaseUrl}/api/admin/${adminId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const fetchActivities = axios.get(
      `${backendBaseUrl}/api/activities/admin/${adminId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const fetchProjects = axios.get(
      `${backendBaseUrl}/api/projects/projectByAdmin/${adminId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const fetchMembers = axios.get(
      `${backendBaseUrl}/api/admin/members`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    Promise.all([fetchAdmin, fetchProjects, fetchActivities, fetchMembers])
      .then(([adminRes, projectsRes, activitiesRes, membersRes]) => {
        setAdmin(adminRes.data);
        setProjects(projectsRes.data);
        setActivityFeed(activitiesRes.data);
        setMembersList(membersRes.data);

        const totalProjects = projectsRes.data.length;
        const activeTasks = activitiesRes.data.filter(
          (a) => a.action === "IN_PROGRESS" || a.action === "NOT_STARTED"
        ).length;
        const completedTasks = projectsRes.data.filter(
          (a) => a.status === "COMPLETED"
        ).length;

        setMetrics([
          { label: "Total Projects", value: totalProjects },
          { label: "Active Tasks", value: activeTasks },
          { label: "Completed Projects", value: completedTasks },
          { label: "Team Members", value: membersRes.data.length },
        ]);

        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard error:", err);
        setLoading(false);
      });
  }, [adminId, token]);

  if (loading) {
    return (
      <div style={styles.loaderWrap}>
        <div style={styles.spinner} />
      </div>
    );
  }

  return (
    
    <div style={styles.shell}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.avatarWrap}>
          <div style={styles.avatar}>
            {admin?.user?.username?.[0]?.toUpperCase() || "A"}
          </div>
          <div style={styles.avatarName}>
            {admin?.user?.username || "Admin"}
          </div>
          <div style={styles.avatarRole}>Admin</div>
        </div>

        <nav style={{ flex: 1 }}>
  <div style={styles.navLabel}>Menu</div>

  <NavItem
    label="Dashboard"
    path={`/adminDashboard/${adminId}`}
    onClick={navigate}
    active
  />

  <NavItem
    label="Projects"
    path={`/admin/${adminId}/projects`}
    active={location.pathname.includes("/projects")}
    onClick={navigate}
  />

  <NavItem
    label="Reports"
    path={`/admin/${adminId}/reports`}
    active={location.pathname.includes("/reports")}
    onClick={navigate}
  />

  <NavItem
  label="Activities"
  path={`/admin/${adminId}/activity`}
  active={location.pathname.includes("/activities")}
  onClick={navigate}
/>
        </nav>
      </aside>

      {/* Main */}
      <div style={styles.main}>
        {/* Topbar */}
        <header style={styles.topbar}>
          <div>
            <div style={styles.topbarTitle}>
              Welcome, {admin?.user?.username}
            </div>
          </div>
        </header>

        {/* Content */}
        <div style={styles.content}>
          {/* Metrics */}
          <div style={styles.statsRow}>
           {metrics.map((m, i) => (
              <StatCard key={i} label={m.label} value={m.value} index={i} />
            ))}
          </div>

          {/* Two column */}
          <div style={styles.twoCol}>
            <div style={styles.card}>
              <ProjectList role="admin" projects={projects} compact/>
            </div>

            <div style={styles.card}>
              <div style={styles.cardTitle}>Recent Activities</div>
              <ActivityList activities={activityFeed} compact/>
            </div>
          </div>

          {/* Profile */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>Admin Info</div>
            <UserInfoCard user={admin.user} />
          </div>
        </div>
      </div>
    </div>
  );
};


const NavItem = ({ label, active, path, onClick }) => (
  <div
    onClick={() => onClick(path)}
    style={{
      ...styles.navItem,
      ...(active ? styles.navItemActive : {}),
    }}
  >
    {label}
  </div>
);

const StatCard = ({ label, value, index }) => {
  const colors = [
    "#6366F1", // blue
    "#10B981", // green
    "#F59E0B", // orange
    "#EF4444", // red
  ];

  return (
    <div style={styles.statCard}>
      <div style={styles.statLabel}>{label}</div>
      <div style={{ ...styles.statVal, color: colors[index] }}>
        {value}
      </div>
    </div>
  );
};

const styles = {
  shell: {
    display: "flex",
    minHeight: "100vh",
    background: "#F8FAFC",
    fontFamily: "'Inter', sans-serif",
  },

  /* Loader */
  loaderWrap: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  spinner: {
    width: 36,
    height: 36,
    border: "3px solid #e5e7eb",
    borderTop: "3px solid #6366F1",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },

  /* Sidebar */
  sidebar: {
    width: 230,
    background: "#111827",
    color: "#E5E7EB",
    padding: "24px 16px",
    display: "flex",
    flexDirection: "column",
  },

  avatarWrap: {
    textAlign: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
    fontSize: 20,
    fontWeight: 600,
  },
  avatarName: {
    marginTop: 10,
    fontWeight: 500,
    color: "#fff",
  },
  avatarRole: {
    fontSize: 12,
    color: "#9CA3AF",
  },

  navLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },

  navItem: {
    padding: "10px 12px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13,
    color: "#D1D5DB",
    marginBottom: 4,
    transition: "all 0.2s",
  },

  navItemActive: {
    background: "#6366F1",
    color: "#fff",
    fontWeight: 500,
  },

  /* Main */
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  /* Topbar */
  topbar: {
    padding: "16px 24px",
    background: "#ffffff",
    borderBottom: "1px solid #E5E7EB",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  topbarTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "#111827",
  },

  /* Content */
  content: {
    padding: 24,
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },

  /* Stats */
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: 14,
  },

  statCard: {
    background: "#ffffff",
    borderRadius: 12,
    padding: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    border: "1px solid #F1F5F9",
  },

  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 6,
  },

  statVal: {
    fontSize: 22,
    fontWeight: 600,
    color: "#111827",
  },

  /* Layout */
  twoCol: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 18,
  },

  card: {
    background: "#ffffff",
    padding: 18,
    borderRadius: 14,
    boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
    border: "1px solid #F1F5F9",
  },

  cardTitle: {
    fontWeight: 600,
    marginBottom: 12,
    color: "#111827",
  },
};

export default AdminDashboard;