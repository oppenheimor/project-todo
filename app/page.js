'use client';
import { useEffect, useState } from 'react';

function CheckIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 13.5l4 4L19 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.4"
      />
    </svg>
  );
}

function PlusIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" />
    </svg>
  );
}

function TrashIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 4h6m-8 4h10m-9 0 .7 11h6.6L16 8M10 11v5m4-5v5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTodos = async () => {
    const res = await fetch('/todo/api/todos');
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => {
    let ignore = false;

    fetch('/todo/api/todos')
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) setTodos(data);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    await fetch('/todo/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    setTitle('');
    setLoading(false);
    fetchTodos();
  };

  const toggleTodo = async (todo) => {
    await fetch(`/todo/api/todos/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !todo.completed }),
    });
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await fetch(`/todo/api/todos/${id}`, { method: 'DELETE' });
    fetchTodos();
  };

  const activeTodos = todos.filter((t) => !t.completed);
  const doneTodos = todos.filter((t) => t.completed);
  const completionRate = todos.length ? Math.round((doneTodos.length / todos.length) * 100) : 0;

  return (
    <main className="min-h-screen overflow-hidden bg-[#F8FAFC] text-slate-900">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_34%),linear-gradient(135deg,rgba(15,23,42,0.04),transparent_40%)]" />

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <header className="grid gap-4 rounded-[28px] border border-white/80 bg-white/85 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur md:grid-cols-[1fr_auto] md:items-end md:p-7">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              今日任务台
            </p>
            <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">合契 TODO</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              把脑子里乱飞的任务先落地，再一项项清掉。页面负责秩序，你负责推进。
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:min-w-[360px]">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-medium text-slate-500">全部</p>
              <p className="mt-1 text-2xl font-black text-slate-950">{todos.length}</p>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
              <p className="text-xs font-medium text-blue-700">进行中</p>
              <p className="mt-1 text-2xl font-black text-blue-700">{activeTodos.length}</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <p className="text-xs font-medium text-emerald-700">完成率</p>
              <p className="mt-1 text-2xl font-black text-emerald-700">{completionRate}%</p>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-6">
            <form onSubmit={addTodo} className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <label className="sr-only" htmlFor="new-todo">
                新增待办
              </label>
              <input
                id="new-todo"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="写下一个明确的下一步..."
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 text-sm font-bold text-white shadow-[0_14px_30px_rgba(249,115,22,0.28)] transition hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <PlusIcon />
                {loading ? '添加中' : '添加任务'}
              </button>
            </form>

            {activeTodos.length === 0 && doneTodos.length === 0 && (
              <div className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-14 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
                  <CheckIcon className="h-6 w-6" />
                </div>
                <p className="mt-4 text-sm font-bold text-slate-800">还没有待办事项</p>
                <p className="mt-1 text-sm text-slate-500">先写下一件最小可行动作。</p>
              </div>
            )}

            {activeTodos.length > 0 && (
              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-black text-slate-950">进行中</h2>
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                    {activeTodos.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {activeTodos.map((todo) => (
                    <article
                      key={todo.id}
                      className="group flex min-h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 transition hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-sm sm:px-4"
                    >
                      <button
                        type="button"
                        onClick={() => toggleTodo(todo)}
                        aria-label={`完成 ${todo.title}`}
                        className="flex h-6 w-6 flex-shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-slate-300 text-transparent transition hover:border-blue-500 hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                      >
                        <CheckIcon className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-0 flex-1 break-words text-sm font-semibold leading-6 text-slate-800">
                        {todo.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteTodo(todo.id)}
                        aria-label={`删除 ${todo.title}`}
                        className="flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-xl text-slate-300 transition hover:bg-red-50 hover:text-red-500 focus:outline-none focus:ring-4 focus:ring-red-100"
                      >
                        <TrashIcon />
                      </button>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {doneTodos.length > 0 && (
              <div className="mt-8">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-black text-slate-950">已完成</h2>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                    {doneTodos.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {doneTodos.map((todo) => (
                    <article
                      key={todo.id}
                      className="group flex min-h-14 items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 transition hover:bg-white sm:px-4"
                    >
                      <button
                        type="button"
                        onClick={() => toggleTodo(todo)}
                        aria-label={`恢复 ${todo.title}`}
                        className="flex h-6 w-6 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-emerald-500 text-white transition hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                      >
                        <CheckIcon className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-0 flex-1 break-words text-sm font-medium leading-6 text-slate-400 line-through decoration-slate-300">
                        {todo.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteTodo(todo.id)}
                        aria-label={`删除 ${todo.title}`}
                        className="flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-xl text-slate-300 transition hover:bg-red-50 hover:text-red-500 focus:outline-none focus:ring-4 focus:ring-red-100"
                      >
                        <TrashIcon />
                      </button>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        <footer className="px-2 text-center text-xs font-semibold tracking-wide text-slate-400 sm:text-right">
          Build By &nbsp; 浚涵 · 凌一 · 佳棋
        </footer>
      </section>
    </main>
  );
}
