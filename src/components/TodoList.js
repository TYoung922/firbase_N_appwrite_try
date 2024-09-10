"use client";
import {
  Badge,
  Box,
  Heading,
  SimpleGrid,
  Text,
  useToast,
  Button,
  Input,
  Textarea,
} from "@chakra-ui/react";
import useAuth from "@/hooks/useAuth";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import { FaToggleOff, FaToggleOn, FaTrash } from "react-icons/fa";
import { deleteTodo, toggleTodoStatus } from "@/api/todo";
import { useEffect, useState } from "react";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [editTodo, setEditTodo] = useState(null);
  const [oldTitle, setOldTitle] = useState("");
  const { user } = useAuth();
  const toast = useToast();

  const refreshData = () => {
    if (!user) {
      setTodos([]);
      return;
    }
    const q = query(collection(db, "todo"), where("user", "==", user.uid));
    onSnapshot(q, (querySnapshot) => {
      const ar = [];
      querySnapshot.forEach((doc) => {
        ar.push({ id: doc.id, ...doc.data() });
      });
      setTodos(ar);
    });
  };
  useEffect(() => {
    refreshData();
  }, [user]);

  const handleTodoDelete = async (id) => {
    const todo = todos.find((todo) => todo.id === id);
    if (confirm(`Are you sure you want to delete todo "${todo.title}"?`)) {
      deleteTodo(id);
      toast({
        title: `Todo "${todo.title}" has been deleted`,
        status: "error",
      });
    }
  };

  const handleToggle = async (id, status) => {
    const newStatus = status === "completed" ? "pending" : "completed";

    const todo = todos.find((todo) => todo.id === id);
    await toggleTodoStatus({ docId: id, status: newStatus });
    toast({
      title: `Todo "${todo.title}" marked ${newStatus}`,
      status: newStatus === "completed" ? "success" : "warning",
    });
  };

  const handleEditTodo = (todo) => {
    setEditTodo({ ...todo }); // make a copy of the todo object
    setOldTitle(todo.title);
  };

  const handleUpdate = async () => {
    if (!editTodo) return;

    await updateDoc(doc(db, "todo", editTodo.id), {
      title: editTodo.title,
      description: editTodo.description,
    });

    if (oldTitle !== editTodo.title) {
      toast({
        title: `Todo "${oldTitle}" updated successfully to "${editTodo.title}"`,
        status: "info",
      });
    } else {
      toast({
        title: `Todo "${editTodo.title}" updated successfully`,
        status: "info",
      });
    }
    setEditTodo(null);
    refreshData();
  };

  return (
    <Box mt={5}>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
        {todos.map((todo) => (
          <Box
            key={todo.id}
            p={3}
            boxShadow="2xl"
            shadow={"dark-lg"}
            transition="0.2s"
            _hover={{ boxShadow: "sm" }}
          >
            <Heading as="h3" fontSize={"x-large"}>
              <Badge
                color="red.500"
                bg="inherit"
                transition={"0.2s"}
                _hover={{ bg: "inherit", transform: "scale(1.2" }}
                float="right"
                size="xs"
                onClick={() => handleTodoDelete(todo.id)}
              >
                <FaTrash />
              </Badge>
              <Badge
                color={todo.status === "pending" ? "gray.500" : "green.500"}
                bg="inherit"
                transition={"0.2s"}
                _hover={{ bg: "inherit", transform: "scale(1.2)" }}
                float="right"
                size="xs"
                onClick={() => handleToggle(todo.id, todo.status)}
              >
                {todo.status === "pending" ? <FaToggleOff /> : <FaToggleOn />}
              </Badge>
              <Badge
                float="right"
                opacity="0.8"
                bg={todo.status === "pending" ? "yellow.500" : "green.500"}
              >
                {todo.status}
              </Badge>
              {editTodo && editTodo.id === todo.id ? (
                <Box>
                  <Text>Title</Text>
                  <Input
                    type="text"
                    value={editTodo.title}
                    onChange={(e) =>
                      setEditTodo({ ...editTodo, title: e.target.value })
                    }
                  />
                </Box>
              ) : (
                <Text>{todo.title}</Text>
              )}
            </Heading>

            {editTodo && editTodo.id === todo.id ? (
              <Box>
                <Text>Description</Text>
                <Textarea
                  type="text"
                  value={editTodo.description}
                  onChange={(e) =>
                    setEditTodo({ ...editTodo, description: e.target.value })
                  }
                />
              </Box>
            ) : (
              <Text>{todo.description}</Text>
            )}
            {editTodo && editTodo.id === todo.id ? (
              <Button onClick={handleUpdate} colorScheme="blue">
                Save
              </Button>
            ) : (
              <Button
                onClick={() => handleEditTodo(todo)}
                variant="solid"
                colorScheme="blue"
              >
                Edit
              </Button>
            )}
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default TodoList;
