# End-to-End Verification Guide
## AI Content Scheduling & Copy Generation

This document provides step-by-step instructions for verifying the complete content scheduling workflow.

---

## Prerequisites

1. **Development server running**: `npm run dev`
2. **Access to Sanity Studio**: http://localhost:3000/studio
3. **CRON_SECRET configured** in Vercel environment variables (for production)

---

## Test Scenario: Complete Content Workflow

### Phase 1: Create & Schedule a Blog Post

1. **Navigate to Sanity Studio**
   - URL: http://localhost:3000/studio
   - Login with your Sanity credentials

2. **Create a new blog post using 'Draft with Claude'**
   - Click on "Blog Posts" in the navigation
   - Click "Create" → "Blog Post"
   - Click the "Draft with Claude" action button
   - Provide a topic/prompt for the AI to draft content
   - Wait for Claude to generate the draft

3. **Configure scheduling**
   - Scroll down to find the `scheduledPublishDate` field
   - Set the date/time to **5 minutes in the future**
   - Set `published` toggle to **OFF** (false)
   - Save the draft (Cmd/Ctrl + S)

4. **Verify in Content Calendar**
   - Click "Content Calendar" in the Studio navigation
   - Locate the current month
   - **EXPECTED**: The newly created post should appear on the future date in **yellow** (scheduled/draft status)
   - The post title should be visible on the calendar day cell

---

### Phase 2: Auto-Publish Scheduled Content

**Option A: Wait for natural cron execution (production)**
- Wait 5 minutes for the scheduled publish time to pass
- Vercel cron job runs hourly, so this only works after deployment

**Option B: Manually trigger the cron job (development/testing)**

1. **Load CRON_SECRET from .env.local into your shell** (never paste the value into docs or commands you share)
   ```bash
   export CRON_SECRET="$(grep '^CRON_SECRET=' .env.local | cut -d= -f2-)"
   ```

2. **Trigger the publish endpoint**
   ```bash
   curl -X GET http://localhost:3000/api/cron/publish-scheduled \
     -H "Authorization: Bearer $CRON_SECRET"
   ```

3. **Verify the response**
   ```json
   {
     "published": 1,
     "failed": 0,
     "posts": [
       {
         "id": "...",
         "title": "Your Post Title"
       }
     ]
   }
   ```

4. **Verify in Sanity Studio**
   - Refresh the blog post in Studio
   - **EXPECTED**: The draft has been published (no unpublished changes) and the `published` toggle is **ON** (true)

5. **Verify on public blog page**
   - Navigate to: http://localhost:3000/blog
   - **EXPECTED**: The post should now be visible in the blog list

6. **Verify in Content Calendar**
   - Go back to Content Calendar in Studio
   - **EXPECTED**: The post should now appear in **green** (published status)

---

### Phase 3: Generate Copy

1. **Open the published blog post in Studio**
   - Navigate to "Blog Posts"
   - Click on the post you just published

2. **Generate copy**
   - Click the "Generate Social Copy" action button
   - Wait for AI generation to complete
   - **EXPECTED**: Toast notification "Social copy generated — Created 2 social posts"

3. **Verify posts were created**
   - Navigate to "Social posts" in Studio
   - **EXPECTED**: You should see 2 new posts:
     - One for **Twitter** platform
     - One for **LinkedIn** platform

4. **Verify Twitter post**
   - Open the Twitter post
   - **EXPECTED**:
     - Platform field = "twitter"
     - Content field has text (max 280 characters)
     - Content includes relevant hashtags
     - Blog Post reference field links to the original blog post
     - Status = "draft"

5. **Verify LinkedIn post**
   - Open the LinkedIn post
   - **EXPECTED**:
     - Platform field = "linkedin"
     - Content field has professional copy
     - Content includes relevant hashtags
     - Blog Post reference field links to the original blog post
     - Status = "draft"

6. **Test editing posts**
   - Edit the Twitter post content
   - Save changes
   - **EXPECTED**: Changes persist and can be edited freely

---

## Verification Checklist

- [ ] Blog post created with 'Draft with Claude'
- [ ] `scheduledPublishDate` field visible and editable
- [ ] Post appears in Content Calendar on future date (yellow)
- [ ] Cron job can be manually triggered
- [ ] Post automatically set to `published=true` after scheduled time
- [ ] Published post visible on /blog page
- [ ] Post changes to green in Content Calendar after publishing
- [ ] 'Generate Social Copy' action visible for published posts
- [ ] Twitter post created (max 280 chars)
- [ ] LinkedIn post created
- [ ] Posts reference the original blog post
- [ ] Posts can be edited in Studio
- [ ] Posts have correct status (draft by default)

---

## Troubleshooting

### Cron endpoint returns 404
- Verify the API route exists at `src/app/api/cron/publish-scheduled/route.ts`
- Restart the dev server
- Check for TypeScript compilation errors

### Posts not publishing automatically
- Verify `scheduledPublishDate` is in the past
- Verify `published` is false
- Check Vercel cron job configuration in dashboard
- Verify `CRON_SECRET` is set in Vercel environment variables

### Copy generation fails
- Verify post is published (`published=true`)
- Check API route at `src/app/api/ai/social-copy/route.ts`
- Verify Anthropic API key is configured
- Check browser console for errors

### Posts not appearing in calendar
- Verify the post has either `scheduledPublishDate` or `date` field set
- Refresh the calendar view
- Check browser console for errors

---

## Implementation Details

### Files Created
1. `src/sanity/schemaTypes/socialPost.ts` - Schema definition
2. `src/sanity/actions/GenerateSocialCopyAction.tsx` - Studio action
3. `src/sanity/views/ContentCalendar.tsx` - Calendar view component
4. `src/app/api/ai/social-copy/route.ts` - AI generation endpoint
5. `src/app/api/cron/publish-scheduled/route.ts` - Scheduled publishing
6. `vercel.json` - Cron job configuration

### Files Modified
1. `src/sanity/schemaTypes/blogPost.ts` - Added scheduledPublishDate field
2. `src/sanity/schemaTypes/index.ts` - Registered socialPost schema
3. `sanity.config.ts` - Registered GenerateSocialCopyAction
4. `src/sanity/structure.ts` - Added Content Calendar to navigation
5. `src/lib/blog.ts` - Filter posts by scheduled date

---

## Success Criteria

All acceptance criteria met:
- Blog posts can be scheduled for future publication dates via Sanity CMS
- Scheduled posts publish automatically at the designated time via cron
- AI action in Sanity Studio generates platform copy from published blog posts
- Generated copy respects platform character limits and includes relevant hashtags
- Content calendar view in Sanity Studio shows timeline of scheduled and published content
- Copy can be edited before use and saved as drafts in Sanity
