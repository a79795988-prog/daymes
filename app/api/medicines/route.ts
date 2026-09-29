import { NextResponse } from 'next/server';
import { MEDICINES } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  let results = [...MEDICINES];
  if (category && category !== 'All') {
    if (category === 'Prescription') {
      results = results.filter((m) => m.requiresRx);
    } else {
      results = results.filter((m) => m.category.toLowerCase() === category.toLowerCase());
    }
  }
  if (search) {
    const q = search.toLowerCase();
    results = results.filter((m) => m.name.toLowerCase().includes(q) || m.brand.toLowerCase().includes(q));
  }

  return NextResponse.json(results);
}
