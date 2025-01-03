export async function POST(request: Request) {
  try {
    const { data } = await request.json()
    return new Response(
      JSON.stringify({
        message: 'Data received',
      }),
      { status: 200 },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: 'Error receiving data',
      }),
      { status: 500 },
    )
  }
}
