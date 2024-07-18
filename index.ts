

export function sse() {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  const response = new Response(readable, { status: 200, statusText: 'ok', headers: {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  } });

  async function send(data: string, id?: string, event?: string) {
    if (id) await writer.write(encoder.encode(`id: ${id}\n`));
    if (event) await writer.write(encoder.encode(`event: ${event}\n`));
    await writer.write(encoder.encode(`data: ${data}\n\n`));
  }

  async function sendJSON(data: any, id?: string, event?: string) {
    await send(JSON.stringify(data), id, event);
  }

  return { response, writer, encoder, send, sendJSON };
}