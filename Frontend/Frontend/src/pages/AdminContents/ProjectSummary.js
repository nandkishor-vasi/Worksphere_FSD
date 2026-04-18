import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Checkbox,
  ListItemText,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Container,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const ProjectSummary = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    status: 'NOT_STARTED',
    startDate: '',
    endDate: '',
    members: [],
  });
  const [membersList, setMembersList] = useState([]);
  const userData = useAuth();
  const token = userData?.user?.token;
  const userId = userData?.user?.id;
  const backendBaseUrl = process.env.REACT_APP_BACKEND_BASE_URL;

  useEffect(() => {
    axios
      .get(`${backendBaseUrl}/api/projects/projectByAdmin/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    axios
      .get(`${backendBaseUrl}/api/admin/members`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMembersList(res.data));
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleMembersChange = (e) => {
    setNewProject((prev) => ({
      ...prev,
      members: e.target.value,
    }));
  };

  const handleCreateProject = () => {
    const payload = {
      ...newProject,
      createdBy: { id: userId },
      members: newProject.members.map((id) => ({ id })),
    };

    axios
      .post(`${backendBaseUrl}/api/projects`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProjects((prev) => [...prev, res.data]);
        setNewProject({
          title: '',
          description: '',
          status: 'NOT_STARTED',
          startDate: '',
          endDate: '',
          members: [],
        });
      });
  };

  const handleUpdateStatus = (projectId, newStatus) => {
    const projectToUpdate = projects.find((p) => p.id === projectId);
    if (!projectToUpdate) return;

    axios
      .put(
        `${backendBaseUrl}/api/projects/${projectId}`,
        { ...projectToUpdate, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setProjects((prev) =>
          prev.map((p) => (p.id === projectId ? res.data : p))
        );
      });
  };

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Typography
        sx={{
          fontSize: 18,
          fontWeight: 600,
          color: "#111827",
          mb: 2,
        }}
      >
        Projects
      </Typography>

      {/* Create Project */}
      <Card
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: 3,
          background: "#ffffff",
          border: "1px solid #E5E7EB",
        }}
      >
        <CardContent>
          <Typography sx={{ fontWeight: 600, fontSize: 14, mb: 2 }}>
            Create Project
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Title" name="title" value={newProject.title} onChange={handleChange} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Description" name="description" value={newProject.description} onChange={handleChange} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={newProject.status}
                  onChange={handleChange}
                  input={<OutlinedInput label="Status" />}
                >
                  <MenuItem value="NOT_STARTED">Not Started</MenuItem>
                  <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                  <MenuItem value="COMPLETED">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField type="date" fullWidth name="startDate" value={newProject.startDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField type="date" fullWidth name="endDate" value={newProject.endDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Members</InputLabel>
                <Select
                  multiple
                  value={newProject.members}
                  onChange={handleMembersChange}
                  input={<OutlinedInput label="Members" />}
                  renderValue={(selected) =>
                    selected
                      .map(
                        (id) =>
                          membersList.find((m) => m.id === id)?.name || id
                      )
                      .join(', ')
                  }
                >
                  {membersList.map((member) => (
                    <MenuItem key={member.id} value={member.id}>
                      <Checkbox checked={newProject.members.includes(member.id)} />
                      <ListItemText primary={member.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleCreateProject}
              sx={{
                background: "#6366F1",
                textTransform: "none",
                fontSize: 14,
                "&:hover": { background: "#4F46E5" },
              }}
            >
              Create Project
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Table */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          background: "#ffffff",
          border: "1px solid #E5E7EB",
        }}
      >
        <CardContent>
          <Typography sx={{ mb: 2, fontWeight: 600, fontSize: 14 }}>
            Project List
          </Typography>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={28} />
            </Box>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#F9FAFB" }}>
                  <TableCell>ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Start</TableCell>
                  <TableCell>End</TableCell>
                  <TableCell>Members</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id} sx={{ "&:hover": { background: "#F9FAFB" } }}>
                    <TableCell>{project.id}</TableCell>
                    <TableCell>{project.title}</TableCell>

                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background:
                              project.status === "COMPLETED"
                                ? "#10B981"
                                : project.status === "IN_PROGRESS"
                                ? "#F59E0B"
                                : "#EF4444",
                          }}
                        />

                        <FormControl size="small" sx={{ minWidth: 130 }}>
                          <Select
                            value={project.status}
                            onChange={(e) => {
                              const newStatus = e.target.value;
                              setProjects((prev) =>
                                prev.map((p) =>
                                  p.id === project.id ? { ...p, status: newStatus } : p
                                )
                              );
                            }}
                          >
                            <MenuItem value="NOT_STARTED">Not Started</MenuItem>
                            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                            <MenuItem value="COMPLETED">Completed</MenuItem>
                          </Select>
                        </FormControl>

                        <Button
                          size="small"
                          variant="contained"
                          onClick={() =>
                            handleUpdateStatus(project.id, project.status)
                          }
                          sx={{
                            textTransform: "none",
                            fontSize: 12,
                            background: "#111827",
                            "&:hover": { background: "#1F2937" },
                          }}
                        >
                          Save
                        </Button>
                      </Box>
                    </TableCell>

                    <TableCell>
                      {new Date(project.startDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(project.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{project.members?.length || 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProjectSummary;