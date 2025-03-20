export async function POST(req: Request) {
    try {
      const body = await req.json();
  
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxTgS9ZmQ5f8PCbNYDZP2m_VYfcUn6Na-_F16hnKXFfX6Llbi61kQzK26SVgq0NWjzc/exec",
        {
          method: "POST",
          body: JSON.stringify(body),
          headers: { "Content-Type": "application/json" },
        }
      );
  
      const data = await response.json();
      return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Error al subir archivo" }), { status: 500 });
    }
  }
  