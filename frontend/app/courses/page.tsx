'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [filteredCourses, setFilteredCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/courses`)
      setCourses(res.data)
      setFilteredCourses(res.data)
    } catch (error) {
      console.error('Error loading courses:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = courses

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(c => c.category.toLowerCase() === selectedCategory.toLowerCase())
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(c => c.difficulty_level === selectedDifficulty)
    }

    setFilteredCourses(filtered)
  }, [selectedCategory, selectedDifficulty, courses])

  const categories = ['all', ...new Set(courses.map(c => c.category))]
  const difficulties = ['all', 'awareness', 'beginner', 'intermediate', 'advanced', 'expert']

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1>Free AI Training Courses</h1>

      {/* Filters */}
      <div style={{
        background: '#f9fafb',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        marginBottom: '2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.25rem'
            }}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Difficulty
          </label>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.25rem'
            }}
          >
            {difficulties.map(diff => (
              <option key={diff} value={diff}>
                {diff.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div style={{ fontSize: '0.875rem', color: '#666' }}>Results</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{filteredCourses.length}</div>
        </div>
      </div>

      {/* Courses Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}>
        {filteredCourses.map(course => (
          <div
            key={course.id}
            style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Header */}
            <div style={{
              background: '#f3f4f6',
              padding: '1rem',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <div style={{
                fontSize: '0.75rem',
                color: '#666',
                marginBottom: '0.25rem'
              }}>
                {course.provider}
              </div>
              <h3 style={{ margin: '0.25rem 0' }}>{course.title}</h3>
            </div>

            {/* Content */}
            <div style={{ padding: '1rem', flex: 1 }}>
              <div style={{ marginBottom: '1rem' }}>
                <span style={{
                  background: '#dbeafe',
                  color: '#0369a1',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  {course.category}
                </span>
                <span style={{
                  background: '#fef3c7',
                  color: '#92400e',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  marginLeft: '0.5rem'
                }}>
                  {course.difficulty_level}
                </span>
              </div>

              <div style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1rem' }}>
                {course.duration_hours && (
                  <div>⏱️ {course.duration_hours} hours</div>
                )}
                {course.tags?.length > 0 && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#999' }}>Tags:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.25rem' }}>
                      {course.tags.map((tag: string, i: number) => (
                        <span
                          key={i}
                          style={{
                            background: '#e5e7eb',
                            padding: '0.1rem 0.5rem',
                            borderRadius: '0.1rem',
                            fontSize: '0.7rem'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div style={{
              padding: '1rem',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              gap: '0.5rem'
            }}>
              <a
                href={course.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  background: '#1e40af',
                  color: 'white',
                  padding: '0.5rem',
                  textAlign: 'center',
                  textDecoration: 'none',
                  borderRadius: '0.25rem',
                  fontSize: '0.875rem'
                }}
              >
                Visit Course
              </a>
              <button
                onClick={() => alert('Add to learning plan coming soon!')}
                style={{
                  background: '#16a34a',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          background: '#f9fafb',
          borderRadius: '0.5rem',
          color: '#666'
        }}>
          No courses match your filters. Try adjusting your selection!
        </div>
      )}
    </div>
  )
}
