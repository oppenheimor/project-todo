import prisma from '@/lib/prisma';

export async function PUT(request, { params }) {
  const { id } = await params;
  const { completed } = await request.json();
  const todo = await prisma.todo.update({
    where: { id: parseInt(id) },
    data: { completed },
  });
  return Response.json(todo);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  await prisma.todo.delete({
    where: { id: parseInt(id) },
  });
  return new Response(null, { status: 204 });
}
