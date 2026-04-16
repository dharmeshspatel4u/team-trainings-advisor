# Complete Testing Guide

## System Setup & Testing

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set API Key
export ANTHROPIC_API_KEY='sk-ant-...'

# Start server
python main.py
```

Server runs on: `http://localhost:8000`  
API Docs: `http://localhost:8000/docs` (Swagger UI)

---

## API Testing Examples

### Create a Team Member

**Request:**
```bash
curl -X POST "http://localhost:8000/api/team/members" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John DevOps",
    "role": "devops",
    "email": "john@company.com",
    "current_skills": []
  }'
```

**Response:**
```json
{
  "id": "uuid-123",
  "name": "John DevOps",
  "role": "devops",
  "email": "john@company.com",
  "current_skills": [],
  "created_at": "2024-04-14T10:00:00",
  "updated_at": "2024-04-14T10:00:00"
}
```

---

### Get Role Information

```bash
# Get current skills for a DevOps engineer
curl "http://localhost:8000/api/skills/role/devops/current"

# Get target AI skills 
curl "http://localhost:8000/api/skills/role/devops/target"

# See skill gaps
curl "http://localhost:8000/api/skills/role/devops/gaps"

# Get detailed role info
curl "http://localhost:8000/api/skills/role/devops/info"
```

---

### Generate AI Training Roadmap

This is the key feature - uses Claude API to generate personalized learning paths!

```bash
# First, get the member ID from previous steps
curl -X POST "http://localhost:8000/api/roadmaps/generate?member_id=<your-member-id>" \
  -H "Content-Type: application/json"
```

**Sample Response:**
```json
{
  "id": "roadmap-uuid",
  "team_member_id": "member-uuid",
  "team_member_name": "John DevOps",
  "current_role": "devops",
  "target_role": "AI DevOps Engineer",
  "target_skills": ["MLOps Fundamentals", "Model Containerization", "..."],
  "phases": [
    {
      "phase_number": 1,
      "title": "MLOps Foundations",
      "duration_weeks": 6,
      "description": "Learn fundamentals of ML operations...",
      "skills_to_learn": ["MLOps Fundamentals", "Python for ML"],
      "recommended_courses": [
        "Introduction to Machine Learning",
        "MLOps.community Courses"
      ],
      "projects": [
        "Build a simple ML pipeline with MLflow",
        "Deploy a model using Docker and Kubernetes"
      ]
    },
    {
      "phase_number": 2,
      "title": "ML Deployment",
      "duration_weeks": 8,
      "description": "...",
      "skills_to_learn": [...],
      "recommended_courses": [...],
      "projects": [...]
    }
  ],
  "total_duration_weeks": 24,
  "created_at": "2024-04-14T10:05:00"
}
```

---

### Get All Courses

```bash
curl "http://localhost:8000/api/courses"
```

---

### Filter Courses

```bash
# By category
curl "http://localhost:8000/api/courses/category/MLOps"

# By difficulty
curl "http://localhost:8000/api/courses/difficulty/intermediate"

# By tag
curl "http://localhost:8000/api/courses/tag/Kubernetes"

# By skill
curl "http://localhost:8000/api/courses/skill/MLOps"
```

---

## Frontend Testing

### 2. Frontend Setup

```bash
cd frontend

npm install
npm run dev
```

Frontend runs on: `http://localhost:3000`

---

## Manual Testing Workflow

### 1. Dashboard
- Open `http://localhost:3000`
- See stats (Team Members, Learning Paths, Free Courses)
- Verify API connects successfully

### 2. Add Team Members
- Click "Add Team Member"
- Enter: Name, Email, Select Role
- Submit and verify member appears in list

**Test with Sample Data:**
- Name: `Sarah SRE`, Role: `sre`
- Name: `Mike Cloud`, Role: `cloud_engineer`
- Name: `Lisa Platform`, Role: `platform_engineer`

### 3. Generate Roadmaps
- Click on a team member card
- Click "Generate AI Roadmap"
- **Wait 10-30 seconds** for Claude to generate
- Verify 3-4 learning phases appear with:
  - Phase titles and duration
  - Skills to learn
  - Recommended courses
  - Hands-on projects

### 4. Browse Courses
- Go to Courses page
- Filter by category (MLOps, GenAI, Cloud AI, etc.)
- Filter by difficulty (Beginner, Intermediate, Advanced)
- Click "Visit Course" to open free learning resource

---

## Sample Team Setup

Create this sample team to test all roles:

```json
[
  {
    "name": "John",
    "role": "devops",
    "email": "john@company.com"
  },
  {
    "name": "Sarah", 
    "role": "senior_devops",
    "email": "sarah@company.com"
  },
  {
    "name": "Mike",
    "role": "sre",
    "email": "mike@company.com"
  },
  {
    "name": "Lisa",
    "role": "cloud_engineer",
    "email": "lisa@company.com"
  },
  {
    "name": "David",
    "role": "platform_engineer",
    "email": "david@company.com"
  }
]
```

Then generate roadmaps for each to see different AI specialization paths!

---

## Troubleshooting Common Issues

### Backend Won't Start
```
Error: ModuleNotFoundError: No module named 'fastapi'
→ Solution: pip install -r requirements.txt
```

### Claude API Error
```
Error: API key not found
→ Solution: export ANTHROPIC_API_KEY='your-key'
```

### Frontend Can't Connect to Backend
```
Error: Connection refused on http://localhost:8000
→ Solution: 
  1. Verify backend is running
  2. Check NEXT_PUBLIC_API_BASE_URL is correct
  3. Restart frontend: npm run dev
```

### CORS Error
```
Error: CORS policy blocked request
→ Current setup allows all origins
→ If custom domain, update backend/main.py CORS settings
```

---

## Performance Notes

- **First roadmap generation**: 30-60 seconds (Claude API call)
- **Subsequent requests**: < 1 second (in-memory cache)
- **Course loading**: < 500ms
- **Team member CRUD**: < 100ms

---

## Next: Deployment

When ready to deploy:

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Push to GitHub, connect to Vercel
```

### Backend (Railway/Render)
```bash
cd backend
# Add to Git, deploy via Railway or Render
# Set environment var: ANTHROPIC_API_KEY
```

---

## Success Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] Can add team members
- [ ] Can generate roadmaps with Claude
- [ ] Can view and filter courses
- [ ] API docs visible at /docs
- [ ] No CORS errors in console
- [ ] Roadmaps contain realistic learning phases

**All systems go!** 🚀
