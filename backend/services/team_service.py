from typing import List, Optional, Dict
import json
import uuid
from datetime import datetime
from models import TeamMember, RoleType, Skill, ProficiencyLevel

TEAM_DATA = {}

class TeamService:
    @staticmethod
    def create_team_member(member: TeamMember) -> TeamMember:
        """Create a new team member"""
        if not member.id:
            member.id = str(uuid.uuid4())
        member.created_at = datetime.now()
        member.updated_at = datetime.now()
        TEAM_DATA[member.id] = member
        return member

    @staticmethod
    def get_team_member(member_id: str) -> Optional[TeamMember]:
        """Get a team member by ID"""
        return TEAM_DATA.get(member_id)

    @staticmethod
    def list_team_members() -> List[TeamMember]:
        """List all team members"""
        return list(TEAM_DATA.values())

    @staticmethod
    def list_by_role(role: RoleType) -> List[TeamMember]:
        """Get all team members with a specific role"""
        return [m for m in TEAM_DATA.values() if m.role == role]

    @staticmethod
    def update_team_member(member_id: str, member: TeamMember) -> Optional[TeamMember]:
        """Update a team member"""
        if member_id not in TEAM_DATA:
            return None
        member.id = member_id
        member.updated_at = datetime.now()
        TEAM_DATA[member_id] = member
        return member

    @staticmethod
    def delete_team_member(member_id: str) -> bool:
        """Delete a team member"""
        if member_id in TEAM_DATA:
            del TEAM_DATA[member_id]
            return True
        return False

    @staticmethod
    def add_skill(member_id: str, skill: Skill) -> Optional[TeamMember]:
        """Add a skill to a team member"""
        member = TeamService.get_team_member(member_id)
        if not member:
            return None
        if not skill.id:
            skill.id = str(uuid.uuid4())
        # Check if skill already exists
        existing_skill_idx = next((i for i, s in enumerate(member.current_skills) if s.name.lower() == skill.name.lower()), None)
        if existing_skill_idx is not None:
            member.current_skills[existing_skill_idx] = skill
        else:
            member.current_skills.append(skill)
        member.updated_at = datetime.now()
        TEAM_DATA[member_id] = member
        return member

    @staticmethod
    def remove_skill(member_id: str, skill_name: str) -> Optional[TeamMember]:
        """Remove a skill from a team member"""
        member = TeamService.get_team_member(member_id)
        if not member:
            return None
        member.current_skills = [s for s in member.current_skills if s.name.lower() != skill_name.lower()]
        member.updated_at = datetime.now()
        TEAM_DATA[member_id] = member
        return member

    @staticmethod
    def update_skill_level(member_id: str, skill_name: str, new_level: ProficiencyLevel) -> Optional[TeamMember]:
        """Update the proficiency level of a skill"""
        member = TeamService.get_team_member(member_id)
        if not member:
            return None
        for skill in member.current_skills:
            if skill.name.lower() == skill_name.lower():
                skill.level = new_level
        member.updated_at = datetime.now()
        TEAM_DATA[member_id] = member
        return member
