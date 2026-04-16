from pydantic import BaseModel
from typing import List, Optional
from enum import Enum
from datetime import datetime

class RoleType(str, Enum):
    DEVOPS = "devops"
    SENIOR_DEVOPS = "senior_devops"
    SRE = "sre"
    CLOUD_ENGINEER = "cloud_engineer"
    PLATFORM_ENGINEER = "platform_engineer"

class ProficiencyLevel(str, Enum):
    AWARENESS = "awareness"
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"

class Skill(BaseModel):
    id: Optional[str] = None
    name: str
    category: str
    description: Optional[str] = None
    level: ProficiencyLevel

class TeamMember(BaseModel):
    id: Optional[str] = None
    name: str
    role: RoleType
    email: str
    current_skills: List[Skill]
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class TrainingPhase(BaseModel):
    phase_number: int
    title: str
    duration_weeks: int
    description: str
    skills_to_learn: List[str]
    recommended_courses: List[str]
    projects: List[str]

class TrainingRoadmap(BaseModel):
    id: Optional[str] = None
    team_member_id: str
    team_member_name: str
    current_role: RoleType
    target_role: str
    target_skills: List[str]
    phases: List[TrainingPhase]
    total_duration_weeks: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class Course(BaseModel):
    id: Optional[str] = None
    title: str
    provider: str
    url: str
    duration_hours: Optional[int] = None
    difficulty_level: ProficiencyLevel
    category: str
    tags: List[str]
    is_free: bool = True
    recommended_for: Optional[List[str]] = None

class CourseRecommendation(BaseModel):
    course: Course
    reason: str
    phase: int
    estimated_completion_days: int
