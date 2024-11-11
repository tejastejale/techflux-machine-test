import React, { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { getProducts } from "../API/requests";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion"; // Imported for animations

function Main() {
  // State for data, loading status, modal, and form inputs
  const data = useSelector((state) => state.PostReducer.posts);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [post, setPost] = useState({ title: "", body: "" });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [posts, setPosts] = useState();
  const dispatch = useDispatch();

  // Fetch posts data from API on component mount using redux
  useEffect(() => {
    getProducts(dispatch);
  }, [dispatch]);

  // Update posts state based on fetched data
  useEffect(() => {
    if (data) {
      if (data.status === 200) {
        setPosts(data.data);
        setLoading(false);
      } else {
        setLoading(true);
      }
    }
  }, [data]);

  // Create a new post
  const handleCreatePost = async () => {
    try {
      await axios.post("https://jsonplaceholder.typicode.com/posts", {
        title: post.title,
        body: post.body,
        userId: 1,
      });
      getProducts(dispatch); // Refresh posts after creation
      closeModal();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  // Update an existing post
  const handleUpdatePost = async () => {
    try {
      await axios.put(`https://jsonplaceholder.typicode.com/posts/${editId}`, {
        title: post.title,
        body: post.body,
        userId: 1,
      });
      getProducts(dispatch); // Refresh posts after update
      closeModal();
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  // Delete a post with confirmation prompt
  const handleDeletePost = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "question",
      showConfirmButton: true,
      showCancelButton: true,
      customClass: {
        confirmButton: "bg-blue-500",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `https://jsonplaceholder.typicode.com/posts/${id}`
          );
          Swal.fire({
            title: "Successfully deleted!",
            icon: "success",
            timer: 3000,
            showConfirmButton: false,
          });
          getProducts(dispatch); // Refresh posts after deletion
        } catch (error) {
          console.error("Error deleting post:", error);
        }
      }
    });
  };

  // Open modal for creating or editing post
  const openModal = (edit = false, post = null) => {
    setModalOpen(true);
    setEditMode(edit);
    if (edit && post) {
      setPost({ title: post.title, body: post.body });
      setEditId(post.id);
    } else {
      setPost({ title: "", body: "" });
    }
  };

  // Close modal and reset form
  const closeModal = () => {
    setModalOpen(false);
    setEditMode(false);
    setEditId(null);
    setPost({ title: "", body: "" });
  };

  // Handle drag-and-drop sorting for posts
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedPosts = Array.from(posts);
    const [movedPost] = reorderedPosts.splice(result.source.index, 1);
    reorderedPosts.splice(result.destination.index, 0, movedPost);
    setPosts(reorderedPosts);
  };

  return (
    <div className="flex flex-col items-center p-10 w-screen">
      <button
        onClick={() => openModal()}
        className="mb-4 p-2 bg-blue-500 text-white rounded"
      >
        Add New Post
      </button>

      <AnimatePresence>
        {modalOpen && (
          <div className="z-10 fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <motion.div
              initial={{ opacity: 0.2, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }} // Corrected exit animation
              transition={{ ease: "easeInOut", duration: 0.2 }}
              className="bg-white p-5 rounded shadow-lg w-96"
            >
              <h2 className="text-xl mb-4">
                {editMode ? "Edit Post" : "Add New Post"}
              </h2>
              <input
                type="text"
                value={post.title}
                onChange={(e) => setPost({ ...post, title: e.target.value })}
                placeholder="Title"
                className="border p-2 mb-4 w-full"
              />
              <textarea
                value={post.body}
                onChange={(e) => setPost({ ...post, body: e.target.value })}
                placeholder="Body"
                className="border p-2 mb-4 w-full"
              />
              <button
                onClick={editMode ? handleUpdatePost : handleCreatePost}
                className="p-2 bg-blue-500 text-white rounded w-full"
              >
                {editMode ? "Update Post" : "Add Post"}
              </button>
              <button
                onClick={closeModal}
                className="mt-2 p-2 bg-red-500 text-white rounded w-full"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl font-semibold text-gray-500">Loading...</p>
        </div>
      ) : (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="postsTable">
              {(provided) => (
                <table
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="w-full text-sm text-left text-gray-500"
                >
                  <thead className="text-xs text-white uppercase bg-gray-700">
                    <tr>
                      <th className="px-6 py-3">ID</th>
                      <th className="px-6 py-3">Title</th>
                      <th className="px-6 py-3">Body</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts?.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <tr
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            className="bg-white border-b hover:bg-gray-50"
                          >
                            <td className="px-6 py-4">{item.id}</td>
                            <td className="px-6 py-4">{item.title}</td>
                            <td className="px-6 py-4">{item.body}</td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => openModal(true, item)}
                                className="text-blue-600 hover:underline mr-4"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeletePost(item.id)}
                                className="text-red-600 hover:underline"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </tbody>
                </table>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}
    </div>
  );
}

export default Main;
