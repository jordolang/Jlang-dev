import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('Utils', () => {
  describe('cn', () => {
    it('should merge class names', () => {
      const result = cn('class1', 'class2')
      expect(result).toBe('class1 class2')
    })

    it('should handle conditional classes', () => {
      const result = cn('base', true && 'included', false && 'excluded')
      expect(result).toBe('base included')
    })

    it('should handle object-based classes', () => {
      const result = cn({
        'active': true,
        'disabled': false,
        'visible': true,
      })
      expect(result).toBe('active visible')
    })

    it('should merge Tailwind classes correctly', () => {
      // twMerge should deduplicate and resolve conflicting Tailwind classes
      const result = cn('px-2 py-1', 'px-4')
      expect(result).toBe('py-1 px-4')
    })

    it('should handle arrays of class names', () => {
      const result = cn(['class1', 'class2'], 'class3')
      expect(result).toBe('class1 class2 class3')
    })

    it('should handle mixed input types', () => {
      const result = cn(
        'base',
        ['array1', 'array2'],
        { conditional: true, excluded: false },
        'additional'
      )
      expect(result).toBe('base array1 array2 conditional additional')
    })

    it('should handle undefined and null values', () => {
      const result = cn('class1', undefined, 'class2', null, 'class3')
      expect(result).toBe('class1 class2 class3')
    })

    it('should handle empty inputs', () => {
      const result = cn()
      expect(result).toBe('')
    })

    it('should handle only falsy values', () => {
      const result = cn(false, null, undefined)
      expect(result).toBe('')
    })

    it('should merge conflicting Tailwind padding classes', () => {
      // Later padding classes should override earlier ones
      const result = cn('p-4', 'p-8')
      expect(result).toBe('p-8')
    })

    it('should merge conflicting Tailwind margin classes', () => {
      const result = cn('m-2', 'm-4')
      expect(result).toBe('m-4')
    })

    it('should handle multiple conflicting Tailwind classes', () => {
      const result = cn('text-sm text-red-500', 'text-lg text-blue-600')
      expect(result).toBe('text-lg text-blue-600')
    })

    it('should preserve non-conflicting Tailwind classes', () => {
      const result = cn('text-sm font-bold', 'text-lg')
      expect(result).toBe('font-bold text-lg')
    })

    it('should handle complex real-world scenario', () => {
      const isActive = true
      const isDisabled = false
      const variant = 'primary'

      const result = cn(
        'px-4 py-2 rounded',
        {
          'bg-blue-500 text-white': variant === 'primary',
          'bg-gray-500 text-white': variant === 'secondary',
        },
        isActive && 'ring-2 ring-blue-300',
        isDisabled && 'opacity-50 cursor-not-allowed'
      )

      expect(result).toBe('px-4 py-2 rounded bg-blue-500 text-white ring-2 ring-blue-300')
    })

    it('should handle whitespace correctly', () => {
      const result = cn('  class1  ', '  class2  ')
      expect(result).toBe('class1 class2')
    })

    it('should handle nested arrays', () => {
      const result = cn([['nested1', 'nested2'], 'class3'])
      expect(result).toBe('nested1 nested2 class3')
    })

    it('should deduplicate identical classes', () => {
      const result = cn('class1', 'class2', 'class1')
      expect(result).toBe('class2 class1')
    })
  })
})
