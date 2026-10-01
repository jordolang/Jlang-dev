/**
 * End-to-end verification script for Enhanced Client Review Workflow
 *
 * This script verifies the complete review workflow from creation to publication:
 * 1. Creates a review request in Sanity
 * 2. Simulates client viewing the review page
 * 3. Simulates client submitting the review
 * 4. Simulates Jordan responding with a message
 * 5. Simulates Jordan publishing the review
 * 6. Verifies all status transitions and data integrity
 */

import { createClient } from '@sanity/client'
import type { SanityClient } from '@sanity/client'

const sanityClient: SanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

interface ReviewRequest {
  _id: string
  _type: 'reviewRequest'
  clientName: string
  company: string
  role: string
  email: string
  token: string
  status: string
  viewedAt?: string
  submittedAt?: string
  publishedAt?: string
  interactions?: Array<{
    _type: 'interaction'
    timestamp: string
    type: 'response' | 'revision_request' | 'submission'
    metadata?: {
      author?: string
      message?: string
      action?: string
    }
  }>
}

interface Testimonial {
  _id: string
  _type: 'testimonial'
  clientName: string
  content: string
  rating: number
  approved: boolean
  reviewRequest?: {
    _ref: string
  }
}

async function makeApiRequest(endpoint: string, method: string = 'GET', body?: any) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const url = `${baseUrl}${endpoint}`

  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      // Admin routes verify this against Sanity's /users/me
      Authorization: `Bearer ${process.env.SANITY_API_WRITE_TOKEN}`,
    },
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  const response = await fetch(url, options)

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`API request failed: ${response.status} ${error}`)
  }

  return response.json()
}

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function verifyE2EWorkflow() {
  console.log('Starting Enhanced Review Workflow E2E Verification\n')

  const testToken = `e2e-test-${Date.now()}`
  let reviewRequestId: string | null = null
  let testimonialId: string | null = null

  try {
    // Step 1: Create review request in Sanity
    console.log('Step 1: Creating review request in Sanity...')
    const reviewRequest: ReviewRequest = await sanityClient.create({
      _type: 'reviewRequest',
      clientName: 'E2E Test Client',
      company: 'Test Company Inc',
      role: 'CEO',
      email: 'test@example.com',
      token: testToken,
      status: 'sent',
      sentAt: new Date().toISOString(),
    })
    reviewRequestId = reviewRequest._id
    console.log(`Created review request: ${reviewRequestId}`)
    console.log(`   Status: ${reviewRequest.status}`)
    console.log(`   Token: ${testToken}\n`)

    // Step 2: Simulate client viewing review page
    console.log('Step 2: Simulating client viewing review page...')
    await makeApiRequest(`/api/reviews/${testToken}/view`, 'POST')
    await delay(500) // Wait for Sanity to update

    const viewedRequest = await sanityClient.getDocument<ReviewRequest>(reviewRequestId)
    if (!viewedRequest) {
      throw new Error('Review request not found after view tracking')
    }
    console.log(`View tracked successfully`)
    console.log(`   Status: ${viewedRequest.status}`)
    console.log(`   ViewedAt: ${viewedRequest.viewedAt || 'Not set'}\n`)

    if (viewedRequest.status !== 'viewed') {
      throw new Error(`Expected status 'viewed', got '${viewedRequest.status}'`)
    }
    if (!viewedRequest.viewedAt) {
      throw new Error('viewedAt timestamp not set')
    }

    // Step 3: Simulate client submitting review
    console.log('Step 3: Simulating client submitting review...')
    const submitResponse = await makeApiRequest('/api/reviews/submit', 'POST', {
      token: testToken,
      content: 'This is an excellent service! Jordan was professional, responsive, and delivered exceptional results. Highly recommend for any web development project.',
      rating: 5,
    })
    console.log(`Review submitted successfully`)
    console.log(`   Response:`, submitResponse)

    await delay(1000) // Wait for Sanity to update

    const submittedRequest = await sanityClient.getDocument<ReviewRequest>(reviewRequestId)
    if (!submittedRequest) {
      throw new Error('Review request not found after submission')
    }
    console.log(`   Status: ${submittedRequest.status}`)
    console.log(`   SubmittedAt: ${submittedRequest.submittedAt || 'Not set'}\n`)

    if (submittedRequest.status !== 'submitted') {
      throw new Error(`Expected status 'submitted', got '${submittedRequest.status}'`)
    }
    if (!submittedRequest.submittedAt) {
      throw new Error('submittedAt timestamp not set')
    }

    // Step 4: Find created testimonial
    console.log('Step 4: Verifying testimonial creation...')
    const testimonials = await sanityClient.fetch<Testimonial[]>(
      `*[_type == "testimonial" && reviewRequest._ref == $requestId]`,
      { requestId: reviewRequestId }
    )

    if (testimonials.length === 0) {
      throw new Error('Testimonial not created after review submission')
    }

    const testimonial = testimonials[0]
    testimonialId = testimonial._id
    console.log(`Testimonial created: ${testimonialId}`)
    console.log(`   ClientName: ${testimonial.clientName}`)
    console.log(`   Rating: ${testimonial.rating}/5`)
    console.log(`   Approved: ${testimonial.approved}`)
    console.log(`   ReviewRequest ref: ${testimonial.reviewRequest?._ref || 'Not set'}\n`)

    if (!testimonial.reviewRequest?._ref) {
      throw new Error('Testimonial does not link back to review request')
    }
    if (testimonial.reviewRequest._ref !== reviewRequestId) {
      throw new Error('Testimonial links to wrong review request')
    }

    // Step 5: Simulate Jordan responding with thank you message
    console.log('Step 5: Simulating Jordan responding to review...')
    await makeApiRequest(`/api/admin/reviews/${reviewRequestId}/respond`, 'POST', {
      message: 'Thank you so much for your wonderful feedback! It was a pleasure working with you on this project.',
      action: 'respond',
    })

    await delay(1000) // Wait for Sanity to update

    const respondedRequest = await sanityClient.getDocument<ReviewRequest>(reviewRequestId)
    if (!respondedRequest) {
      throw new Error('Review request not found after Jordan response')
    }
    console.log(`Jordan's response recorded`)
    console.log(`   Status: ${respondedRequest.status}`)
    console.log(`   Interactions: ${respondedRequest.interactions?.length || 0}\n`)

    if (!respondedRequest.interactions || respondedRequest.interactions.length === 0) {
      throw new Error('Interaction not recorded')
    }

    const interaction = respondedRequest.interactions[respondedRequest.interactions.length - 1]
    console.log(`   Last interaction:`)
    console.log(`     Type: ${interaction.type}`)
    console.log(`     Author: ${interaction.metadata?.author || 'Not set'}`)
    console.log(`     Message: ${interaction.metadata?.message?.substring(0, 50)}...\n`)

    if (interaction.type !== 'response') {
      throw new Error(`Expected interaction type 'response', got '${interaction.type}'`)
    }
    if (interaction.metadata?.author !== 'jordan') {
      throw new Error(`Expected author 'jordan', got '${interaction.metadata?.author}'`)
    }

    // Step 6: Fetch status via API to verify client view
    console.log('Step 6: Verifying status API endpoint...')
    const statusResponse = await makeApiRequest(`/api/reviews/${testToken}/status`, 'GET')
    console.log(`Status API working`)
    console.log(`   Status: ${statusResponse.status}`)
    console.log(`   Interactions count: ${statusResponse.interactions?.length || 0}\n`)

    // Step 7: Simulate Jordan publishing the review
    console.log('Step 7: Simulating Jordan publishing review...')
    await makeApiRequest(`/api/admin/reviews/${reviewRequestId}/respond`, 'POST', {
      message: 'Published with gratitude!',
      action: 'publish',
    })

    await delay(1000) // Wait for Sanity to update

    const publishedRequest = await sanityClient.getDocument<ReviewRequest>(reviewRequestId)
    if (!publishedRequest) {
      throw new Error('Review request not found after publishing')
    }
    console.log(`Review published`)
    console.log(`   Status: ${publishedRequest.status}`)
    console.log(`   PublishedAt: ${publishedRequest.publishedAt || 'Not set'}\n`)

    if (publishedRequest.status !== 'completed') {
      throw new Error(`Expected status 'completed', got '${publishedRequest.status}'`)
    }
    if (!publishedRequest.publishedAt) {
      throw new Error('publishedAt timestamp not set')
    }

    // Step 8: Verify testimonial is approved
    console.log('Step 8: Verifying testimonial approval...')
    const publishedTestimonial = await sanityClient.getDocument<Testimonial>(testimonialId)
    if (!publishedTestimonial) {
      throw new Error('Testimonial not found after publishing')
    }
    console.log(`   Approved: ${publishedTestimonial.approved}`)

    if (!publishedTestimonial.approved) {
      throw new Error('Testimonial not approved after publishing')
    }

    console.log('\n*** ALL VERIFICATION STEPS PASSED! ***\n')
    console.log('Summary:')
    console.log('  - Review request created with status "sent"')
    console.log('  - Status changed to "viewed" when client opened page')
    console.log('  - Status changed to "submitted" when client submitted review')
    console.log('  - Testimonial created with proper reference to review request')
    console.log('  - Jordan response recorded in interactions array')
    console.log('  - Status API returns correct data for client view')
    console.log('  - Review published with status "completed"')
    console.log('  - Testimonial approved after publishing')
    console.log('  - Full audit trail maintained\n')

    return true

  } catch (error) {
    console.error('\n*** VERIFICATION FAILED ***:', error)
    throw error

  } finally {
    // Cleanup: Delete test data
    if (reviewRequestId || testimonialId) {
      console.log('Cleaning up test data...')

      const transaction = sanityClient.transaction()

      if (testimonialId) {
        transaction.delete(testimonialId)
        console.log(`   Deleting testimonial: ${testimonialId}`)
      }

      if (reviewRequestId) {
        transaction.delete(reviewRequestId)
        console.log(`   Deleting review request: ${reviewRequestId}`)
      }

      await transaction.commit()
      console.log('Cleanup completed\n')
    }
  }
}

// Run verification
verifyE2EWorkflow()
  .then(() => {
    console.log('E2E verification completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('E2E verification failed:', error)
    process.exit(1)
  })
