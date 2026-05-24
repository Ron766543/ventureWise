# VentureWise — Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** May 2026  
**Status:** Development-Ready

---

## 1. Executive Summary

VentureWise is a web-based entrepreneurship platform designed to reduce the gap between entrepreneurial aspiration and action for women, youth, and rural communities in India. It provides personalised business idea discovery, structured planning tools, and access to mentorship — making entrepreneurship guidance accessible to those traditionally underserved by formal business education.

---

## 2. Problem Statement

- Over 60% of aspiring entrepreneurs in rural India lack structured guidance to start
- Most business resources are not available in local languages or accessible formats
- Informal guidance is unreliable and geographically restricted
- Existing platforms are too complex or expensive for first-time entrepreneurs
- Women and youth with viable skills lack a framework to translate those into businesses

---

## 3. Goals

| Goal | Metric |
|------|--------|
| Drive self-employment | 5,000 users in first 6 months |
| Improve guidance quality | 80%+ users complete assessment |
| Enable successful launches | 500+ "launched" status updates |
| Grow mentor community | 150+ verified mentors in 12 months |
| Platform engagement | Avg. session > 8 min |

---

## 4. User Roles & Permissions

### 4.1 User (Entrepreneur)
- Register and create profile
- Complete skill/interest assessment
- Browse and filter business ideas
- View full roadmaps
- Save/bookmark ideas
- Track progress on ideas
- Access all learning resources
- Contact mentors (Q&A)

### 4.2 Mentor
- All User permissions
- Register mentor profile with expertise
- Receive and answer questions from mentees
- Upload training resources (pending admin approval)
- View mentee engagement statistics

### 4.3 Admin
- All Mentor permissions
- Manage all users (activate/deactivate)
- Verify mentor registrations
- Approve/reject resources
- Create and edit business ideas and roadmaps
- View platform-wide analytics

---

## 5. Functional Requirements

### 5.1 Authentication & Profiles
- **FR-01:** Users can register with name, email, password, and role (user/mentor)
- **FR-02:** Login with email + password, returning JWT
- **FR-03:** JWT expires after 7 days; auto-logout on expiry
- **FR-04:** Users can update profile: name, phone, location, bio, avatar
- **FR-05:** Admins can deactivate accounts

### 5.2 Skill & Interest Assessment
- **FR-06:** 4-step guided assessment: skills → interests → background → capital
- **FR-07:** Skills include level (beginner/intermediate/advanced)
- **FR-08:** Assessment data persists and can be updated anytime
- **FR-09:** Assessment completion triggers personalised idea recommendations

### 5.3 Business Idea Discovery
- **FR-10:** Ideas are browsable without login
- **FR-11:** Filter by category, difficulty, capital range, and target audience
- **FR-12:** Full-text search across title, description, and tags
- **FR-13:** Logged-in users see personalised recommendations based on skills + interests
- **FR-14:** Users can save/bookmark ideas to their profile
- **FR-15:** View count and save count tracked per idea

### 5.4 Roadmap Viewer
- **FR-16:** Each idea can have a linked roadmap
- **FR-17:** Roadmap tabs: Overview, Validation Steps, Cost Estimation, Legal Steps, Marketing Basics
- **FR-18:** Costs shown in INR with min/max ranges
- **FR-19:** Legal steps include authority, documents, and timeframe
- **FR-20:** Marketing channels show cost and effectiveness rating

### 5.5 Progress Tracking
- **FR-21:** Users can start tracking any idea (adds to dashboard)
- **FR-22:** Progress status: exploring → planning → in-progress → launched → paused
- **FR-23:** Progress entries show start date and optional target launch date
- **FR-24:** Percentage completion can be updated manually

### 5.6 Learning Resources
- **FR-25:** Resources categorised by type: video, article, checklist, template, guide, tool
- **FR-26:** Filter by type, category (legal/marketing/finance etc.), difficulty
- **FR-27:** Mentors and admins can upload resources
- **FR-28:** Resources require admin approval before being visible

### 5.7 Mentor Directory
- **FR-29:** All verified mentors are publicly browsable
- **FR-30:** Mentor profiles show expertise, languages, years of experience, rating
- **FR-31:** Logged-in users can send a question to any mentor
- **FR-32:** Mentors receive questions in their dashboard and can respond
- **FR-33:** Questions can be marked public (visible to all for common queries)

### 5.8 Admin Panel
- **FR-34:** Dashboard with platform stats (users, mentors, ideas, pending items)
- **FR-35:** User management with activate/deactivate toggle
- **FR-36:** Mentor verification workflow (review → verify/reject)
- **FR-37:** Resource approval workflow (review → approve/reject)
- **FR-38:** Ability to create/edit/delete business ideas and roadmaps

---

## 6. Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-01 | Page Load Time | < 3 seconds on 4G |
| NFR-02 | Low-bandwidth support | < 200KB initial bundle |
| NFR-03 | Uptime | 99.5% monthly |
| NFR-04 | Security | OWASP Top 10 compliance |
| NFR-05 | Accessibility | WCAG 2.1 Level AA |
| NFR-06 | Mobile Responsive | Works on 320px+ screens |
| NFR-07 | Offline Fallback | Sample data shown if API fails |
| NFR-08 | API Response Time | < 500ms for 95% of requests |

---

## 7. User Journey

```
New Visitor
    │
    ├── Browse Landing → Browse Ideas (no login required)
    │
    └── Register
            │
            └── Take Assessment (skills, interests, capital)
                    │
                    └── View Personalised Ideas
                            │
                            ├── Read Roadmap → Track Idea → Update Progress
                            │
                            ├── Browse Learning Resources
                            │
                            └── Connect with Mentor → Ask Question → Get Answer
```

---

## 8. Data Models (Summary)

### User
`name, email, password, role, skills[], interests[], experience, education, availableCapital, savedIdeas[], assessmentCompleted, isActive`

### BusinessIdea
`title, description, category, requiredSkills[], requiredCapital{min,max}, difficulty, timeToProfit, marketDemand, suitableFor[], isApproved, isFeatured, roadmap`

### Roadmap
`businessIdeaId, validation{steps[]}, skillsAndTools{tools[]}, legalSteps[], costEstimation{startup[], monthly[]}, marketingBasics{channels[]}, milestones[]`

### Mentor
`user, headline, expertise[], industries[], yearsOfExperience, languages[], availability, isVerified, rating, totalMentees`

### Resource
`title, description, type, category, url, fileUrl, tags[], difficulty, isApproved, isFeatured, uploadedBy`

### Progress
`user, businessIdea, roadmap, status, completedMilestones[], notes, startDate, targetLaunchDate, percentComplete`

### QASession
`mentor, mentee, question, answer, status, category, isPublic`

---

## 9. Out of Scope (v1.0)

- Native mobile apps (iOS/Android)
- Live video mentorship sessions
- Real-time chat
- Payment / loan processing
- Government subsidy integrations
- AI-powered career coaching
- Multi-language UI (Hindi localisation planned for v2)

---

## 10. Success Metrics

| Metric | 3-month Target | 6-month Target |
|--------|---------------|----------------|
| Registered Users | 500 | 5,000 |
| Assessment Completion Rate | 60% | 75% |
| Ideas Tracked | 300 | 2,500 |
| Launched Businesses | 50 | 500 |
| Active Mentors | 20 | 150 |
| Resources Published | 50 | 300 |
| Monthly Active Users | 300 | 3,000 |

---

## 11. Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Low user retention | Medium | Progress tracking + email nudges |
| Mentor availability | Medium | Async Q&A reduces time commitment |
| Content quality | Low | Admin approval workflow |
| Low-bandwidth access issues | High | Static data fallback, minimal images |
| Language barrier | Medium | Hindi UI planned for v2 |

---

*Document maintained by VentureWise Product Team*
