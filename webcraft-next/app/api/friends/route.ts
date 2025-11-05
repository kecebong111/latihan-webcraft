import { NextResponse } from 'next/server'

// Data dummy untuk sementara
const allFriends = [
  {
    id: 1,
    name: 'Adit',
    interest: 'Basketball',
    mutual: 12,
    image: '/profile/adit.jpg',
  },
  {
    id: 2,
    name: 'Rafi',
    interest: 'Football',
    mutual: 8,
    image: '/profile/rafi.jpg',
  },
  {
    id: 3,
    name: 'Salsa',
    interest: 'Coding',
    mutual: 5,
    image: '/profile/salsa.jpg',
  },
  {
    id: 4,
    name: 'Nadia',
    interest: 'Movies',
    mutual: 9,
    image: '/profile/nadia.jpg',
  },
]

// Handler untuk GET /api/friends
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const interest = searchParams.get('interest')

  // Filter data kalau ada interest dipilih
  const filtered = interest
    ? allFriends.filter((f) => f.interest === interest)
    : allFriends

  return NextResponse.json(filtered)
}
