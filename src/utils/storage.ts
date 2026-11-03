import { PresentationProject } from '../types/presentation'
import { INITIAL_PROJECTS } from './sampleData'

const STORAGE_KEY = 'image_to_ppt_projects_v2'

export function loadProjects(): PresentationProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS))
      return INITIAL_PROJECTS
    }
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed
    }
    return INITIAL_PROJECTS
  } catch (e) {
    console.warn('Failed to parse projects from localStorage:', e)
    return INITIAL_PROJECTS
  }
}

export function saveProjects(projects: PresentationProject[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
    return true
  } catch (e) {
    console.error('Failed to save to localStorage (likely quota exceeded):', e)
    return false
  }
}

export function saveProject(updated: PresentationProject): boolean {
  const current = loadProjects()
  const idx = current.findIndex((p) => p.id === updated.id)
  let next: PresentationProject[]
  if (idx >= 0) {
    next = [...current]
    next[idx] = { ...updated, updatedAt: new Date().toISOString() }
  } else {
    next = [{ ...updated, updatedAt: new Date().toISOString() }, ...current]
  }
  return saveProjects(next)
}

export function deleteProject(id: string): PresentationProject[] {
  const current = loadProjects()
  const next = current.filter((p) => p.id !== id)
  saveProjects(next)
  return next
}

export function duplicateProject(id: string): PresentationProject | null {
  const current = loadProjects()
  const existing = current.find((p) => p.id === id)
  if (!existing) return null

  const copy: PresentationProject = {
    ...existing,
    id: 'proj-' + Math.random().toString(36).substring(2, 9),
    title: `${existing.title} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    images: existing.images.map((img) => ({
      ...img,
      id: 'img-' + Math.random().toString(36).substring(2, 9),
      createdAt: Date.now(),
    })),
  }

  const next = [copy, ...current]
  saveProjects(next)
  return copy
}

export function resetToDemo(): PresentationProject[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS))
  return INITIAL_PROJECTS
}
