import json
from typing import List, Dict, Optional
from pathlib import Path
from models import Skill, RoleType, ProficiencyLevel

class SkillsService:
    _role_skills_cache: Dict = None

    @classmethod
    def _load_role_skills(cls) -> Dict:
        """Load role skills from JSON file"""
        if cls._role_skills_cache is None:
            data_path = Path(__file__).parent.parent / "data" / "role_skills.json"
            with open(data_path, 'r') as f:
                cls._role_skills_cache = json.load(f)
        return cls._role_skills_cache

    @classmethod
    def get_role_current_skills(cls, role: RoleType) -> List[Skill]:
        """Get the predefined current skills for a role"""
        role_skills = cls._load_role_skills()
        role_key = role.value

        if role_key not in role_skills:
            return []

        current_skills_data = role_skills[role_key].get("current_skills", [])
        return [
            Skill(
                name=skill["name"],
                category=skill["category"],
                description=skill.get("description"),
                level=ProficiencyLevel(skill["level"])
            )
            for skill in current_skills_data
        ]

    @classmethod
    def get_role_target_skills(cls, role: RoleType) -> List[Skill]:
        """Get the target AI skills for a role"""
        role_skills = cls._load_role_skills()
        role_key = role.value

        if role_key not in role_skills:
            return []

        target_skills_data = role_skills[role_key].get("target_skills", [])
        return [
            Skill(
                name=skill["name"],
                category=skill["category"],
                description=skill.get("description"),
                level=ProficiencyLevel(skill["level"])
            )
            for skill in target_skills_data
        ]

    @classmethod
    def get_role_info(cls, role: RoleType) -> Dict:
        """Get complete role information"""
        role_skills = cls._load_role_skills()
        role_key = role.value

        if role_key not in role_skills:
            return {}

        role_data = role_skills[role_key]
        return {
            "role_name": role_data.get("role_name"),
            "target_ai_role": role_data.get("target_ai_role"),
            "current_skills_count": len(role_data.get("current_skills", [])),
            "target_skills_count": len(role_data.get("target_skills", [])),
        }

    @classmethod
    def get_skill_gaps(cls, role: RoleType, current_level_threshold: str = "intermediate") -> List[Skill]:
        """Get skills that need to be learned (gap analysis)"""
        target_skills = cls.get_role_target_skills(role)
        current_skills = cls.get_role_current_skills(role)

        current_skill_names = {s.name.lower() for s in current_skills}

        # Return target skills not in current skills
        return [s for s in target_skills if s.name.lower() not in current_skill_names]

    @classmethod
    def get_skill_by_category(cls, category: str) -> List[Skill]:
        """Get all target skills in a given category across all roles"""
        role_skills = cls._load_role_skills()
        skills_by_category = []

        for role_data in role_skills.values():
            for skill_data in role_data.get("target_skills", []):
                if skill_data.get("category", "").lower() == category.lower():
                    skill = Skill(
                        name=skill_data["name"],
                        category=skill_data["category"],
                        description=skill_data.get("description"),
                        level=ProficiencyLevel(skill_data["level"])
                    )
                    # Avoid duplicates
                    if not any(s.name.lower() == skill.name.lower() for s in skills_by_category):
                        skills_by_category.append(skill)

        return skills_by_category
