import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const STORAGE_KEY = 'loggedBlogappUser'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    const loadBlogs = async () => {
      const blogsFromServer = await blogService.getAll()
      setBlogs(blogsFromServer)
    }

    loadBlogs()
  }, [])

  useEffect(() => {
    const savedUserJSON = window.localStorage.getItem(STORAGE_KEY)
    if (savedUserJSON) {
      const savedUser = JSON.parse(savedUserJSON)
      setUser(savedUser)
      blogService.setToken(savedUser.token)
    }
  }, [])

  const displayNotification = (message, duration = 5000) => {
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, duration)
  }

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const userFromLogin = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(userFromLogin)
      )
      blogService.setToken(userFromLogin.token)
      setUser(userFromLogin)
      setUsername('')
      setPassword('')
    } catch {
      displayNotification('wrong username/password')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem(STORAGE_KEY)
    blogService.setToken(null)
    setUser(null)
  }

  const handleCreateBlog = async newBlog => {
    try {
      const createdBlog = await blogService.create(newBlog)
      setBlogs(prevBlogs => prevBlogs.concat(createdBlog))
      displayNotification(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)
      blogFormRef.current.toggleVisibility()
      return createdBlog
    } catch {
      displayNotification('failed to create a new blog')
      return null
    }
  }

  const handleLike = async blog => {
    const blogOwnerId = blog.user && typeof blog.user === 'object'
      ? blog.user.id || blog.user._id
      : blog.user

    const blogToUpdate = {
      user: blogOwnerId,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    }

    try {
      const updatedBlogFromServer = await blogService.update(blog.id, blogToUpdate)
      const updatedBlog = typeof updatedBlogFromServer.user === 'object'
        ? updatedBlogFromServer
        : { ...updatedBlogFromServer, user: blog.user }

      setBlogs(prevBlogs =>
        prevBlogs.map(item =>
          item.id === blog.id ? updatedBlog : item
        )
      )
    } catch {
      displayNotification('failed to like blog')
    }
  }

  const handleDeleteBlog = async blog => {
    const shouldDelete = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    if (!shouldDelete) {
      return
    }

    try {
      await blogService.remove(blog.id)
      setBlogs(prevBlogs => prevBlogs.filter(item => item.id !== blog.id))
      displayNotification(`removed blog ${blog.title}`)
    } catch {
      displayNotification('failed to delete blog')
    }
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {notification}
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      {notification}
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={handleCreateBlog} />
      </Togglable>
      {sortedBlogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          currentUser={user}
          handleLike={handleLike}
          handleDelete={handleDeleteBlog}
        />
      )}
    </div>
  )
}

export default App
