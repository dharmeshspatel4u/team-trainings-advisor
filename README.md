# AI Training Advisor for Engineering Teams 🤖

A smart platform to suggest personalized AI training roadmaps for your 5 engineering roles:
- DevOps Engineers
- Senior DevOps Engineers  
- SRE Engineers
- Cloud Engineers
- Platform Engineers

## What It Does

Select any engineering role and instantly get:
- ✅ **Current skills** they typically have
- 🎯 **Target AI skills** they need to learn
- 📚 **20+ free recommended courses** curated for that role
- 🗺️ **Suggested 3-6 month learning path**

No team member tracking needed - just recommendations for each role!

## Features

### 1. Role-Based Course Recommendations
Click on any role card to see:
- What skills they currently have (Kubernetes, Docker, Infrastructure, etc.)
- What AI skills they need (MLOps, Model Serving, LLMOps, etc.)
- Exact courses recommended for their transition to AI

### 2. 20+ Free Courses
Curated from top providers:
- **Fast.ai** - ML fundamentals
- **Anthropic** - Claude API & GenAI
- **Google Cloud** - Vertex AI
- **AWS** - SageMaker
- **MLOps.community** - MLOps tools
- Plus many more!

### 3. Personalized Skill Mapping
Each role has a clear AI transition path:
- **DevOps** → AI DevOps Engineer (MLOps pipelines)
- **Senior DevOps** → MLOps Architect (platform design)
- **SRE** → AI/ML SRE (model monitoring)
- **Cloud Engineer** → Cloud AI Engineer (managed ML services)
- **Platform Engineer** → AI Platform Engineer (ML tooling)

## Quick Start

### 1. Setup Backend
```bash
cd backend

# Create environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set API key
export ANTHROPIC_API_KEY='your-api-key'

# Run (port 8000)
python main.py
```

### 2. Setup Frontend
```bash
cd frontend

# Install & run (port 3000)
npm install
npm run dev
```

### 3. View Recommendations
Open `http://localhost:3000`

**That's it!** Click on any role to see AI course recommendations.

## How to Use

1. **Home Page** = Role selector with course recommendations
2. **Select a Role** - Click any engineering role card
3. **View Recommendations** - See:
   - Current skills
   - Target AI skills
   - All recommended courses
   - Suggested learning timeline
4. **Start Learning** - Click "Start Learning" on any course

## Architecture

```
Backend (FastAPI)
├── Role skills data (who has what, who needs what)
├── Course catalog (20+ free courses)
├── Skills matching API
└── Claude API (optional: AI-powered personalization)

Frontend (Next.js)
├── Role selector (5 role cards)
├── Skills display (current vs target)
└── Course browser (filtered recommendations)
```

## Project Structure

```
backend/
├── main.py              # FastAPI server
├── models/              # Data schemas  
├── services/            # Business logic
└── data/
    ├── role_skills.json      # Skills per role
    └── course_catalog.json   # 20+ free courses

frontend/
├── app/page.tsx         # Main dashboard (role selector)
├── app/layout.tsx       # Navigation
└── package.json
```

## What Each Role Should Learn

### DevOps Engineer → AI DevOps
Learn: MLOps, Kubernetes ML, Model deployment, CI/CD for ML
Courses: MLflow, Kubeflow, Docker for ML, Model monitoring

### Senior DevOps → MLOps Architect  
Learn: ML platform design, Feature stores, Model registry, ML governance
Courses: Advanced MLOps, Feast, Orchestra, ML governance patterns

### SRE → AI/ML SRE
Learn: Model monitoring, Data monitoring, LLM observability, Incident response for ML
Courses: ML model health, Drift detection, LLM monitoring

### Cloud Engineer → Cloud AI Engineer
Learn: Managed ML services, LLM APIs, Vector databases, RAG systems
Courses: SageMaker, Vertex AI, Claude API, Vector DBs

### Platform Engineer → AI Platform Engineer
Learn: ML platform architecture, Feature management, LLM frameworks
Courses: ML platform design, LangChain, Ray, ML developer UX

## Sample Data

### 20+ Free Courses Included
- Fast.ai ML course
- Google Cloud Vertex AI
- AWS SageMaker  
- Anthropic Claude docs
- MLflow tutorials
- Kubeflow guides
- LLM fundamentals
- RAG systems
- Vector databases
- And more!

### Skill Frameworks
Complete skill mapping for each role with:
- Proficiency levels (beginner → advanced)
- Skill categories (MLOps, Cloud, GenAI, etc.)
- Current vs target skills

## API Endpoints

Optional - Frontend handles everything:

```bash
# Get role info
GET /api/skills/role/{role}/info

# Get current skills
GET /api/skills/role/{role}/current

# Get target AI skills  
GET /api/skills/role/{role}/target

# Get all courses
GET /api/courses

# Filter courses
GET /api/courses/category/{category}
GET /api/courses/difficulty/{level}
```

Swagger docs: `http://localhost:8000/docs`

## Customization

### Add New Courses
Edit `backend/data/course_catalog.json`:
```json
{
  "id": "course_id",
  "title": "Course Name",
  "provider": "Provider",
  "url": "https://course-link.com",
  "duration_hours": 20,
  "category": "MLOps",
  "difficulty_level": "intermediate",
  "tags": ["kubernetes", "ml"],
  "is_free": true
}
```

### Customize Role Skills
Edit `backend/data/role_skills.json`:
```json
{
  "your_role": {
    "role_name": "Your Role",
    "target_ai_role": "AI Role",
    "current_skills": [...],
    "target_skills": [...]
  }
}
```

## Environment Variables

```bash
# Backend
export ANTHROPIC_API_KEY='your-key'

# Frontend (optional)
export NEXT_PUBLIC_API_BASE_URL='http://localhost:8000'
```

## Why These Courses?

All 20+ courses are **100% free**:
- No paywalls
- No subscriptions required
- From trusted providers (Fast.ai, Google, AWS, Anthropic)
- Hands-on projects
- Updated regularly

## Next Steps for Your Team

1. **Pick a course** for each role
2. **Create learning timeline** (suggest 3-6 months)
3. **Assign team members** to courses
4. **Track progress** (coming soon)
5. **Share learnings** with team

## Troubleshooting

**"Connection refused"**
- Ensure backend runs on port 8000: `python main.py`
- Check frontend API URL: `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000`

**Courses not loading**
- Verify `backend/data/course_catalog.json` exists
- Check JSON syntax: `python -m json.tool backend/data/course_catalog.json`

**API errors**
- Check backend logs in terminal
- Verify Python dependencies: `pip install -r requirements.txt`

## Support

For questions about:
- **Courses** - Check course provider websites
- **Setup** - See TESTING_GUIDE.md
- **Customization** - Edit JSON files in `backend/data/`

---

**Built with**: FastAPI • Next.js • Claude • ❤️

Start upskilling your team toward AI today! 🚀

