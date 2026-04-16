import json
from typing import List, Dict, Optional
from pathlib import Path
from models import Course, ProficiencyLevel

class CourseService:
    _course_catalog_cache: List[Dict] = None

    @classmethod
    def _load_course_catalog(cls) -> List[Dict]:
        """Load course catalog from JSON file"""
        if cls._course_catalog_cache is None:
            data_path = Path(__file__).parent.parent / "data" / "course_catalog.json"
            with open(data_path, 'r') as f:
                catalog = json.load(f)
                cls._course_catalog_cache = catalog.get("courses", [])
        return cls._course_catalog_cache

    @classmethod
    def get_all_courses(cls) -> List[Course]:
        """Get all courses in the catalog"""
        catalog = cls._load_course_catalog()
        return [
            Course(
                id=course.get("id"),
                title=course["title"],
                provider=course["provider"],
                url=course["url"],
                duration_hours=course.get("duration_hours"),
                difficulty_level=ProficiencyLevel(course.get("difficulty_level", "beginner")),
                category=course["category"],
                tags=course.get("tags", []),
                is_free=course.get("is_free", True)
            )
            for course in catalog
        ]

    @classmethod
    def get_courses_by_category(cls, category: str) -> List[Course]:
        """Get courses by category"""
        all_courses = cls.get_all_courses()
        return [c for c in all_courses if c.category.lower() == category.lower()]

    @classmethod
    def get_courses_by_difficulty(cls, difficulty_level: ProficiencyLevel) -> List[Course]:
        """Get courses by difficulty level"""
        all_courses = cls.get_all_courses()
        return [c for c in all_courses if c.difficulty_level == difficulty_level]

    @classmethod
    def get_courses_by_tag(cls, tag: str) -> List[Course]:
        """Get courses by tag"""
        all_courses = cls.get_all_courses()
        return [c for c in all_courses if tag.lower() in [t.lower() for t in c.tags]]

    @classmethod
    def get_course_by_id(cls, course_id: str) -> Optional[Course]:
        """Get a course by ID"""
        all_courses = cls.get_all_courses()
        return next((c for c in all_courses if c.id == course_id), None)

    @classmethod
    def get_recommended_courses_for_skill(cls, skill_name: str, max_results: int = 5) -> List[Course]:
        """Get recommended courses for a specific skill"""
        all_courses = cls.get_all_courses()
        # Search in tags and title
        skill_lower = skill_name.lower()
        matching_courses = [
            c for c in all_courses
            if skill_lower in [t.lower() for t in c.tags] or skill_lower in c.title.lower()
        ]
        return matching_courses[:max_results]

    @classmethod
    def get_learning_path_courses(cls, category: str, max_difficulty: str = "advanced") -> List[Course]:
        """Get a learning path: beginner -> intermediate -> advanced for a category"""
        courses_in_category = cls.get_courses_by_category(category)

        # Sort by difficulty
        difficulty_order = {"awareness": 0, "beginner": 1, "intermediate": 2, "advanced": 3, "expert": 4}
        difficulty = ProficiencyLevel(max_difficulty)
        max_difficulty_value = difficulty_order.get(max_difficulty, 3)

        sorted_courses = sorted(
            courses_in_category,
            key=lambda c: difficulty_order.get(c.difficulty_level.value, 0)
        )

        return [c for c in sorted_courses if difficulty_order.get(c.difficulty_level.value, 0) <= max_difficulty_value]
