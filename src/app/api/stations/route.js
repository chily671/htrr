export async function GET() {
  const stations = [
    { name: 'Trạm A', lat: 10.7626, lng: 106.682, teamCount: 2 },
    { name: 'Trạm B', lat: 10.765, lng: 106.66, teamCount: 5 }, // đông
    { name: 'Trạm C', lat: 10.76, lng: 106.67, teamCount: 1 },
  ]
  return Response.json(stations)
}
