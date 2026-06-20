-- Yahya Hub — initial schema for Supabase
-- Run this in Supabase → SQL Editor → paste & Run

CREATE TABLE IF NOT EXISTS "home_content" (
  "id" TEXT NOT NULL DEFAULT 'home',
  "heroTitle" TEXT NOT NULL DEFAULT 'Welcome to Yahya Hub',
  "heroSubtitle" TEXT NOT NULL DEFAULT 'A vibrant space for ideas, creativity, and collaboration. We offer coworking spaces, run skill-building programs, and host events that inspire innovation across every field.',
  "heroCtaPrimaryText" TEXT NOT NULL DEFAULT 'Explore Workspaces',
  "heroCtaPrimaryAnchor" TEXT NOT NULL DEFAULT 'workspaces',
  "heroCtaSecondaryText" TEXT NOT NULL DEFAULT 'Our Programs',
  "heroCtaSecondaryAnchor" TEXT NOT NULL DEFAULT 'programs',
  "heroVideoUrl" TEXT NOT NULL DEFAULT 'https://firebasestorage.googleapis.com/v0/b/yahyahub-e7643.firebasestorage.app/o/bookings-n-products%2Fhero%2Fvideo%2Fyahya_hub_commercial.mp4?alt=media&token=24f59eeb-8203-4a75-8763-0c1d4454b9b7',
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
  CONSTRAINT "home_content_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "footer_content" (
  "id" TEXT NOT NULL DEFAULT 'footer',
  "email" TEXT NOT NULL DEFAULT 'yahyahub6@gmail.com',
  "phone" TEXT NOT NULL DEFAULT '07043925169',
  "facebook" TEXT NOT NULL DEFAULT 'https://www.facebook.com/share/1913yPdrYe/',
  "twitter" TEXT NOT NULL DEFAULT 'https://x.com/YahyaHub',
  "linkedin" TEXT NOT NULL DEFAULT 'https://www.linkedin.com/company/yahyahub/posts',
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
  CONSTRAINT "footer_content_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "status_cards" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "icon" TEXT NOT NULL,
  "badgeLabel" TEXT NOT NULL,
  "badgeVariant" TEXT NOT NULL DEFAULT 'green',
  "primary" TEXT NOT NULL,
  "secondary" TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "status_cards_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "workspaces" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "rating" DOUBLE PRECISION NOT NULL DEFAULT 4.5,
  "reviewCount" INTEGER NOT NULL DEFAULT 0,
  "hourlyRate" INTEGER NOT NULL DEFAULT 0,
  "dailyRate" INTEGER NOT NULL DEFAULT 0,
  "imageUrl" TEXT NOT NULL,
  "bookingEnabled" BOOLEAN NOT NULL DEFAULT true,
  "amenities" TEXT NOT NULL DEFAULT '[]',
  "order" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "programs" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "duration" TEXT NOT NULL,
  "price" INTEGER NOT NULL DEFAULT 0,
  "status" TEXT NOT NULL DEFAULT 'upcoming',
  "cohort" TEXT,
  "type" TEXT,
  "enrollable" BOOLEAN NOT NULL DEFAULT true,
  "imageUrl" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "programs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "events" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "longWriteUp" TEXT,
  "category" TEXT NOT NULL,
  "mode" TEXT NOT NULL DEFAULT 'Physical',
  "isMostRecent" BOOLEAN NOT NULL DEFAULT false,
  "status" TEXT NOT NULL DEFAULT 'upcoming',
  "date" TEXT NOT NULL,
  "time" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "audience" TEXT NOT NULL,
  "fee" INTEGER NOT NULL DEFAULT 0,
  "instagramUrl" TEXT NOT NULL DEFAULT 'https://www.instagram.com/yahyahub/',
  "imageUrl" TEXT,
  "videoUrl" TEXT,
  "bookable" BOOLEAN NOT NULL DEFAULT true,
  "list" TEXT NOT NULL DEFAULT 'home',
  "order" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "workspace_availability" (
  "id" TEXT NOT NULL,
  "workspaceId" TEXT NOT NULL,
  "availableDays" TEXT NOT NULL DEFAULT '[1,2,3,4,5]',
  "openTime" TEXT NOT NULL DEFAULT '09:00',
  "closeTime" TEXT NOT NULL DEFAULT '20:00',
  "slotDuration" INTEGER NOT NULL DEFAULT 60,
  "blackoutDates" TEXT NOT NULL DEFAULT '[]',
  CONSTRAINT "workspace_availability_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "workspace_availability_workspaceId_key" UNIQUE ("workspaceId")
);

CREATE TABLE IF NOT EXISTS "workspace_bookings" (
  "id" TEXT NOT NULL,
  "workspaceId" TEXT NOT NULL,
  "ticketId" TEXT NOT NULL,
  "date" TEXT NOT NULL,
  "startTime" TEXT NOT NULL,
  "endTime" TEXT NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'hourly',
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "notes" TEXT NOT NULL,
  "amount" INTEGER NOT NULL DEFAULT 0,
  "status" TEXT NOT NULL DEFAULT 'confirmed',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "workspace_bookings_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "workspace_bookings_ticketId_key" UNIQUE ("ticketId")
);

CREATE TABLE IF NOT EXISTS "course_enrollments" (
  "id" TEXT NOT NULL,
  "programId" TEXT NOT NULL,
  "ticketId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "gender" TEXT,
  "education" TEXT,
  "amount" INTEGER NOT NULL DEFAULT 0,
  "paystackRef" TEXT,
  "status" TEXT NOT NULL DEFAULT 'confirmed',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "course_enrollments_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "course_enrollments_ticketId_key" UNIQUE ("ticketId")
);

CREATE TABLE IF NOT EXISTS "event_registrations" (
  "id" TEXT NOT NULL,
  "eventId" TEXT NOT NULL,
  "ticketId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "gender" TEXT,
  "amount" INTEGER NOT NULL DEFAULT 0,
  "paystackRef" TEXT,
  "status" TEXT NOT NULL DEFAULT 'confirmed',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "event_registrations_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "event_registrations_ticketId_key" UNIQUE ("ticketId")
);

CREATE TABLE IF NOT EXISTS "about_config" (
  "id" TEXT NOT NULL DEFAULT 'about',
  "data" TEXT NOT NULL,
  CONSTRAINT "about_config_pkey" PRIMARY KEY ("id")
);
