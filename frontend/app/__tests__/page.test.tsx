import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import axios from 'axios'
import Dashboard from '../page'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('Dashboard Component', () => {
  const mockRoleInfo = {
    role_name: 'DevOps Engineer',
    target_ai_role: 'AI DevOps Engineer'
  }

  const mockSkills = [
    {
      name: 'Kubernetes',
      category: 'Container Orchestration',
      level: 'intermediate'
    }
  ]

  const mockCourses = [
    {
      id: 'course_001',
      title: 'Prompt Engineering for DevOps Engineers',
      provider: 'YouTube/Abhishek',
      url: 'https://example.com',
      duration_hours: 3,
      difficulty_level: 'beginner',
      category: 'Prompt Engineering',
      tags: ['Prompt Engineering'],
      is_free: true
    }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    mockedAxios.get.mockResolvedValue({ data: mockRoleInfo })
  })

  test('renders role selection cards', () => {
    mockedAxios.get.mockResolvedValue({ data: [] })
    render(<Dashboard />)

    expect(screen.getByText('DevOps Engineer')).toBeInTheDocument()
    expect(screen.getByText('Senior DevOps Engineer')).toBeInTheDocument()
    expect(screen.getByText('SRE Engineer')).toBeInTheDocument()
    expect(screen.getByText('Cloud Engineer')).toBeInTheDocument()
    expect(screen.getByText('Platform Engineer')).toBeInTheDocument()
  })

  test('displays AI Training Recommendations heading', () => {
    mockedAxios.get.mockResolvedValue({ data: [] })
    render(<Dashboard />)

    expect(screen.getByText('AI Training Recommendations by Role')).toBeInTheDocument()
  })

  test('renders phase tabs', async () => {
    mockedAxios.get.mockResolvedValue({ data: { courses: [] } })
    render(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText(/Phase 1: Prompt Engineering/)).toBeInTheDocument()
      expect(screen.getByText(/Phase 2: Local LLMs/)).toBeInTheDocument()
      expect(screen.getByText(/Phase 3: Cloud APIs/)).toBeInTheDocument()
    })
  })

  test('selects DevOps role by default', () => {
    mockedAxios.get.mockResolvedValue({ data: mockRoleInfo })
    render(<Dashboard />)

    const devopsButton = screen.getAllByRole('button').find(btn =>
      btn.textContent.includes('DevOps Engineer')
    )

    expect(devopsButton).toHaveStyle('background: #f0f9ff')
  })

  test('changes role when different role is clicked', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockRoleInfo })
    render(<Dashboard />)

    const sreButton = screen.getAllByRole('button').find(btn =>
      btn.textContent.includes('SRE Engineer')
    )

    fireEvent.click(sreButton!)

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalled()
    })
  })

  test('displays role overview when role is loaded', async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: mockRoleInfo })
      .mockResolvedValueOnce({ data: mockSkills })
      .mockResolvedValueOnce({ data: mockSkills })
      .mockResolvedValueOnce({ data: mockCourses })

    render(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText(/Role Overview/)).toBeInTheDocument()
    })
  })

  test('displays target AI role', async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: mockRoleInfo })
      .mockResolvedValueOnce({ data: mockSkills })
      .mockResolvedValueOnce({ data: mockSkills })
      .mockResolvedValueOnce({ data: mockCourses })

    render(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText('AI DevOps Engineer')).toBeInTheDocument()
    })
  })

  test('displays MUST have skills section', async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: mockRoleInfo })
      .mockResolvedValueOnce({ data: mockSkills })
      .mockResolvedValueOnce({ data: mockSkills })
      .mockResolvedValueOnce({ data: mockCourses })

    render(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText(/MUST Have Skills & Competencies/)).toBeInTheDocument()
    })
  })

  test('displays SHOULD have skills section', async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: mockRoleInfo })
      .mockResolvedValueOnce({ data: mockSkills })
      .mockResolvedValueOnce({ data: mockSkills })
      .mockResolvedValueOnce({ data: mockCourses })

    render(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText(/SHOULD Have Skills & Competencies/)).toBeInTheDocument()
    })
  })

  test('displays current skills section', async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: mockRoleInfo })
      .mockResolvedValueOnce({ data: mockSkills })
      .mockResolvedValueOnce({ data: mockSkills })
      .mockResolvedValueOnce({ data: mockCourses })

    render(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText(/Current Skills/)).toBeInTheDocument()
    })
  })

  test('displays target skills section', async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: mockRoleInfo })
      .mockResolvedValueOnce({ data: mockSkills })
      .mockResolvedValueOnce({ data: mockSkills })
      .mockResolvedValueOnce({ data: mockCourses })

    render(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText(/Target AI Skills/)).toBeInTheDocument()
    })
  })

  test('renders course table with correct columns', async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: mockRoleInfo })
      .mockResolvedValueOnce({ data: mockSkills })
      .mockResolvedValueOnce({ data: mockSkills })
      .mockResolvedValueOnce({ data: mockCourses })

    render(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText('Course Title')).toBeInTheDocument()
      expect(screen.getByText('Provider')).toBeInTheDocument()
      expect(screen.getByText('Duration')).toBeInTheDocument()
      expect(screen.getByText('Difficulty')).toBeInTheDocument()
      expect(screen.getByText('Action')).toBeInTheDocument()
    })
  })

  test('phase tab navigation works correctly', async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: mockRoleInfo })
      .mockResolvedValueOnce({ data: mockSkills })
      .mockResolvedValueOnce({ data: mockSkills })
      .mockResolvedValueOnce({ data: mockCourses })

    render(<Dashboard />)

    await waitFor(() => {
      const phase2Button = screen.getAllByText(/Phase 2: Local LLMs/)[0].closest('button')
      expect(phase2Button).toBeInTheDocument()
    })
  })

  test('handles API errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
    mockedAxios.get.mockRejectedValue(new Error('API Error'))

    render(<Dashboard />)

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled()
    })

    consoleErrorSpy.mockRestore()
  })
})
