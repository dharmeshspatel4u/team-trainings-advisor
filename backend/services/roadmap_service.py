import json
import uuid
from datetime import datetime
from typing import List, Optional
from anthropic import Anthropic
from models import TrainingRoadmap, TrainingPhase, TeamMember, RoleType
from services.skills_service import SkillsService
from services.course_service import CourseService

# Initialize Anthropic client
client = Anthropic()

class RoadmapService:
    ROADMAP_DATA = {}

    @staticmethod
    def generate_roadmap(team_member: TeamMember) -> TrainingRoadmap:
        """Generate a personalized AI training roadmap using Claude"""

        # Get role information
        role_info = SkillsService.get_role_info(team_member.role)
        target_skills = SkillsService.get_role_target_skills(team_member.role)
        skill_gaps = SkillsService.get_skill_gaps(team_member.role)

        # Current skills summary
        current_skills_text = ", ".join([f"{s.name} ({s.level.value})" for s in team_member.current_skills])

        # Target skills
        target_skills_text = ", ".join([s.name for s in target_skills])

        # Create a prompt for Claude
        prompt = f"""You are an expert AI training advisor for engineering teams. Create a detailed 3-6 month personalized AI training roadmap.

TEAM MEMBER PROFILE:
- Name: {team_member.name}
- Current Role: {team_member.role.value.replace('_', ' ').title()}
- Target Role: {role_info.get('target_ai_role', 'AI-focused role')}
- Current Skills: {current_skills_text}

TARGET SKILLS TO ACQUIRE:
{', '.join([s.name for s in target_skills])}

AVAILABLE FREE COURSES:
{json.dumps(self._get_available_courses_summary(), indent=2)}

Please create a structured learning roadmap with:
1. 3-4 learning phases (Foundation, Intermediate, Advanced)
2. Each phase should include:
   - Phase title and duration (in weeks)
   - Key skills to learn in this phase
   - Recommended courses (from the available list)
   - Hands-on projects to apply the learning
3. Total estimated duration

Format the response as JSON with this structure:
{{
    "phases": [
        {{
            "phase_number": 1,
            "title": "Phase title",
            "duration_weeks": 8,
            "description": "What this phase covers",
            "skills_to_learn": ["skill1", "skill2"],
            "recommended_courses": ["course_title_1", "course_title_2"],
            "projects": ["project_1", "project_2"]
        }}
    ],
    "total_duration_weeks": 24,
    "learning_outcomes": "What the person will be able to do after completing the roadmap"
}}"""

        # Call Claude API
        try:
            message = client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=2000,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )

            response_text = message.content[0].text

            # Parse JSON from response
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1
            if json_start >= 0 and json_end > json_start:
                roadmap_json = json.loads(response_text[json_start:json_end])
            else:
                roadmap_json = {"phases": [], "total_duration_weeks": 26}

        except Exception as e:
            print(f"Error calling Claude API: {e}")
            roadmap_json = RoadmapService._create_default_roadmap(team_member.role)

        # Convert to TrainingRoadmap model
        phases = []
        for phase_data in roadmap_json.get("phases", []):
            phase = TrainingPhase(
                phase_number=phase_data.get("phase_number", 0),
                title=phase_data.get("title", "Learning Phase"),
                duration_weeks=phase_data.get("duration_weeks", 8),
                description=phase_data.get("description", ""),
                skills_to_learn=phase_data.get("skills_to_learn", []),
                recommended_courses=phase_data.get("recommended_courses", []),
                projects=phase_data.get("projects", [])
            )
            phases.append(phase)

        roadmap = TrainingRoadmap(
            id=str(uuid.uuid4()),
            team_member_id=team_member.id,
            team_member_name=team_member.name,
            current_role=team_member.role,
            target_role=role_info.get("target_ai_role", "AI Role"),
            target_skills=[s.name for s in target_skills],
            phases=phases,
            total_duration_weeks=roadmap_json.get("total_duration_weeks", 26),
            created_at=datetime.now(),
            updated_at=datetime.now()
        )

        # Store roadmap
        RoadmapService.ROADMAP_DATA[roadmap.id] = roadmap
        return roadmap

    @staticmethod
    def get_roadmap(roadmap_id: str) -> Optional[TrainingRoadmap]:
        """Retrieve a stored roadmap"""
        return RoadmapService.ROADMAP_DATA.get(roadmap_id)

    @staticmethod
    def list_roadmaps_for_member(team_member_id: str) -> List[TrainingRoadmap]:
        """Get all roadmaps for a team member"""
        return [r for r in RoadmapService.ROADMAP_DATA.values() if r.team_member_id == team_member_id]

    @staticmethod
    def _get_available_courses_summary() -> dict:
        """Get a summary of available courses for the prompt"""
        all_courses = CourseService.get_all_courses()
        courses_by_category = {}
        for course in all_courses:
            if course.category not in courses_by_category:
                courses_by_category[course.category] = []
            courses_by_category[course.category].append({
                "title": course.title,
                "provider": course.provider,
                "duration_hours": course.duration_hours,
                "difficulty": course.difficulty_level.value,
                "tags": course.tags
            })
        return courses_by_category

    @staticmethod
    def _create_default_roadmap(role: RoleType) -> dict:
        """Create a default roadmap structure if Claude API fails"""
        role_map = {
            RoleType.DEVOPS: {
                "target": "AI DevOps Engineer",
                "phases": ["MLOps Fundamentals", "Kubernetes for ML", "Model Deployment"]
            },
            RoleType.SENIOR_DEVOPS: {
                "target": "MLOps Architect",
                "phases": ["Advanced MLOps", "ML Platform Design", "Feature Stores & Governance"]
            },
            RoleType.SRE: {
                "target": "AI/ML SRE",
                "phases": ["ML Monitoring", "LLM Observability", "ML Incident Response"]
            },
            RoleType.CLOUD_ENGINEER: {
                "target": "Cloud AI Engineer",
                "phases": ["Managed ML Services", "GenAI Fundamentals", "RAG & Vector DBs"]
            },
            RoleType.PLATFORM_ENGINEER: {
                "target": "AI Platform Engineer",
                "phases": ["ML Platform Architecture", "Feature Stores", "LLM Application Frameworks"]
            },
        }

        role_data = role_map.get(role, {"target": "AI Role", "phases": ["Phase 1", "Phase 2", "Phase 3"]})

        return {
            "phases": [
                {
                    "phase_number": i + 1,
                    "title": phase,
                    "duration_weeks": 8,
                    "description": f"Learn {phase}",
                    "skills_to_learn": [phase],
                    "recommended_courses": [],
                    "projects": [f"Build {phase} project"]
                }
                for i, phase in enumerate(role_data["phases"])
            ],
            "total_duration_weeks": 24
        }
