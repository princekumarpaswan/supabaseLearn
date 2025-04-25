import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { supabase } from "./supabase-client";

interface Task {
  id: number;
  title: string;
  description: string;
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddTask = async () => {
    if (!title.trim()) return;
    setLoading(true);
    const { error } = await supabase
      .from("tasks")
      .insert({ title, description });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      setTitle("");
      setDescription("");
      getAllTasks();
    }
  };

  const handleUpdate = async () => {
    if (!editId) return;
    setLoading(true);

    const { error } = await supabase
      .from("tasks")
      .update({ title, description })
      .eq("id", editId);

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      setEditId(null);
      setTitle("");
      setDescription("");
      getAllTasks();
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      getAllTasks();
    }
  };

  const handleEditClick = (task: Task) => {
    setTitle(task.title);
    setDescription(task.description);
    setEditId(task.id);
  };

  const getAllTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("tasks").select("*");
    setLoading(false);

    if (error) {
      alert(error.message);
    }
    if (data) {
      setTasks(data);
    }
  };

  useEffect(() => {
    getAllTasks();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Task Manager</h1>
      <div className="max-w-xl mx-auto space-y-4">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 rounded bg-gray-900 text-white border border-gray-700"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 rounded bg-gray-900 text-white border border-gray-700"
        />
        <button
          onClick={editId !== null ? handleUpdate : handleAddTask}
          className="w-full bg-neutral-900 hover:bg-neutral-800 text-white py-2 px-4 rounded"
          disabled={loading}
        >
          {editId !== null ? "Update Task" : "Add Task"}
        </button>
      </div>

      {loading && (
        <div className="text-center mt-4">
          <p className="text-gray-500">Loading...</p>
        </div>
      )}

      <div className="mt-10 max-w-xl mx-auto space-y-4 min-h-[300px]">
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center">
            No tasks yet. Add one above!
          </p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="bg-gray-900 border border-gray-700 p-4 rounded space-y-2"
            >
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <p className="text-gray-300">{task.description}</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleEditClick(task)}
                  className="bg-black hover:bg-gray-800 text-yellow-300 px-4 py-2 rounded flex items-center"
                  disabled={loading}
                >
                  <Pencil className="h-4 w-4 mr-2" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="bg-black hover:bg-gray-800 text-red-400 px-4 py-2 rounded flex items-center"
                  disabled={loading}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
