/**
 * Test API route - verificar que las API routes funcionan
 */

export async function GET() {
  return Response.json({ status: "ok", message: "API funcionando" });
}

export async function POST(req: Request) {
  const body = await req.json();
  return Response.json({ 
    status: "ok", 
    received: body,
    timestamp: new Date().toISOString()
  });
}
