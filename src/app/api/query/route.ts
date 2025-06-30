import { db } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const table = searchParams.get('table') || 'posts';
    const limit = searchParams.get('limit') || '10';
    const offset = searchParams.get('offset') || '0';

    const client = await db.connect();
    
    // Basic query to get posts (you can extend this based on your needs)
    let query;
    
    switch (table) {
      case 'posts':
        query = await client.sql`
          SELECT * FROM posts 
          ORDER BY date DESC 
          LIMIT ${parseInt(limit)} 
          OFFSET ${parseInt(offset)};
        `;
        break;
      default:
        client.release();
        return NextResponse.json({
          error: 'Invalid table specified'
        }, { status: 400 });
    }
    
    client.release();
    
    return NextResponse.json({
      success: true,
      data: query.rows,
      count: query.rows.length
    }, { status: 200 });
    
  } catch (error) {
    console.error('Query error:', error);
    return NextResponse.json({
      error: 'Failed to query database',
      details: error
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query: customQuery, params = [] } = body;
    
    if (!customQuery) {
      return NextResponse.json({
        error: 'Query is required'
      }, { status: 400 });
    }
    
    const client = await db.connect();
    
    // Execute custom query with parameters
    const result = await client.query(customQuery, params);
    
    client.release();
    
    return NextResponse.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    }, { status: 200 });
    
  } catch (error) {
    console.error('Custom query error:', error);
    return NextResponse.json({
      error: 'Failed to execute custom query',
      details: error
    }, { status: 500 });
  }
}
