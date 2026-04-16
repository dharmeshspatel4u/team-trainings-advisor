'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

const ROLES = [
  { key: 'devops', label: 'DevOps Engineer', icon: '⚙️' },
  { key: 'senior_devops', label: 'Senior DevOps Engineer', icon: '🏆' },
  { key: 'sre', label: 'SRE Engineer', icon: '🔍' },
  { key: 'cloud_engineer', label: 'Cloud Engineer', icon: '☁️' },
  { key: 'platform_engineer', label: 'Platform Engineer', icon: '🏗️' },
]

export default function Dashboard() {
  const [selectedRole, setSelectedRole] = useState('devops')
  const [selectedPhase, setSelectedPhase] = useState(0)
  const [roleInfo, setRoleInfo] = useState<any>(null)
  const [targetSkills, setTargetSkills] = useState<any[]>([])
  const [currentSkills, setCurrentSkills] = useState<any[]>([])
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadRoleData()
  }, [selectedRole])

  const loadRoleData = async () => {
    try {
      setLoading(true)
      const [infoRes, targetRes, currentRes, coursesRes] = await Promise.all([
        axios.get(`${API_BASE}/api/skills/role/${selectedRole}/info`),
        axios.get(`${API_BASE}/api/skills/role/${selectedRole}/target`),
        axios.get(`${API_BASE}/api/skills/role/${selectedRole}/current`),
        axios.get(`${API_BASE}/api/courses`),
      ])

      setRoleInfo(infoRes.data)
      setTargetSkills(targetRes.data)
      setCurrentSkills(currentRes.data)
      setCourses(coursesRes.data)
    } catch (error) {
      console.error('Error loading role data:', error)
    } finally {
      setLoading(false)
    }
  }

  const roleData = ROLES.find(r => r.key === selectedRole)

  // Role details with MUST have and SHOULD have skills
  const roleDetails: Record<string, any> = {
    devops: {
      overview: 'DevOps Engineers automate, deploy, and maintain infrastructure and applications. They bridge development and operations for rapid, reliable software delivery.',
      responsibilities: [
        'Provision and manage cloud resources (Google Cloud, on-premises VMs)',
        'Design and implement CI/CD pipelines using Jenkins and Groovy',
        'Write shell scripts for system administration and automation',
        'Set up monitoring, logging, dashboards, and log-based alerts',
        'Manage Kubernetes clusters, OS patching, and managed services upgrades',
        'Implement Infrastructure as Code using Terraform and Google Cloud Build'
      ],
      mustHave: [
        'Jenkins', 'Groovy', 'Shell Scripting', 'Google Cloud Platform', 'Kubernetes',
        'Docker', 'Cloud Build', 'Monitoring Tools', 'Terraform', 'Linux Admin'
      ],
      shouldHave: [
        'Python', 'Multi-cloud', 'Cloud Security', 'GitOps', 'Helm',
        'Cost Optimization', 'Configuration Management', 'SRE Practices'
      ],
      criticalPhases: ['Phase 1', 'Phase 3', 'Phase 5', 'Phase 6']
    },
    senior_devops: {
      overview: 'Senior DevOps Engineers architect large-scale infrastructure and lead MLOps platform design.',
      responsibilities: [
        'Design and architect enterprise-scale infrastructure',
        'Lead MLOps and AI platform initiatives',
        'Implement advanced observability solutions',
        'Drive automation and efficiency across the organization',
        'Mentor and guide junior engineers'
      ],
      mustHave: [
        'Advanced Kubernetes', 'Terraform Modules', 'Advanced Monitoring',
        'CI/CD Design', 'Infrastructure Architecture'
      ],
      shouldHave: [
        'MLOps Architecture', 'ML Platform Design', 'Feature Stores',
        'Model Registry', 'Python ML Systems'
      ],
      criticalPhases: ['Phase 1', 'Phase 3', 'Phase 5', 'Phase 6']
    },
    sre: {
      overview: 'SRE Engineers focus on reliability, availability, and performance.',
      responsibilities: [
        'Ensure system reliability and uptime',
        'Manage incident response and post-mortems',
        'Optimize system performance',
        'Implement observability and alerting'
      ],
      mustHave: [
        'Kubernetes', 'Monitoring', 'Incident Management', 'Performance Tuning',
        'Infrastructure Automation', 'Linux', 'Shell Scripting', 'Log Analysis'
      ],
      shouldHave: [
        'Python', 'Cloud Platforms', 'APM Tools', 'Distributed Tracing',
        'Custom Metrics', 'Cost Analysis', 'Chaos Engineering'
      ],
      criticalPhases: ['Phase 1', 'Phase 4', 'Phase 6', 'Phase 7']
    },
    cloud_engineer: {
      overview: 'Cloud Engineers design and manage cloud infrastructure and services.',
      responsibilities: [
        'Design cloud architecture',
        'Provision and manage cloud resources',
        'Implement cloud security and compliance',
        'Optimize cloud costs and usage'
      ],
      mustHave: [
        'Cloud Platform', 'Cloud Architecture', 'Networking', 'Cost Optimization',
        'Infrastructure as Code', 'Cloud Security', 'Managed Services', 'Docker'
      ],
      shouldHave: [
        'Kubernetes on Cloud', 'Multi-cloud', 'Disaster Recovery',
        'Cloud Migration', 'Cloud Automation', 'Cloud Monitoring'
      ],
      criticalPhases: ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 6']
    },
    platform_engineer: {
      overview: 'Platform Engineers design Internal Developer Platforms.',
      responsibilities: [
        'Design Internal Developer Platforms',
        'Improve developer experience',
        'Maintain CI/CD infrastructure',
        'Design deployment strategies'
      ],
      mustHave: [
        'Kubernetes', 'CI/CD Platforms', 'IDP Design', 'Microservices',
        'API Design', 'Infrastructure as Code', 'Docker', 'DevX'
      ],
      shouldHave: [
        'Service Mesh', 'API Gateways', 'Platform Observability',
        'Multi-tenancy', 'Helm', 'GitOps', 'Go/Rust'
      ],
      criticalPhases: ['Phase 1', 'Phase 4', 'Phase 5', 'Phase 6']
    }
  }

  const currentRoleDetails = roleDetails[selectedRole as keyof typeof roleDetails] || {
    overview: 'Professional DevOps and Infrastructure specialist',
    responsibilities: [],
    mustHave: [],
    shouldHave: [],
    criticalPhases: []
  }

  // Define course phases
  const coursePhases = [
    {
      phase: 'Phase 1: Prompt Engineering',
      categories: ['Prompt Engineering'],
      color: '#fef3c7',
      icon: '🎯',
      description: 'Foundation for all AI interactions. Learn one-shot and n-shot prompting techniques.'
    },
    {
      phase: 'Phase 2: Local LLMs',
      categories: ['Local LLMs'],
      color: '#c7d2fe',
      icon: '💻',
      description: 'Run language models locally using Ollama and Hugging Face.'
    },
    {
      phase: 'Phase 3: Cloud APIs',
      categories: ['Cloud LLM APIs', 'Programming'],
      color: '#d1d5db',
      icon: '☁️',
      description: 'Make API calls to production models using Python and scripting.'
    },
    {
      phase: 'Phase 4: AI Agents',
      categories: ['AI Agents'],
      color: '#eccfdf',
      icon: '🤖',
      description: 'Automate complex tasks using CrewAI framework.'
    },
    {
      phase: 'Phase 5: Workflow Automation',
      categories: ['Workflow Automation', 'CI/CD Automation'],
      color: '#d4f1d4',
      icon: '⚡',
      description: 'Integrate AI into CI/CD pipelines using N8N or Simaine.'
    },
    {
      phase: 'Phase 6: AIOps & Monitoring',
      categories: ['AIOps', 'Observability', 'AI Deployment'],
      color: '#fecaca',
      icon: '📊',
      description: 'Combine observability with AI for anomaly detection.'
    },
    {
      phase: 'Phase 7: Continuous Learning',
      categories: ['Continuous Learning'],
      color: '#b3e5fc',
      icon: '📚',
      description: 'Stay updated with AI/DevOps trends daily.'
    },
  ]

  // Group courses by phase
  const groupedCourses = coursePhases.map(p => ({
    ...p,
    courses: courses.filter(c => p.categories.includes(c.category))
  }))

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <h1>AI Training Recommendations by Role</h1>
      <p style={{ color: '#666', fontSize: '1.125rem' }}>
        Select a role to see recommended AI courses and learning path for upskilling
      </p>

      {/* Role Selection Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {ROLES.map(role => (
          <button
            key={role.key}
            onClick={() => setSelectedRole(role.key)}
            style={{
              padding: '1.5rem',
              borderRadius: '0.5rem',
              border: selectedRole === role.key ? '3px solid #1e40af' : '1px solid #e5e7eb',
              background: selectedRole === role.key ? '#f0f9ff' : 'white',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{role.icon}</div>
            <div style={{ fontWeight: 'bold', color: selectedRole === role.key ? '#1e40af' : '#1f2937' }}>
              {role.label}
            </div>
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Loading...</div>
      ) : (
        <div>
          {/* Role Info Section */}
          <div style={{
            background: '#f0f9ff',
            border: '2px solid #bfdbfe',
            borderRadius: '0.5rem',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <h2 style={{ marginTop: 0 }}>{roleData?.icon} {roleData?.label}</h2>
            <div style={{
              background: 'white',
              padding: '1rem',
              borderRadius: '0.25rem',
              marginBottom: '1rem',
              border: '1px solid #bfdbfe'
            }}>
              <strong>Target AI Role:</strong>
              <div style={{ fontSize: '1.25rem', color: '#1e40af', marginTop: '0.5rem' }}>
                {roleInfo?.target_ai_role || 'AI Specialist'}
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
              <h4 style={{ marginTop: 0 }}>📋 Role Overview</h4>
              <p style={{ margin: 0, color: '#555', lineHeight: '1.6' }}>
                {currentRoleDetails.overview}
              </p>
            </div>
          </div>

          {/* Responsibilities */}
          {currentRoleDetails.responsibilities.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3>🎯 Primary Responsibilities</h3>
              <ul style={{ lineHeight: '1.8', color: '#555' }}>
                {currentRoleDetails.responsibilities.map((resp, idx) => (
                  <li key={idx}>{resp}</li>
                ))}
              </ul>
            </div>
          )}

          {/* MUST Have Skills */}
          {currentRoleDetails.mustHave.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3>✅ MUST Have Skills</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '0.75rem'
              }}>
                {currentRoleDetails.mustHave.map((skill, idx) => (
                  <div key={idx}
                    style={{
                      background: '#dcfce7',
                      border: '1px solid #86efac',
                      padding: '1rem',
                      borderRadius: '0.5rem'
                    }}
                  >
                    <strong>✓ {skill}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SHOULD Have Skills */}
          {currentRoleDetails.shouldHave.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3>🌟 SHOULD Have Skills</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '0.75rem'
              }}>
                {currentRoleDetails.shouldHave.map((skill, idx) => (
                  <div key={idx}
                    style={{
                      background: '#fef3c7',
                      border: '1px solid #fde68a',
                      padding: '1rem',
                      borderRadius: '0.5rem'
                    }}
                  >
                    <strong>★ {skill}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Current Skills */}
          <div style={{ marginBottom: '2rem' }}>
            <h3>Current Skills</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '0.75rem'
            }}>
              {currentSkills.map((skill, idx) => (
                <div key={idx}
                  style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    padding: '1rem',
                    borderRadius: '0.5rem'
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>{skill.name}</div>
                  <div style={{ fontSize: '0.875rem', color: '#666' }}>
                    {skill.category} • {skill.level}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Target Skills */}
          <div style={{ marginBottom: '2rem' }}>
            <h3>Target AI Skills</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '0.75rem'
            }}>
              {targetSkills.map((skill, idx) => (
                <div key={idx}
                  style={{
                    background: '#fef3c7',
                    border: '1px solid #fde68a',
                    padding: '1rem',
                    borderRadius: '0.5rem'
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>🎯 {skill.name}</div>
                  <div style={{ fontSize: '0.875rem', color: '#666' }}>
                    {skill.category} • {skill.level}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Phase Tabs and Courses */}
          <div>
            <h3>Recommended Free Course Path 📚</h3>

            {/* Phase Tabs */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              marginBottom: '2rem',
              borderBottom: '2px solid #e5e7eb',
              overflowX: 'auto',
              paddingBottom: '1rem'
            }}>
              {coursePhases.map((phase, idx) => (
                <button key={idx}
                  onClick={() => setSelectedPhase(idx)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem 0.5rem 0 0',
                    border: 'none',
                    background: selectedPhase === idx ? phase.color : '#f3f4f6',
                    color: selectedPhase === idx ? '#000' : '#666',
                    cursor: 'pointer',
                    fontWeight: selectedPhase === idx ? 'bold' : 'normal',
                    fontSize: '0.95rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {phase.icon} {phase.phase}
                </button>
              ))}
            </div>

            {/* Selected Phase Content */}
            {coursePhases[selectedPhase] && (
              <div>
                <div style={{
                  background: coursePhases[selectedPhase].color,
                  padding: '2rem',
                  borderRadius: '0.5rem',
                  marginBottom: '2rem'
                }}>
                  <h2 style={{ marginTop: 0 }}>
                    {coursePhases[selectedPhase].icon} {coursePhases[selectedPhase].phase}
                  </h2>
                  <p style={{ margin: 0, color: '#555', lineHeight: '1.6' }}>
                    {coursePhases[selectedPhase].description}
                  </p>
                </div>

                {/* Course Table */}
                {groupedCourses[selectedPhase]?.courses.length > 0 ? (
                  <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
                    <table style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      border: '1px solid #e5e7eb'
                    }}>
                      <thead>
                        <tr style={{ background: '#f3f4f6' }}>
                          <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>Course</th>
                          <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>Provider</th>
                          <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 'bold' }}>Duration</th>
                          <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 'bold' }}>Level</th>
                          <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 'bold' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupedCourses[selectedPhase].courses.map((course, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <td style={{ padding: '1rem', fontWeight: '500' }}>{course.title}</td>
                            <td style={{ padding: '1rem', color: '#666' }}>{course.provider}</td>
                            <td style={{ padding: '1rem', textAlign: 'center' }}>⏱️ {course.duration_hours}h</td>
                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                              <span style={{
                                background: '#dbeafe',
                                color: '#0369a1',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '0.25rem',
                                fontSize: '0.85rem',
                                fontWeight: 'bold'
                              }}>
                                {course.difficulty_level}
                              </span>
                            </td>
                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                              <a href={course.url} target="_blank" rel="noopener noreferrer"
                                style={{
                                  background: '#1e40af',
                                  color: 'white',
                                  padding: '0.5rem 1rem',
                                  textDecoration: 'none',
                                  borderRadius: '0.25rem',
                                  fontSize: '0.85rem',
                                  fontWeight: 'bold'
                                }}
                              >
                                Visit
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: '#666',
                    background: '#f9fafb',
                    borderRadius: '0.5rem'
                  }}>
                    No courses available for this phase yet.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
