import { useState } from 'react'
import { useQuery } from '@apollo/client/react'

import { ALL_BOOKS } from '../queries'

const Books = ({ show }) => {
  const [genre, setGenre] = useState(null)

  const allBooksResult = useQuery(ALL_BOOKS, {
    variables: { genre: null },
  })

  const booksResult = useQuery(ALL_BOOKS, {
    variables: { genre },
    fetchPolicy: 'network-only',
  })

  if (!show) {
    return null
  }

  if (allBooksResult.loading || booksResult.loading) {
    return <div>loading...</div>
  }

  const books = booksResult.data.allBooks

  const genres = [
    ...new Set(
      allBooksResult.data.allBooks.flatMap((book) => book.genres)
    ),
  ]

  const selectGenre = async (selectedGenre) => {
    setGenre(selectedGenre)

    await booksResult.refetch({
      genre: selectedGenre,
    })
  }

  return (
    <div>
      <h2>books</h2>

      {genre && (
        <div>
          in genre <strong>{genre}</strong>
        </div>
      )}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>

          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {genres.map((bookGenre) => (
          <button
            key={bookGenre}
            onClick={() => selectGenre(bookGenre)}
          >
            {bookGenre}
          </button>
        ))}

        <button onClick={() => selectGenre(null)}>
          all genres
        </button>
      </div>
    </div>
  )
}

export default Books