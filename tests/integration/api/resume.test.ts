import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as fs from 'fs'

describe('GET /api/resume', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return resume script successfully', async () => {
    const mockScript = '#!/bin/bash\necho "Resume script"\n'
    const readFileSpy = vi.spyOn(fs.promises, 'readFile').mockResolvedValue(mockScript)

    const { GET } = await import('@/app/api/resume/route')
    const response = await GET()

    expect(response.status).toBe(200)
    const text = await response.text()

    expect(text).toBe(mockScript)
    expect(readFileSpy).toHaveBeenCalledTimes(1)
    expect(readFileSpy).toHaveBeenCalledWith(
      expect.stringContaining('public/resume/launch.sh'),
      'utf-8'
    )

    readFileSpy.mockRestore()
  })

  it('should return 404 when file not found', async () => {
    const readFileSpy = vi.spyOn(fs.promises, 'readFile').mockRejectedValue(new Error('ENOENT: no such file or directory'))

    const { GET } = await import('@/app/api/resume/route')
    const response = await GET()

    expect(response.status).toBe(404)
    const text = await response.text()

    expect(text).toBe('Resume script not found')

    readFileSpy.mockRestore()
  })

  it('should handle read errors gracefully', async () => {
    const readFileSpy = vi.spyOn(fs.promises, 'readFile').mockRejectedValue(new Error('Permission denied'))

    const { GET } = await import('@/app/api/resume/route')
    const response = await GET()

    expect(response.status).toBe(404)
    const text = await response.text()

    expect(text).toBe('Resume script not found')

    readFileSpy.mockRestore()
  })

  it('should return correct content-type header', async () => {
    const mockScript = '#!/bin/bash\necho "Test"\n'
    const readFileSpy = vi.spyOn(fs.promises, 'readFile').mockResolvedValue(mockScript)

    const { GET } = await import('@/app/api/resume/route')
    const response = await GET()

    expect(response.headers.get('content-type')).toBe('text/plain')

    readFileSpy.mockRestore()
  })

  it('should return correct cache-control header on success', async () => {
    const mockScript = '#!/bin/bash\necho "Test"\n'
    const readFileSpy = vi.spyOn(fs.promises, 'readFile').mockResolvedValue(mockScript)

    const { GET } = await import('@/app/api/resume/route')
    const response = await GET()

    expect(response.headers.get('cache-control')).toBe('public, max-age=3600')

    readFileSpy.mockRestore()
  })

  it('should not include cache-control header on 404', async () => {
    const readFileSpy = vi.spyOn(fs.promises, 'readFile').mockRejectedValue(new Error('File not found'))

    const { GET } = await import('@/app/api/resume/route')
    const response = await GET()

    expect(response.status).toBe(404)
    expect(response.headers.get('cache-control')).toBeNull()

    readFileSpy.mockRestore()
  })

  it('should handle empty file gracefully', async () => {
    const readFileSpy = vi.spyOn(fs.promises, 'readFile').mockResolvedValue('')

    const { GET } = await import('@/app/api/resume/route')
    const response = await GET()

    expect(response.status).toBe(200)
    const text = await response.text()

    expect(text).toBe('')

    readFileSpy.mockRestore()
  })
})
