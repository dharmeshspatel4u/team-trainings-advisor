'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'next/navigation'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export default function MemberPage() {
  const params = useParams()
  const memberId = params.id as string
  const [member, setMember] = useState<any>(null)
  const [roadmap, setRoadmap] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    loadData()
  }, [memberId])

  const loadData = async () => {
    try {
      setLoading(true)
      const memberRes = await axios.get(`${API_BASE}/api/team/members/${memberId}`)
      setMember(memberRes.data)

      // Try to load existing roadmap
      const roadmapsRes = await axios.get(`${API_BASE}/api/roadmaps/member/${memberId}`)
      if (roadmapsRes.data && roadmapsRes.data.length > 0) {
        setRoadmap(roadmapsRes.data[0])
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateRoadmap = async () => {
    try {
      setGenerating(true)
      const res = await axios.post(`${API_BASE}/api/roadmaps/generate?member_id=${memberId}`)
      setRoadmap(res.data)
    } catch (error) {
      console.error('Error generating roadmap:', error)
      alert('Error generating roadmap')
    } finally {
      setGenerating(false)
    }
  }

  if (loading) return <div>Loading...</div>
  if (!member) return <div>Member not found</div>

  return (
    <div>
      <h1>{member.name}'s AI Learning Path</h1>

      {/* Member Info */}
      <div style={{
        background: '#f0f9ff',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        marginBottom: '2rem',
        border: '1px solid #bfdbfe'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#666' }}>Current Role</div>
            <div style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>
              {member.role.replace('_', ' ').toUpperCase()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#666' }}>Email</div>
            <div style={{ fontWeight: 'bold' }}>{member.email}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#666' }}>Current Skills</div>
            <div style={{ fontWeight: 'bold' }}>{member.current_skills?.length || 0} skills</div>
          </div>
        </div>
      </div>

      {/* Current Skills */}
      {member.current_skills && member.current_skills.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h2>Current Skills</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '0.5rem'
          }}>
            {member.current_skills.map((skill: any, idx: number) => (
              <div
                key={idx}
                style={{
                  background: '#e0e7ff',
                  padding: '0.75rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.875rem'
                }}
              >
                <div><strong>{skill.name}</strong></div>
                <div style={{ color: '#666' }}>{skill.level}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Roadmap Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h2>AI Training Roadmap</h2>

        {!roadmap ? (
          <div style={{
            background: '#fef3c7',
            padding: '2rem',
            borderRadius: '0.5rem',
            textAlign: 'center',
            border: '1px solid #fde68a'
          }}>
            <p>No training roadmap generated yet.</p>
            <button
              onClick={generateRoadmap}
              disabled={generating}
              style={{
                background: '#d97706',
                color: 'white',
                padding: '0.75rem 2rem',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem',
                opacity: generating ? 0.5 : 1
              }}
            >
              {generating ? 'Generating...' : '🚀 Generate AI Roadmap'}
            </button>
          </div>
        ) : (
          <div>
            <div style={{
              background: '#f0fdf4',
              padding: '1rem',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
              border: '1px solid #bbf7d0'
            }}>
              <strong>Target Role:</strong> {roadmap.target_role} <br />
              <strong>Duration:</strong> {roadmap.total_duration_weeks} weeks
            </div>

            {/* Learning Phases */}
            {roadmap.phases?.map((phase: any, idx: number) => (
              <div
                key={idx}
                style={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  marginBottom: '1rem'
                }}
              >
                <h3 style={{ marginTop: 0 }}>
                  Phase {phase.phase_number}: {phase.title}
                </h3>
                <div style={{ color: '#666', marginBottom: '1rem' }}>
                  <strong>{phase.duration_weeks} weeks</strong> - {phase.description}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <strong>Skills to Learn:</strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {phase.skills_to_learn?.map((skill: string, i: number) => (
                      <span
                        key={i}
                        style={{
                          background: '#dbeafe',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem'
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {phase.recommended_courses && phase.recommended_courses.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Recommended Courses:</strong>
                    <ul style={{ marginTop: '0.5rem' }}>
                      {phase.recommended_courses.map((course: string, i: number) => (
                        <li key={i} style={{ marginBottom: '0.25rem' }}>{course}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {phase.projects && phase.projects.length > 0 && (
                  <div>
                    <strong>Projects:</strong>
                    <ul style={{ marginTop: '0.5rem' }}>
                      {phase.projects.map((project: string, i: number) => (
                        <li key={i} style={{ marginBottom: '0.25rem' }}>{project}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={generateRoadmap}
              style={{
                background: '#1e40af',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem',
                marginTop: '1rem'
              }}
            >
              🔄 Regenerate Roadmap
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
