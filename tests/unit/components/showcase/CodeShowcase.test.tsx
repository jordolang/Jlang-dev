import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { CodeShowcase } from '@/components/showcase/CodeShowcase'

// Mock external dependencies
vi.mock('@iconify/react', () => ({
  Icon: ({ icon, ...props }: { icon: string; [key: string]: unknown }) => (
    <span data-testid={`icon-${icon}`} {...props} />
  ),
}))

vi.mock('react-syntax-highlighter', () => ({
  Prism: ({ children, ...props }: { children: string; [key: string]: unknown }) => (
    <pre data-testid="syntax-highlighter" {...props}>
      {children}
    </pre>
  ),
}))

vi.mock('react-syntax-highlighter/dist/cjs/styles/prism', () => ({
  vscDarkPlus: {},
}))

describe('CodeShowcase', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock clipboard API
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn(() => Promise.resolve()),
      },
      writable: true,
      configurable: true,
    })
  })

  describe('Basic Rendering', () => {
    it('should render with required props only', () => {
      const code = 'const greeting = "Hello World";'
      render(<CodeShowcase code={code} />)

      // Should render the code
      expect(screen.getByText(/const greeting/)).toBeInTheDocument()
    })

    it('should render with title and description', () => {
      const code = 'const greeting = "Hello World";'
      const title = 'Test Component'
      const description = 'This is a test description'

      render(<CodeShowcase code={code} title={title} description={description} />)

      expect(screen.getByText(title)).toBeInTheDocument()
      expect(screen.getByText(description)).toBeInTheDocument()
    })

    it('should not render title/description when not provided', () => {
      const code = 'const greeting = "Hello World";'
      const { container } = render(<CodeShowcase code={code} />)

      // Should not have h3 or description p elements
      expect(container.querySelector('h3')).not.toBeInTheDocument()
      const paragraphs = container.querySelectorAll('p')
      expect(paragraphs.length).toBe(0)
    })

    it('should display language in code header', () => {
      const code = 'const greeting = "Hello World";'
      render(<CodeShowcase code={code} language="javascript" />)

      expect(screen.getByText(/javascript/i)).toBeInTheDocument()
    })

    it('should default to typescript language', () => {
      const code = 'const greeting = "Hello World";'
      render(<CodeShowcase code={code} />)

      expect(screen.getByText(/typescript/i)).toBeInTheDocument()
    })
  })

  describe('View Modes', () => {
    const code = 'const greeting = "Hello World";'
    const preview = <div data-testid="preview-content">Preview Content</div>

    it('should default to split view when preview is provided', () => {
      render(<CodeShowcase code={code} preview={preview} />)

      // Split view button should be active
      const splitButton = screen.getByRole('button', { name: /split/i })
      expect(splitButton).toHaveClass('bg-white')
    })

    it('should render in code-only mode when no preview provided', () => {
      render(<CodeShowcase code={code} />)

      // Should not show preview or split buttons
      expect(screen.queryByRole('button', { name: /^preview$/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /^split$/i })).not.toBeInTheDocument()

      // Should show code button (exact match to avoid matching "Copy Code")
      expect(screen.getByRole('button', { name: /^code$/i })).toBeInTheDocument()
    })

    it('should switch to preview-only view when preview button clicked', () => {
      render(<CodeShowcase code={code} preview={preview} />)

      const previewButton = screen.getByRole('button', { name: /preview/i })
      fireEvent.click(previewButton)

      // Preview should be visible
      expect(screen.getByTestId('preview-content')).toBeInTheDocument()

      // Preview button should be active
      expect(previewButton).toHaveClass('bg-white')
    })

    it('should switch to code-only view when code button clicked', () => {
      render(<CodeShowcase code={code} preview={preview} />)

      const codeButton = screen.getByRole('button', { name: /^code$/i })
      fireEvent.click(codeButton)

      // Code button should be active
      expect(codeButton).toHaveClass('bg-white')
    })

    it('should switch back to split view when split button clicked', () => {
      render(<CodeShowcase code={code} preview={preview} />)

      // First switch to code-only
      const codeButton = screen.getByRole('button', { name: /^code$/i })
      fireEvent.click(codeButton)

      // Then switch to split
      const splitButton = screen.getByRole('button', { name: /^split$/i })
      fireEvent.click(splitButton)

      // Both code and preview should be visible
      expect(screen.getByTestId('preview-content')).toBeInTheDocument()
      expect(screen.getByText(/const greeting/)).toBeInTheDocument()

      // Split button should be active
      expect(splitButton).toHaveClass('bg-white')
    })

    it('should respect defaultView prop', () => {
      render(<CodeShowcase code={code} preview={preview} defaultView="preview" />)

      // Preview button should be active
      const previewButton = screen.getByRole('button', { name: /preview/i })
      expect(previewButton).toHaveClass('bg-white')
    })

    it('should show only code when preview is not provided', () => {
      render(<CodeShowcase code={code} />)

      // Should show code
      expect(screen.getByText(/const greeting/)).toBeInTheDocument()

      // Should not have preview button
      expect(screen.queryByRole('button', { name: /preview/i })).not.toBeInTheDocument()
    })

    it('should show both code and preview in split mode', () => {
      render(<CodeShowcase code={code} preview={preview} defaultView="split" />)

      // Both should be visible
      expect(screen.getByTestId('preview-content')).toBeInTheDocument()
      expect(screen.getByText(/const greeting/)).toBeInTheDocument()
    })
  })

  describe('Copy Functionality', () => {
    const code = 'const greeting = "Hello World";'

    it('should show copy button by default', () => {
      render(<CodeShowcase code={code} />)

      expect(screen.getByRole('button', { name: /copy code/i })).toBeInTheDocument()
    })

    it('should hide copy button when showCopy is false', () => {
      render(<CodeShowcase code={code} showCopy={false} />)

      expect(screen.queryByRole('button', { name: /copy code/i })).not.toBeInTheDocument()
    })

    it('should copy code to clipboard when copy button clicked', async () => {
      render(<CodeShowcase code={code} />)

      const copyButton = screen.getByRole('button', { name: /copy code/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(code)
      })
    })

    it('should show "Copied!" feedback after copying', async () => {
      render(<CodeShowcase code={code} />)

      const copyButton = screen.getByRole('button', { name: /copy code/i })
      fireEvent.click(copyButton)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /copied!/i })).toBeInTheDocument()
      })
    })

    it('should reset copy feedback after timeout', async () => {
      render(<CodeShowcase code={code} />)

      const copyButton = screen.getByRole('button', { name: /copy code/i })
      fireEvent.click(copyButton)

      // Should show "Copied!"
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /copied!/i })).toBeInTheDocument()
      })

      // Wait for the timeout (2000ms) plus a bit for the state update
      await new Promise(resolve => setTimeout(resolve, 2100))

      // Should reset to "Copy Code"
      expect(screen.getByRole('button', { name: /copy code/i })).toBeInTheDocument()
    }, 10000)

    it('should handle clipboard errors gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      try {
        // Mock clipboard to reject
        Object.defineProperty(navigator, 'clipboard', {
          value: {
            writeText: vi.fn(() => Promise.reject(new Error('Clipboard error'))),
          },
          writable: true,
          configurable: true,
        })

        render(<CodeShowcase code={code} />)

        const copyButton = screen.getByRole('button', { name: /copy code/i })
        fireEvent.click(copyButton)

        // Wait for the promise to reject and error to be logged
        await waitFor(() => {
          expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Failed to copy code:',
            expect.any(Error)
          )
        })
      } finally {
        consoleErrorSpy.mockRestore()
      }
    }, 10000)

    it('should show mobile copy button in code header', () => {
      const preview = <div>Preview</div>
      render(<CodeShowcase code={code} preview={preview} />)

      // Switch to code view to ensure we're showing code
      const codeButton = screen.getByRole('button', { name: /^code$/i })
      fireEvent.click(codeButton)

      // Mobile copy button should exist (there will be two copy buttons)
      const copyButtons = screen.getAllByRole('button', { name: /copy/i })
      expect(copyButtons.length).toBeGreaterThan(0)
    })

    it('should not show copy button when in preview-only mode', () => {
      const preview = <div data-testid="preview">Preview</div>
      render(<CodeShowcase code={code} preview={preview} defaultView="preview" />)

      // Copy button should not be visible in preview-only mode
      expect(screen.queryByRole('button', { name: /copy code/i })).not.toBeInTheDocument()
    })
  })

  describe('Height Customization', () => {
    it('should use auto height by default', () => {
      const code = 'const greeting = "Hello World";'
      const { container } = render(<CodeShowcase code={code} />)

      const mainContent = container.querySelector('.rounded-xl.overflow-hidden.border')
      // When height is auto, the style.height property should not be set
      expect(mainContent?.getAttribute('style')).toBeNull()
    })

    it('should apply custom height when provided', () => {
      const code = 'const greeting = "Hello World";'
      const customHeight = '500px'
      const { container } = render(<CodeShowcase code={code} height={customHeight} />)

      const mainContent = container.querySelector('.rounded-xl.overflow-hidden.border')
      expect(mainContent).toHaveStyle({ height: customHeight })
    })
  })

  describe('Preview Rendering', () => {
    const code = 'const greeting = "Hello World";'

    it('should render preview component when provided', () => {
      const preview = <div data-testid="test-preview">Test Preview</div>
      render(<CodeShowcase code={code} preview={preview} />)

      expect(screen.getByTestId('test-preview')).toBeInTheDocument()
    })

    it('should render preview in split view by default', () => {
      const preview = <div data-testid="test-preview">Test Preview</div>
      render(<CodeShowcase code={code} preview={preview} />)

      // Both code and preview should be visible
      expect(screen.getByTestId('test-preview')).toBeInTheDocument()
      expect(screen.getByText(/const greeting/)).toBeInTheDocument()
    })

    it('should not render preview when in code-only mode', () => {
      const preview = <div data-testid="test-preview">Test Preview</div>
      render(<CodeShowcase code={code} preview={preview} defaultView="code" />)

      expect(screen.queryByTestId('test-preview')).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    const code = 'const greeting = "Hello World";'

    it('should have proper button roles', () => {
      const preview = <div>Preview</div>
      render(<CodeShowcase code={code} preview={preview} />)

      expect(screen.getByRole('button', { name: /^preview$/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /^split$/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /^code$/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /copy code/i })).toBeInTheDocument()
    })

    it('should have proper heading hierarchy with title', () => {
      const title = 'Test Component'
      render(<CodeShowcase code={code} title={title} />)

      const heading = screen.getByRole('heading', { name: title })
      expect(heading.tagName).toBe('H3')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty code string', () => {
      const { container } = render(<CodeShowcase code="" />)

      expect(container).toBeInTheDocument()
    })

    it('should handle very long code', () => {
      const longCode = 'const x = 1;\n'.repeat(100)
      render(<CodeShowcase code={longCode} />)

      expect(screen.getByText(/const x = 1/)).toBeInTheDocument()
    })

    it('should handle special characters in code', () => {
      const code = 'const str = "<div>Test & \"quotes\"</div>";'
      render(<CodeShowcase code={code} />)

      expect(screen.getByText(/const str/)).toBeInTheDocument()
    })

    it('should handle multiple showcases on same page', () => {
      const code1 = 'const a = 1;'
      const code2 = 'const b = 2;'

      const { rerender } = render(
        <div>
          <CodeShowcase code={code1} title="First" />
          <CodeShowcase code={code2} title="Second" />
        </div>
      )

      expect(screen.getByText('First')).toBeInTheDocument()
      expect(screen.getByText('Second')).toBeInTheDocument()
      expect(screen.getByText(/const a = 1/)).toBeInTheDocument()
      expect(screen.getByText(/const b = 2/)).toBeInTheDocument()
    })
  })

  describe('Layout Classes', () => {
    const code = 'const greeting = "Hello World";'

    it('should apply grid layout in split mode with preview', () => {
      const preview = <div>Preview</div>
      const { container } = render(<CodeShowcase code={code} preview={preview} defaultView="split" />)

      const mainContent = container.querySelector('.grid.grid-cols-1.lg\\:grid-cols-2')
      expect(mainContent).toBeInTheDocument()
    })

    it('should not apply grid layout when not in split mode', () => {
      const preview = <div>Preview</div>
      const { container } = render(<CodeShowcase code={code} preview={preview} defaultView="code" />)

      const mainContent = container.querySelector('.grid.grid-cols-1.lg\\:grid-cols-2')
      expect(mainContent).not.toBeInTheDocument()
    })

    it('should not apply grid layout when no preview', () => {
      const { container } = render(<CodeShowcase code={code} />)

      const mainContent = container.querySelector('.grid.grid-cols-1.lg\\:grid-cols-2')
      expect(mainContent).not.toBeInTheDocument()
    })
  })
})
