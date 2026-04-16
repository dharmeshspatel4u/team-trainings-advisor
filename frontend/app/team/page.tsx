'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export default function TeamPage() {
  const [members, setMembers] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    role: 'devops',
    email: '',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMembers()
  }, [])

  const loadMembers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/team/members`)
      setMembers(res.data)
    } catch (error) {
      console.error('Error loading members:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${API_BASE}/api/team/members`, {
        ...formData,
        current_skills: [],
      })
      setMembers([...members, res.data])
      setFormData({ name: '', role: 'devops', email: '' })
      setShowForm(false)
    } catch (error) {
      console.error('Error adding member:', error)
      alert('Error adding team member')
    }
  }

  const handleDeleteMember = async (id: string) => {
    if (confirm('Are you sure?')) {
      try {
        await axios.delete(`${API_BASE}/api/team/members/${id}`)
        setMembers(members.filter(m => m.id !== id))
      } catch (error) {
        console.error('Error deleting member:', error)
      }
    }
  }

  const roles = [
    { value: 'devops', label: 'DevOps Engineer' },
    { value: 'senior_devops', label: 'Senior DevOps Engineer' },
    { value: 'sre', label: 'SRE Engineer' },
    { value: 'cloud_engineer', label: 'Cloud Engineer' },
    { value: 'platform_engineer', label: 'Platform Engineer' },
  ]

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1>Team Members</h1>

      {/* Add Member Form */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            background: '#16a34a',
            color: 'white',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          {showForm ? '✕ Cancel' : '+ Add Team Member'}
        </button>

        {showForm && (
          <form onSubmit={handleAddMember} style={{
            background: '#f9fafb',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            marginTop: '1rem',
            maxWidth: '500px'
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  boxSizing: 'border-box'
                }}
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              style={{
                background: '#1e40af',
                color: 'white',
                padding: '0.75rem 2rem',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Add Member
            </button>
          </form>
        )}
      </div>

      {/* Members List */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '1rem'
      }}>
        {members.map(member => (
          <div
            key={member.id}
            style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <h3 style={{ margin: '0 0 0.5rem 0' }}>{member.name}</h3>
            <div style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1rem' }}>
              <div><strong>Role:</strong> {member.role.replace('_', ' ').toUpperCase()}</div>
              <div><strong>Email:</strong> {member.email}</div>
              <div><strong>Current Skills:</strong> {member.current_skills?.length || 0}</div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <a
                href={`/member/${member.id}`}
                style={{
                  flex: 1,
                  background: '#1e40af',
                  color: 'white',
                  padding: '0.5rem',
                  borderRadius: '0.25rem',
                  textDecoration: 'none',
                  textAlign: 'center',
                  fontSize: '0.875rem'
                }}
              >
                View Details
              </a>
              <button
                onClick={() => handleDeleteMember(member.id)}
                style={{
                  background: '#dc2626',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {members.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          background: '#f9fafb',
          borderRadius: '0.5rem',
          color: '#666'
        }}>
          No team members yet. Click "Add Team Member" to get started!
        </div>
      )}
    </div>
  )
}
