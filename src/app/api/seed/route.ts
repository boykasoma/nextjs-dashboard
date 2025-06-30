import { posts } from '@/app/lib/placeholder-data';
import { db } from '@vercel/postgres';
import { NextResponse } from 'next/server';

async function seedPosts(client: any) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "posts" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS posts (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        author VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL UNIQUE,
        content TEXT NOT NULL,
        date TEXT NOT NULL
      );
    `;

    console.log(`Created "posts" table`);

    // Insert data into the "posts" table
    const insertedPosts = await Promise.all(
      posts.map(async (post: any) => {
        return client.sql`
        INSERT INTO posts (id, title, content, date, author)
        VALUES (${post.id}, ${post.title}, ${post.content}, ${post.date}, ${post.user})
        ON CONFLICT (title) DO NOTHING;
      `;
      })
    );
    console.log(`Seeded ${insertedPosts.length} posts articles`);

    return {
      createTable,
      posts: insertedPosts,
    };
  } catch (error) {
    console.error("Error seeding posts:", error);
    throw error;
  }
}

export async function GET() {
  try {
    const client = await db.connect();
    const result = await seedPosts(client);
    await client.end();
    
    return NextResponse.json({
      message: 'Database seeded successfully',
      result
    }, { status: 200 });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json({
      error: 'Failed to seed database',
      details: error
    }, { status: 500 });
  }
}
