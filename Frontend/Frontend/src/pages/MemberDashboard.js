import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ProjectList from "./TeamMember/ProjectList";
import ActivityList from "./TeamMember/ActivityList";

const TeamMemberDashboard = () => {
  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const userId = userData?.id;
  const token = userData?.token;
  const backendBaseUrl = process.env.REACT_APP_BACKEND_BASE_URL;

  const [projects, setProjects] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("dashboard");

  useEffect(() => {
    if (!userId || !token) return;

    const fetchProjects = axios.get(
      `${backendBaseUrl}/api/projects/projectByMember/${userId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const fetchActivities = axios.get(
      `${backendBaseUrl}/api/activities/member/${userId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    Promise.all([fetchProjects, fetchActivities])
      .then(([projRes, actRes]) => {
        setProjects(projRes.data);
        setActivities(actRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard load error:", err);
        setLoading(false);
      });
  }, [userId, token]);

  const handleActivityStatusUpdate = async (activityId, newStatus) => {
    try {
      await axios.patch(
        `${backendBaseUrl}/api/activities/${activityId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActivities((prev) =>
        prev.map((act) =>
          act.id === activityId ? { ...act, status: newStatus } : act
        )
      );
    } catch (err) {
      console.error("Failed to update activity:", err);
    }
  };

  const completedProjects = projects.filter(
    (a) => a.status === "COMPLETED" || a.status === "done"
  ).length;
  const openActivities = activities.filter(
    (a) => a.action !== "COMPLETED" && a.action !== "done"
  ).length;

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const avatarInitial =
    userData?.username?.[0]?.toUpperCase() || "U";

  if (loading) {
    return (
      <div style={styles.loaderWrap}>
        <div style={styles.spinner} />
      </div>
    );
  }

  return (
    <div style={styles.shell}>
      {/* ── Sidebar ── */}
      <aside style={styles.sidebar}>
        {/* Avatar */}
        <div style={styles.avatarWrap}>
          <div style={styles.avatar}>{avatarInitial}</div>
          <div style={styles.avatarName}>{userData?.username || "User"}</div>
          <div style={styles.avatarRole}>Team Member</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1 }}>
          <div style={styles.navLabel}>Menu</div>

          <NavItem
            icon={<IconGrid />}
            label="Dashboard"
            active={activeNav === "dashboard"}
            onClick={() => setActiveNav("dashboard")}
          />
          <NavItem
            icon={<IconList />}
            label="Projects"
            active={activeNav === "projects"}
            as={Link}
            to={`/member/${userData?.id}/project`}
            onClick={() => setActiveNav("projects")}
          />
          <NavItem
            icon={<IconClock />}
            label="Activities"
            active={activeNav === "activities"}
            as={Link}
            to={`/member/${userData?.id}/activity`}
            onClick={() => setActiveNav("activities")}
          />

          <div style={styles.navSep} />
          <div style={styles.navLabel}>Account</div>

          <NavItem icon={<IconUser />} label="Profile" />
          <NavItem icon={<IconSettings />} label="Settings" />
        </nav>
      </aside>

      {/* ── Main ── */}
      <div style={styles.main}>
        {/* Topbar */}
        <header style={styles.topbar}>
          <div>
            <div style={styles.topbarTitle}>
              {greeting}, {userData?.username || "User"}
            </div>
            <div style={styles.topbarSub}>{today}</div>
          </div>
          <div style={styles.topbarRight}>
            <div style={{ position: "relative" }}>
            
            </div>
            <button style={styles.iconBtn} title="Profile">
              <IconUser />
            </button>
          </div>
        </header>

        {/* Content */}
        <div style={styles.content}>

          {/* Stats row */}
          <div style={styles.statsRow}>
            <StatCard label="Active projects" value={projects.length - completedProjects} sub="+1 this month" subColor="#3B6D11" />
            <StatCard label="Open activities" value={openActivities} sub="Check due dates" subColor="#888780" />
            <StatCard label="Completed" value={completedProjects} sub="+5 this week" subColor="#3B6D11" />
          </div>

          {/* Two-column: projects + activities */}
          <div style={styles.twoCol}>
            {/* Projects */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <Link
                  to={`/member/${userData?.id}/project`}
                  style={styles.seeAll}
                >
                  See all
                </Link>
              </div>
              <ProjectList projects={projects} compact />
            </div>

            {/* Activities */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardTitle}>Recent activities</span>
                <Link
                  to={`/member/${userData?.id}/activity`}
                  style={styles.seeAll}
                >
                  See all
                </Link>
              </div>
              <ActivityList
                activities={activities}
                onUpdateStatus={handleActivityStatusUpdate}
                compact
              />
            </div>
          </div>

          {/* Profile strip */}
          <div style={styles.card}>
            <div style={{ ...styles.cardHeader, marginBottom: 12 }}>
              <span style={styles.cardTitle}>Profile</span>
            </div>
            <div style={styles.profileRow}>
              <ProfileField label="Name" value={userData?.username} />
              <ProfileField label="Email" value={userData?.email} />
              <ProfileField label="Role" value="Team Member" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

/* ── Sub-components ── */

const NavItem = ({ icon, label, active, onClick, as: Tag = "div", to }) => {
  const base = {
    ...styles.navItem,
    ...(active ? styles.navItemActive : {}),
  };
  if (Tag === Link) {
    return (
      <Link to={to} style={{ textDecoration: "none" }}>
        <div style={base} onClick={onClick}>
          <span style={styles.navIcon}>{icon}</span>
          {label}
        </div>
      </Link>
    );
  }
  return (
    <div style={base} onClick={onClick}>
      <span style={styles.navIcon}>{icon}</span>
      {label}
    </div>
  );
};

const StatCard = ({ label, value, sub, subColor }) => (
  <div style={styles.statCard}>
    <div style={styles.statLabel}>{label}</div>
    <div style={styles.statVal}>{value}</div>
    <div style={{ ...styles.statSub, color: subColor }}>{sub}</div>
  </div>
);

const ProfileField = ({ label, value }) => (
  <div>
    <div style={styles.profileLabel}>{label}</div>
    <div style={styles.profileValue}>{value || "—"}</div>
  </div>
);

/* ── SVG Icons ── */
const IconGrid = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".9" />
    <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".5" />
    <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".5" />
    <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".5" />
  </svg>
);
const IconList = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="2" width="14" height="3" rx="1" fill="currentColor" opacity=".6" />
    <rect x="1" y="6.5" width="14" height="3" rx="1" fill="currentColor" opacity=".4" />
    <rect x="1" y="11" width="8" height="3" rx="1" fill="currentColor" opacity=".4" />
  </svg>
);
const IconClock = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" opacity=".6" />
    <path d="M8 4.5V8.5L10.5 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity=".8" />
  </svg>
);
const IconUser = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.2" opacity=".7" />
    <path d="M2 14c0-2.21 2.686-4 6-4s6 1.79 6 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity=".6" />
  </svg>
);
const IconSettings = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2" opacity=".7" />
    <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity=".4" />
  </svg>
);
const IconBell = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
    <path d="M8 1.5A5 5 0 003 6.5v3l-1.5 2H14.5L13 9.5v-3A5 5 0 008 1.5z" stroke="currentColor" strokeWidth="1.2" />
    <path d="M6.5 13.5a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

/* ── Styles ── */
const styles = {
  shell: {
    display: "flex",
    minHeight: "100vh",
    background: "#f5f5f3",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },

  /* Loader */
  loaderWrap: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f5f5f3",
  },
  spinner: {
    width: 36,
    height: 36,
    border: "3px solid #e0e0e0",
    borderTop: "3px solid #7F77DD",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },

  /* Sidebar */
  sidebar: {
    width: 220,
    flexShrink: 0,
    background: "#ffffff",
    borderRight: "0.5px solid #e8e8e6",
    display: "flex",
    flexDirection: "column",
    padding: "24px 14px",
    minHeight: "100vh",
    position: "sticky",
    top: 0,
    height: "100vh",
    overflowY: "auto",
  },
  avatarWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: 20,
    borderBottom: "0.5px solid #ebebea",
    marginBottom: 20,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: "50%",
    background: "#7F77DD",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    fontWeight: 500,
    color: "#fff",
    marginBottom: 10,
  },
  avatarName: {
    fontSize: 14,
    fontWeight: 500,
    color: "#1a1a1a",
  },
  avatarRole: {
    fontSize: 12,
    color: "#888780",
    marginTop: 2,
  },
  navLabel: {
    fontSize: 11,
    color: "#b4b2a9",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: 6,
    padding: "0 8px",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 10px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13,
    color: "#5f5e5a",
    marginBottom: 2,
    transition: "background 0.15s",
    userSelect: "none",
  },
  navItemActive: {
    background: "#EEEDFE",
    color: "#534AB7",
    fontWeight: 500,
  },
  navIcon: {
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
  },
  navSep: {
    border: "none",
    borderTop: "0.5px solid #ebebea",
    margin: "14px 0",
  },

  /* Main */
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },
  topbar: {
    background: "#ffffff",
    borderBottom: "0.5px solid #e8e8e6",
    padding: "14px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  topbarTitle: {
    fontSize: 15,
    fontWeight: 500,
    color: "#1a1a1a",
  },
  topbarSub: {
    fontSize: 12,
    color: "#888780",
    marginTop: 2,
  },
  topbarRight: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    position: "relative",
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    border: "0.5px solid #e0e0de",
    background: "#f5f5f3",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#5f5e5a",
    padding: 0,
  },
  notifDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 7,
    height: 7,
    background: "#E24B4A",
    borderRadius: "50%",
    border: "1.5px solid #ffffff",
  },

  /* Content */
  content: {
    padding: "20px 24px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 12,
  },
  statCard: {
    background: "#ffffff",
    border: "0.5px solid #e8e8e6",
    borderRadius: 12,
    padding: "14px 16px",
  },
  statLabel: {
    fontSize: 11,
    color: "#888780",
    marginBottom: 6,
  },
  statVal: {
    fontSize: 22,
    fontWeight: 500,
    color: "#1a1a1a",
  },
  statSub: {
    fontSize: 11,
    marginTop: 4,
  },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
    gap: 16,
  },
  card: {
    background: "#ffffff",
    border: "0.5px solid #e8e8e6",
    borderRadius: 12,
    padding: "18px 18px 14px",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 500,
    color: "#1a1a1a",
  },
  seeAll: {
    fontSize: 11,
    color: "#534AB7",
    textDecoration: "none",
  },
  profileRow: {
    display: "flex",
    gap: 28,
    flexWrap: "wrap",
  },
  profileLabel: {
    fontSize: 11,
    color: "#888780",
    marginBottom: 2,
  },
  profileValue: {
    fontSize: 13,
    color: "#1a1a1a",
  },
};

export default TeamMemberDashboard;