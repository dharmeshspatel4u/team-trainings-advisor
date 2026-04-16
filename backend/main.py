from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from models import TeamMember, RoleType, Skill, TrainingRoadmap, Course, ProficiencyLevel
from services.team_service import TeamService
from services.skills_service import SkillsService
from services.course_service import CourseService
from services.roadmap_service import RoadmapService

# Initialize FastAPI app
app = FastAPI(
    title="Team Training Advisor API",
    description="AI-powered training roadmap generator for engineering teams",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== Team Management Routes ====================

@app.post("/api/team/members", response_model=TeamMember)
def create_team_member(member: TeamMember):
    """Create a new team member"""
    created_member = TeamService.create_team_member(member)
    return created_member

@app.get("/api/team/members", response_model=List[TeamMember])
def list_team_members():
    """Get all team members"""
    return TeamService.list_team_members()

@app.get("/api/team/members/{member_id}", response_model=TeamMember)
def get_team_member(member_id: str):
    """Get a specific team member"""
    member = TeamService.get_team_member(member_id)
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")
    return member

@app.put("/api/team/members/{member_id}", response_model=TeamMember)
def update_team_member(member_id: str, member: TeamMember):
    """Update a team member"""
    updated_member = TeamService.update_team_member(member_id, member)
    if not updated_member:
        raise HTTPException(status_code=404, detail="Team member not found")
    return updated_member

@app.delete("/api/team/members/{member_id}")
def delete_team_member(member_id: str):
    """Delete a team member"""
    if not TeamService.delete_team_member(member_id):
        raise HTTPException(status_code=404, detail="Team member not found")
    return {"message": "Team member deleted successfully"}

@app.get("/api/team/members/role/{role}", response_model=List[TeamMember])
def get_team_by_role(role: RoleType):
    """Get all team members with a specific role"""
    return TeamService.list_by_role(role)

# ==================== Skills Management Routes ====================

@app.get("/api/skills/role/{role}/current", response_model=List[Skill])
def get_role_current_skills(role: RoleType):
    """Get current skills for a role"""
    return SkillsService.get_role_current_skills(role)

@app.get("/api/skills/role/{role}/target", response_model=List[Skill])
def get_role_target_skills(role: RoleType):
    """Get target AI skills for a role"""
    return SkillsService.get_role_target_skills(role)

@app.get("/api/skills/role/{role}/gaps", response_model=List[Skill])
def get_skill_gaps(role: RoleType):
    """Get skill gaps (target skills not yet acquired) for a role"""
    return SkillsService.get_skill_gaps(role)

@app.get("/api/skills/role/{role}/info")
def get_role_info(role: RoleType):
    """Get detailed role information"""
    return SkillsService.get_role_info(role)

@app.post("/api/team/members/{member_id}/skills", response_model=TeamMember)
def add_skill_to_member(member_id: str, skill: Skill):
    """Add a skill to a team member"""
    updated_member = TeamService.add_skill(member_id, skill)
    if not updated_member:
        raise HTTPException(status_code=404, detail="Team member not found")
    return updated_member

@app.delete("/api/team/members/{member_id}/skills/{skill_name}")
def remove_skill_from_member(member_id: str, skill_name: str):
    """Remove a skill from a team member"""
    updated_member = TeamService.remove_skill(member_id, skill_name)
    if not updated_member:
        raise HTTPException(status_code=404, detail="Team member not found")
    return updated_member

# ==================== Course Catalog Routes ====================

@app.get("/api/courses", response_model=List[Course])
def list_all_courses():
    """Get all courses in the catalog"""
    return CourseService.get_all_courses()

@app.get("/api/courses/role/{role}", response_model=List[Course])
def get_courses_for_role(role: RoleType):
    """Get courses recommended for a specific role"""
    return CourseService.get_courses_for_role(role.value)

@app.get("/api/courses/category/{category}", response_model=List[Course])
def get_courses_by_category(category: str):
    """Get courses by category"""
    return CourseService.get_courses_by_category(category)

@app.get("/api/courses/difficulty/{difficulty}", response_model=List[Course])
def get_courses_by_difficulty(difficulty: ProficiencyLevel):
    """Get courses by difficulty level"""
    return CourseService.get_courses_by_difficulty(difficulty)

@app.get("/api/courses/tag/{tag}", response_model=List[Course])
def get_courses_by_tag(tag: str):
    """Get courses by tag"""
    return CourseService.get_courses_by_tag(tag)

@app.get("/api/courses/{course_id}", response_model=Course)
def get_course(course_id: str):
    """Get a specific course"""
    course = CourseService.get_course_by_id(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@app.get("/api/courses/skill/{skill_name}", response_model=List[Course])
def get_courses_for_skill(skill_name: str):
    """Get recommended courses for a skill"""
    return CourseService.get_recommended_courses_for_skill(skill_name)

# ==================== Training Roadmap Routes ====================

@app.post("/api/roadmaps/generate", response_model=TrainingRoadmap)
def generate_roadmap(member_id: str):
    """Generate a personalized training roadmap for a team member"""
    member = TeamService.get_team_member(member_id)
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")

    roadmap = RoadmapService.generate_roadmap(member)
    return roadmap

@app.get("/api/roadmaps/{roadmap_id}", response_model=TrainingRoadmap)
def get_roadmap(roadmap_id: str):
    """Get a specific training roadmap"""
    roadmap = RoadmapService.get_roadmap(roadmap_id)
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    return roadmap

@app.get("/api/roadmaps/member/{member_id}", response_model=List[TrainingRoadmap])
def get_member_roadmaps(member_id: str):
    """Get all roadmaps for a team member"""
    return RoadmapService.list_roadmaps_for_member(member_id)

# ==================== Health Check ====================

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Team Training Advisor API"}

@app.get("/")
def root():
    """Root endpoint with API documentation link"""
    return {
        "message": "Team Training Advisor API",
        "docs": "/docs",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
