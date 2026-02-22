import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import BlogForm from './BlogForm'

test('calls createBlog with right details when a new blog is created', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn().mockResolvedValue({
    id: 'new-blog-id',
  })

  const { container } = render(<BlogForm createBlog={createBlog} />)

  const titleInput = container.querySelector('input[name="Title"]')
  const authorInput = container.querySelector('input[name="Author"]')
  const urlInput = container.querySelector('input[name="Url"]')
  const createButton = container.querySelector('button[type="submit"]')

  await user.type(titleInput, 'The Joel Test')
  await user.type(authorInput, 'Joel Spolsky')
  await user.type(urlInput, 'https://www.joelonsoftware.com')
  await user.click(createButton)

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog).toHaveBeenCalledWith({
    title: 'The Joel Test',
    author: 'Joel Spolsky',
    url: 'https://www.joelonsoftware.com',
  })
})
