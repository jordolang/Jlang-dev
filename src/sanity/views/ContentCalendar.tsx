"use client";

import { useEffect, useMemo, useState } from "react";
import { useClient } from "sanity";
import { Box, Button, Card, Container, Flex, Grid, Heading, Spinner, Stack, Text } from "@sanity/ui";
import { apiVersion } from "../env";

interface BlogPost {
  _id: string;
  title: string;
  scheduledPublishDate?: string;
  date?: string;
  published?: boolean;
}

interface CalendarDay {
  date: Date;
  posts: BlogPost[];
  isCurrentMonth: boolean;
}

/**
 * Content calendar view showing scheduled and published blog posts.
 * Posts are displayed on their scheduledPublishDate if set, otherwise on their publish date.
 */
export function ContentCalendar() {
  const baseClient = useClient({ apiVersion });
  // Drafts perspective so scheduled-but-unpublished posts show up too.
  const client = useMemo(() => baseClient.withConfig({ perspective: "drafts" }), [baseClient]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const shiftMonth = (delta: number) =>
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + delta, 1));
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

  // Fetch blog posts
  useEffect(() => {
    async function fetchPosts() {
      try {
        const query = `*[_type == "blogPost"] | order(date desc) {
          _id,
          title,
          scheduledPublishDate,
          date,
          published
        }`;
        const result = await client.fetch<BlogPost[]>(query);
        setPosts(result);
      } catch (error) {
        console.error("Failed to fetch blog posts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [client]);

  // Build calendar grid for current month
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get first day of month and last day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Get day of week for first day (0 = Sunday)
    const startingDayOfWeek = firstDay.getDay();

    // Calculate days to show from previous month
    const daysFromPrevMonth = startingDayOfWeek;

    // Calculate total days to show (ensure we have complete weeks)
    const daysInMonth = lastDay.getDate();
    const totalDays = Math.ceil((daysFromPrevMonth + daysInMonth) / 7) * 7;

    // Build calendar days
    const days: CalendarDay[] = [];
    for (let i = 0; i < totalDays; i++) {
      const dayOffset = i - daysFromPrevMonth;
      const date = new Date(year, month, dayOffset + 1);
      const isCurrentMonth = dayOffset >= 0 && dayOffset < daysInMonth;

      // Find posts for this day
      const dayPosts = posts.filter((post) => {
        const postDate = post.scheduledPublishDate || post.date;
        if (!postDate) return false;

        // A bare YYYY-MM-DD parses as UTC midnight (the day before, west of UTC); force local time.
        const pd = new Date(postDate.length === 10 ? `${postDate}T00:00:00` : postDate);
        return (
          pd.getFullYear() === date.getFullYear() &&
          pd.getMonth() === date.getMonth() &&
          pd.getDate() === date.getDate()
        );
      });

      days.push({ date, posts: dayPosts, isCurrentMonth });
    }

    setCalendarDays(days);
  }, [posts, currentDate]);

  if (loading) {
    return (
      <Container padding={4}>
        <Flex align="center" justify="center" padding={5}>
          <Spinner />
        </Flex>
      </Container>
    );
  }

  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Container width={5} padding={4}>
      <Stack space={4}>
        <Heading as="h1" size={3}>
          Content Calendar
        </Heading>

        <Card padding={4} radius={2} shadow={1}>
          <Stack space={4}>
            <Flex align="center" justify="space-between">
              <Button mode="ghost" text="‹ Prev" onClick={() => shiftMonth(-1)} />
              <Heading as="h2" size={2}>
                {monthName}
              </Heading>
              <Button mode="ghost" text="Next ›" onClick={() => shiftMonth(1)} />
            </Flex>

            {/* Week day headers */}
            <Grid columns={7} gap={2}>
              {weekDays.map((day) => (
                <Box key={day} padding={2}>
                  <Text size={1} weight="semibold" align="center">
                    {day}
                  </Text>
                </Box>
              ))}
            </Grid>

            {/* Calendar days */}
            <Grid columns={7} gap={2}>
              {calendarDays.map((day, index) => (
                <Card
                  key={index}
                  padding={2}
                  radius={2}
                  tone={day.isCurrentMonth ? "default" : "transparent"}
                  style={{
                    minHeight: "100px",
                    opacity: day.isCurrentMonth ? 1 : 0.4,
                  }}
                >
                  <Stack space={2}>
                    <Text size={1} weight="semibold">
                      {day.date.getDate()}
                    </Text>

                    {day.posts.length > 0 && (
                      <Stack space={1}>
                        {day.posts.map((post) => (
                          <Card
                            key={post._id}
                            padding={1}
                            radius={1}
                            tone={post.published ? "positive" : "caution"}
                            style={{ cursor: "pointer" }}
                          >
                            <Text size={0} style={{ wordBreak: "break-word" }}>
                              {post.title}
                            </Text>
                          </Card>
                        ))}
                      </Stack>
                    )}
                  </Stack>
                </Card>
              ))}
            </Grid>
          </Stack>
        </Card>

        {/* Legend */}
        <Card padding={3} radius={2} tone="transparent">
          <Flex gap={4}>
            <Flex align="center" gap={2}>
              <Card padding={2} radius={1} tone="positive">
                <Box style={{ width: "12px", height: "12px" }} />
              </Card>
              <Text size={1}>Published</Text>
            </Flex>
            <Flex align="center" gap={2}>
              <Card padding={2} radius={1} tone="caution">
                <Box style={{ width: "12px", height: "12px" }} />
              </Card>
              <Text size={1}>Scheduled/Draft</Text>
            </Flex>
          </Flex>
        </Card>
      </Stack>
    </Container>
  );
}
