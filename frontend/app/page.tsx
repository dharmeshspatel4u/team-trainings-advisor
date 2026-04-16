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
        'Jenkins (pipeline development, declarative/scripted pipelines)',
        'Groovy (Jenkins pipeline scripting)',
        'Shell Scripting (Bash, advanced scripting)',
        'Google Cloud Platform (Compute Engine, Cloud Run, managed services)',
        'Kubernetes (deployment, scaling, troubleshooting)',
        'Docker (containerization, image management)',
        'Google Cloud Build (automated builds and deployments)',
        'Monitoring Tools (Prometheus, Grafana, Datadog, Cloud Logging)',
        'Infrastructure as Code (Terraform)',
        'Linux Administration (user management, services)'
      ],
      shouldHave: [
        'Python (automation, scripting, API integration)',
        'Multi-cloud Experience (AWS, Azure, GCP)',
        'Cloud Security (IAM, encryption, network security)',
        'ArgoCD/Flux (GitOps approaches)',
        'Helm (Kubernetes package management)',
        'Cost Optimization (resource efficiency)',
        'Configuration Management (Ansible, Puppet, Chef)',
        'SRE Practices (error budgets, incident management)'
      ],
      criticalPhases: ['Phase 1', 'Phase 3', 'Phase 5', 'Phase 6']
    },
    senior_devops: {
      overview: 'Senior DevOps Engineers architect large-scale infrastructure and lead MLOps platform design. They drive organizational automation initiatives.',
      responsibilities: [
        'Design and architect enterprise-scale infrastructure',
        'Lead MLOps and AI platform initiatives',
        'Implement advanced observability solutions',
        'Drive automation and efficiency across the organization',
        'Mentor and guide junior and mid-level engineers',
        'Define DevOps strategies and best practices'
      ],
      mustHave: [
        'Advanced Kubernetes Architecture',
        'Terraform Modules (reusable infrastructure patterns)',
        'Advanced Monitoring & Observability',
        'CI/CD Pipeline Design (Jenkins expertise)',
        'Infrastructure Architecture',
        'Groovy & Shell Scripting (advanced)',
        'Google Cloud Platform (advanced)',
        'Linux System Administration (advanced)'
      ],
      shouldHave: [
        'MLOps Architecture',
        'ML Platform Design',
        'Feature Stores',
        'Model Registry & Governance',
        'Python for ML Systems',
        'Cloud Security Architecture',
        'Cost Optimization Strategies',
        'Incident Management & Post-mortems'
      ],
      criticalPhases: ['Phase 1', 'Phase 3', 'Phase 5', 'Phase 6']
    },
    sre: {
      overview: 'SRE Engineers focus on reliability, availability, and performance. They bridge operations and development to build resilient systems.',
      responsibilities: [
        'Ensure system reliability, uptime, and performance',
        'Manage incident response and post-mortems',
        'Monitor and optimize system performance',
        'Implement observability and alerting strategies',
        'Perform root cause analysis of failures',
        'Manage on-call rotations and escalations',
        'Automate operational tasks and runbooks'
      ],
      mustHave: [
        'Kubernetes (advanced)',
        'Monitoring & Alerting (Prometheus, Grafana, Datadog)',
        'Incident Management (procedures, on-call systems)',
        'System Performance Tuning',
        'Infrastructure Automation',
        'Linux (advanced)',
        'Shell Scripting (advanced)',
        'Log Analysis & Troubleshooting'
      ],
      shouldHave: [
        'Python (monitoring and automation)',
        'Cloud Platforms (AWS, GCP, Azure)',
        'APM Tools (application performance monitoring)',
        'Distributed Tracing (correlation across services)',
        'Custom Metrics & Instrumentation',
        'Cost Analysis & Optimization',
        'Chaos Engineering (resilience testing)',
        'Database Administration & Optimization'
      ],
      criticalPhases: ['Phase 1', 'Phase 4', 'Phase 6', 'Phase 7']
    },
    cloud_engineer: {
      overview: 'Cloud Engineers design and manage cloud infrastructure and services. They optimize cloud resources for cost, performance, and security.',
      responsibilities: [
        'Design cloud architecture (AWS, GCP, Azure)',
        'Provision and manage cloud resources',
        'Implement cloud security and compliance',
        'Optimize cloud costs and resource usage',
        'Design disaster recovery and backup strategies',
        'Implement Infrastructure as Code on cloud platforms',
        'Manage cloud networking and connectivity'
      ],
      mustHave: [
        'Cloud Platform Expertise (AWS/GCP/Azure)',
        'Cloud Architecture Design',
        'Networking (VPC, firewalls, load balancing)',
        'Cost Optimization (resource efficiency)',
        'Infrastructure as Code (Terraform, CloudFormation)',
        'Cloud Security (IAM, encryption, compliance)',
        'Cloud Managed Services (databases, storage)',
        'Docker & Containerization'
      ],
      shouldHave: [
        'Kubernetes on Cloud (GKE, EKS, AKS)',
        'Multi-cloud Architecture',
        'Disaster Recovery & Business Continuity',
        'Cloud Migration Strategies',
        'Python for Cloud Automation',
        'Cloud Monitoring & Logging',
        'API Management',
        'Serverless Architecture (Functions, Lambda)'
      ],
      criticalPhases: ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 6']
    },
    platform_engineer: {
      overview: 'Platform Engineers design and maintain Internal Developer Platforms (IDP) that enable developers to self-serve infrastructure and deployments.',
      responsibilities: [
        'Design Internal Developer Platforms (IDP)',
        'Improve developer experience and self-service capabilities',
        'Maintain CI/CD infrastructure and pipelines',
        'Design deployment and release strategies',
        'Manage platform security and compliance',
        'Implement API gateways and service meshes',
        'Support microservices and distributed systems',
        'Build platform automation and tooling'
      ],
      mustHave: [
        'Kubernetes (advanced architecture)',
        'CI/CD Platforms (Jenkins, GitLab CI, GitHub Actions)',
        'Internal Developer Platform Design',
        'Microservices Architecture',
        'API Design & Management',
        'Infrastructure as Code (Terraform, Helm)',
        'Container Orchestration (Docker, K8s)',
        'Developer Experience Design'
      ],
      shouldHave: [
        'Service Mesh (Istio, Linkerd)',
        'API Gateways (Kong, Envoy)',
        'Platform Observability',
        'Multi-tenancy Architecture',
        'Helm Package Management',
        'GitOps (ArgoCD, Flux)',
        'Go/Rust for Tooling Development',
        'Security & RBAC Implementation'
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

  // Define course phases in order with descriptions
  const coursePhases = [
    {
      phase: 'Phase 1: Prompt Engineering',
      categories: ['Prompt Engineering'],
      color: '#fef3c7',
      icon: '🎯',
      description: 'Foundation for all AI interactions. Learn one-shot and n-shot prompting techniques to get expected responses from AI models. Most AI failures are due to poor prompts, not poor models.'
    },
    {
      phase: 'Phase 2: Local LLMs',
      categories: ['Local LLMs'],
      color: '#c7d2fe',
      icon: '💻',
      description: 'Run language models locally using Ollama, Hugging Face, and Docker. Cost-effective testing before using expensive cloud APIs. Learn GGUF models that run on CPU.'
    },
    {
      phase: 'Phase 3: Cloud APIs',
      categories: ['Cloud LLM APIs', 'Programming'],
      color: '#d1d5db',
      icon: '☁️',
      description: 'Make API calls to production models (OpenAI, Anthropic Claude) using Python and shell scripting. Essential for production automation like auto-generating Dockerfiles.'
    },
    {
      phase: 'Phase 4: AI Agents',
      categories: ['AI Agents'],
      color: '#eccfdf',
      icon: '🤖',
      description: 'Automate complex, repetitive tasks using CrewAI framework. Build agents for pod failure analysis, deployment verification, and cost optimization without building from scratch.'
    },
    {
      phase: 'Phase 5: Workflow Automation',
      categories: ['Workflow Automation', 'CI/CD Automation'],
      color: '#d4f1d4',
      icon: '⚡',
      description: 'Visual, no-code/low-code AI integration using N8N or Simaine. Add AI stages to CI/CD pipelines for security analysis, intelligent testing, and automated documentation.'
    },
    {
      phase: 'Phase 6: AIOps & Monitoring',
      categories: ['AIOps', 'Observability', 'AI Deployment'],
      color: '#fecaca',
      icon: '📊',
      description: 'Combine observability with AI intelligence using Grafana, Datadog, or Dynatrace. Get anomaly detection, pattern recognition, and predictive alerts instead of reactive threshold-based alerts.'
    },
    {
      phase: 'Phase 7: Continuous Learning',
      categories: ['Continuous Learning'],
      color: '#b3e5fc',
      icon: '📚',
      description: 'Stay updated with AI/DevOps trends (15-30 minutes daily). Follow LinkedIn, YouTube, and official docs for new model releases, open-source projects, and integration announcements.'
    },
  ]

  // Group courses by phase
  const groupedCourses = coursePhases.map(p => ({
    ...p,
    courses: courses.filter(c => p.categories.includes(c.category))
  })).filter(p => p.courses.length > 0)

  return (
    <div>
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
          {/* Target Role Info */}
          <div style={{
            background: '#f0f9ff',
            border: '2px solid #bfdbfe',
            borderRadius: '0.5rem',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <h2 style={{ marginTop: 0 }}>
              {roleData?.icon} {roleData?.label}
            </h2>
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

            {/* Role Overview */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
              <h4 style={{ marginTop: 0, marginBottom: '0.75rem' }}>📋 Role Overview</h4>
              <p style={{ margin: 0, color: '#555', lineHeight: '1.6' }}>
                {currentRoleDetails.overview}
              </p>
            </div>
          </div>

          {/* Role Responsibilities */}
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
              <h3>✅ MUST Have Skills & Competencies</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '0.75rem'
              }}>
                {currentRoleDetails.mustHave.map((skill, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#dcfce7',
                      border: '1px solid #86efac',
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.95rem'
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
              <h3>🌟 SHOULD Have Skills & Competencies</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '0.75rem'
              }}>
                {currentRoleDetails.shouldHave.map((skill, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#fef3c7',
                      border: '1px solid #fde68a',
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.95rem'
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
            <h3>Current Skills (What you already have)</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '0.75rem'
            }}>
              {currentSkills.map((skill, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    padding: '1rem',
                    borderRadius: '0.5rem'
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{skill.name}</div>
                  <div style={{ fontSize: '0.875rem', color: '#666' }}>
                    {skill.category} • {skill.level}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Target Skills */}
          <div style={{ marginBottom: '2rem' }}>
            <h3>Target AI Skills (Skills to learn)</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '0.75rem'
            }}>
              {targetSkills.map((skill, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#fef3c7',
                    border: '1px solid #fde68a',
                    padding: '1rem',
                    borderRadius: '0.5rem'
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>🎯 {skill.name}</div>
                  <div style={{ fontSize: '0.875rem', color: '#666' }}>
                    {skill.category} • {skill.level}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Courses by Phase */}
          <div>
            <h3>Recommended Free Course Path 📚</h3>
            <p style={{ color: '#666' }}>
              Follow this 7-step learning path to upskill as an AI DevOps engineer
            </p>

            {currentRoleDetails.criticalPhases.length > 0 && (
              <div style={{
                background: '#fef3c7',
                border: '2px solid #fde68a',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                marginBottom: '2rem'
              }}>
                <h4 style={{ marginTop: 0, marginBottom: '0.75rem' }}>🔴 Critical Phases for Your Role</h4>
                <p style={{ margin: '0 0 1rem 0', color: '#555', fontSize: '0.95rem' }}>
                  These phases directly leverage your existing skills and have the highest impact for your AI DevOps journey:
                </p>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}>
                  {currentRoleDetails.criticalPhases.map((phase, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: '#fbbf24',
                        color: '#78350f',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                      }}
                    >
                      {phase}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {groupedCourses.map((phaseData, phaseIdx) => (
              <div key={phaseIdx} style={{ marginBottom: '2.5rem' }}>
                <div style={{
                  background: phaseData.color,
                  padding: '1rem 1.5rem',
                  borderRadius: '0.5rem',
                  marginBottom: '1rem',
                  border: '2px solid #e5e7eb'
                }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                    {phaseData.icon} {phaseData.phase}
                  </h4>
                  <p style={{ margin: '0.5rem 0', color: '#555', fontSize: '0.95rem', lineHeight: '1.5' }}>
                    {phaseData.description}
                  </p>
                  <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
                    {phaseData.courses.length} courses • {Math.ceil(phaseData.courses.reduce((sum, c) => sum + c.duration_hours, 0) / 2)} hours of learning
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '1rem'
                }}>
                  {phaseData.courses.map(course => (
                    <div
                      key={course.id}
                      style={{
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)'
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      <div style={{
                        background: '#f3f4f6',
                        padding: '1rem',
                        borderBottom: '1px solid #e5e7eb'
                      }}>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#666',
                          marginBottom: '0.5rem'
                        }}>
                          {course.provider}
                        </div>
                        <h4 style={{ margin: '0.5rem 0' }}>{course.title}</h4>
                      </div>

                      <div style={{ padding: '1rem', flex: 1 }}>
                        <div style={{ marginBottom: '0.75rem' }}>
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

                        <div style={{ color: '#666', fontSize: '0.875rem' }}>
                          {course.duration_hours && (
                            <div>⏱️ {course.duration_hours} hours</div>
                          )}
                        </div>
                      </div>

                      <div style={{
                        padding: '1rem',
                        borderTop: '1px solid #e5e7eb'
                      }}>
                        <a
                          href={course.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'block',
                            background: '#1e40af',
                            color: 'white',
                            padding: '0.75rem',
                            textAlign: 'center',
                            textDecoration: 'none',
                            borderRadius: '0.25rem',
                            fontSize: '0.875rem',
                            fontWeight: 'bold'
                          }}
                        >
                          Start Learning →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Learning Path Summary */}
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            marginTop: '2rem'
          }}>
            <h3 style={{ marginTop: 0 }}>📖 Suggested Learning Path</h3>
            <ol style={{ lineHeight: 1.8 }}>
              <li><strong>Phase 1 (Weeks 1-4):</strong> Start with ML Fundamentals and Python courses</li>
              <li><strong>Phase 2 (Weeks 5-12):</strong> Learn role-specific AI tools (MLOps, Cloud AI, etc.)</li>
              <li><strong>Phase 3 (Weeks 13-24):</strong> Advanced topics and hands-on project work</li>
            </ol>
            <p style={{ color: '#666', fontStyle: 'italic' }}>
              Estimated timeline: 3-6 months depending on prior experience and study pace
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
