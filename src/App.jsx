import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const STORAGE_KEY = 'loggedBlogappUser'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogsFromServer = await blogService.getAll()
      setBlogs(blogsFromServer)
    }

    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(STORAGE_KEY)
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
    }
  }, [])

  const showNotification = (message, duration = 5000) => {
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, duration)
  }

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const loggedUser = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(loggedUser)
      )
      blogService.setToken(loggedUser.token)
      setUser(loggedUser)
      setUsername('')
      setPassword('')
    } catch {
      showNotification('wrong username/password')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem(STORAGE_KEY)
    blogService.setToken(null)
    setUser(null)
  }

  const handleCreateBlog = async event => {
    event.preventDefault()

    try {
      const createdBlog = await blogService.create({ title, author, url })
      setBlogs(prevBlogs => prevBlogs.concat(createdBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      showNotification(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)
    } catch {
      showNotification('failed to create a new blog')
    }
  }

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
      <h3>create new</h3>
      <form onSubmit={handleCreateBlog}>
        <div>
          title:
          <input
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
