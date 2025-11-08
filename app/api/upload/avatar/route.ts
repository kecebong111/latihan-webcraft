import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { updateUserAvatar } from '@/actions/user';

export async function POST(request: NextRequest) {
  try {
    console.log('Avatar upload request received')
    const session = await auth();
    
    if (!session?.user?.id) {
      console.log('Unauthorized - no session')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'photos', 'avatars');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch {
      // Directory might already exist
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.type.split('/')[1];
    const filename = `${session.user.id}-${timestamp}.${fileExtension}`;
    const filepath = join(uploadsDir, filename);
    
    console.log('File details:', {
      originalName: file.name,
      type: file.type,
      size: file.size,
      filename,
      filepath
    });

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);
    console.log('File saved successfully to:', filepath);

    // Create the URL that will be stored in database
    const avatarUrl = `/photos/avatars/${filename}`;
    console.log('Generated avatar URL:', avatarUrl);

    // Update user's avatar in database
    console.log('Updating user avatar in database:', avatarUrl)
    await updateUserAvatar(session.user.id, avatarUrl);
    console.log('Database updated successfully')

    return NextResponse.json({ 
      success: true, 
      avatarUrl,
      message: 'Avatar uploaded successfully' 
    });

  } catch (error) {
    console.error('Error uploading avatar:', error);
    return NextResponse.json({ error: 'Failed to upload avatar' }, { status: 500 });
  }
}