import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbconfigue/dbConfigue';
import { z } from 'zod';
import { auth } from '@/auth';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdir } from 'fs/promises';
import { UserProfile } from '@/models/profile.model/profileModel';

// Define the profile schema to match our updated model
const profileSchema = z.object({
  name: z.string().min(2).max(50),
  username: z.string().min(3).max(30),
  email: z.string().email(),
  location: z.string().min(1),
  website: z.string().url().optional(),
  bio: z.string().max(500).optional(),
  image: z.string().nullable().optional(),
});

function handleError(error: unknown): NextResponse {
  console.error('API Error:', error);
  if (error instanceof z.ZodError) {
    return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
  }
  return NextResponse.json(
    { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
    { status: 500 }
  );
}

// POST: Create a new user profile
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;
    const userId = session?.user?.id;
    if (!userEmail || !userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const data = await req.json();
    const validatedData = profileSchema.parse(data);
    await connect();
    const existingProfile = await UserProfile.findOne({ userId });
    if (existingProfile) {
      return NextResponse.json({ error: 'Profile already exists' }, { status: 409 });
    }
    const newUserProfile = new UserProfile({ ...validatedData, userId });
    const savedProfile = await newUserProfile.save();
    return NextResponse.json(savedProfile, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

// GET: Retrieve user profile
export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connect();
    const userProfile = await UserProfile.findOne({ userId }).select('-__v');
    if (!userProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    return NextResponse.json(userProfile, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

// PUT: Update existing profile
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const data = await req.json();
    const validatedData = profileSchema.parse(data);
    await connect();
    const updatedProfile = await UserProfile.findOneAndUpdate(
      { userId },
      validatedData,  // Added the validated data here
      { new: true, runValidators: true }
    ).select('-__v');
    if (!updatedProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    return NextResponse.json(updatedProfile, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

// DELETE: Delete user profile
export async function DELETE() {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connect();
    const deletedProfile = await UserProfile.findOneAndDelete({ userId });
    if (!deletedProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Profile deleted successfully' }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

// PATCH: Update profile image
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('image') as File | null;  // Changed from profilePicture to image

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Save the file
    const uniqueFilename = `${Date.now()}-${file.name}`;
    const filePath = join(uploadsDir, uniqueFilename);
    await writeFile(filePath, buffer);
    
    // Update the user profile with the new image URL
    await connect();
    const updatedProfile = await UserProfile.findOneAndUpdate(
      { userId },
      { image: `/uploads/${uniqueFilename}` },  // Changed from profilePicture to image
      { new: true, runValidators: true }
    ).select('-__v');

    if (!updatedProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ image: updatedProfile.image }, { status: 200 });  // Changed from profilePicture to image
  } catch (error) {
    return handleError(error);
  }
}