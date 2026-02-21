import { useState } from 'react'

const Blog = ({ blog, currentUser, handleLike, handleDelete }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const ownerUsername = blog.user && typeof blog.user === 'object'
    ? blog.user.username
    : null

  const canDelete = Boolean(currentUser && ownerUsername === currentUser.username)

  if (!detailsVisible) {
    return (
      <div style={blogStyle}>
        {blog.title} {blog.author}
        <button onClick={() => setDetailsVisible(true)}>view</button>
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setDetailsVisible(false)}>hide</button>
      </div>
      <div>{blog.url}</div>
      <div>
        likes {blog.likes}
        <button onClick={() => handleLike(blog)}>like</button>
      </div>
      <div>{blog.user ? blog.user.name : ''}</div>
      {canDelete && (
        <button onClick={() => handleDelete(blog)}>delete</button>
      )}
    </div>
  )
}

export default Blog
