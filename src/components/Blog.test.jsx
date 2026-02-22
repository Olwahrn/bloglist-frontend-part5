import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'
import Blog from './Blog'

describe('Blog', () => {
  const blog = {
    id: '12345',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com',
    likes: 7,
    user: {
      id: 'abcde',
      username: 'mluukkai',
      name: 'Matti Luukkainen',
    },
  }

  test('renders title and author by default, but not url or likes', () => {
    render(
      <Blog
        blog={blog}
        currentUser={blog.user}
        handleLike={() => {}}
        handleDelete={() => {}}
      />
    )

    screen.getByText('React patterns Michael Chan')
    expect(screen.queryByText('https://reactpatterns.com')).toBeNull()
    expect(screen.queryByText('likes 7')).toBeNull()
  })

  test('shows url, likes and user when view button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <Blog
        blog={blog}
        currentUser={blog.user}
        handleLike={() => {}}
        handleDelete={() => {}}
      />
    )

    await user.click(screen.getByText('view'))

    screen.getByText('https://reactpatterns.com')
    screen.getByText('likes 7')
    screen.getByText('Matti Luukkainen')
  })

  test('calls like handler twice when like button is clicked twice', async () => {
    const user = userEvent.setup()
    const likeHandler = vi.fn()

    render(
      <Blog
        blog={blog}
        currentUser={blog.user}
        handleLike={likeHandler}
        handleDelete={() => {}}
      />
    )

    await user.click(screen.getByText('view'))
    const likeButton = screen.getByText('like')

    await user.click(likeButton)
    await user.click(likeButton)

    expect(likeHandler).toHaveBeenCalledTimes(2)
  })
})
