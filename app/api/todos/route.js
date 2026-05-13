import prisma from '@/lib/prisma';

export async function GET() {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return Response.json(todos);
}

export async function POST(request) {
  const { title } = await request.json();
  const todo = await prisma.todo.create({
    data: { title },
  });
  return Response.json(todo, { status: 201 });
}
