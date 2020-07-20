// Testing Controllers
import {
  buildUser,
  buildBook,
  buildListItem,
  buildReq,
  buildRes,
  buildNext,
} from 'utils/generate'

// 🐨 getListItem calls `expandBookData` which calls `booksDB.readById`
// so you'll need to import the booksDB from '../../db/books'
import * as booksDB from '../../db/books'
import * as listItemsDB from '../../db/list-items'

// 🐨 don't forget to import the listItemsController from '../list-items-controller'
// here, that's the thing we're testing afterall :)
import * as listItemsController from '../list-items-controller'

// 🐨 use jest.mock to mock '../../db/books' because we don't actually want to make
// database calls in this test file.
jest.mock('../../db/books')
jest.mock('../../db/list-items')

// 🐨 ensure that all mock functions have their call history cleared using
// jest.clearAllMocks here as in the example.
beforeEach(() => {
  jest.clearAllMocks()
})

test('getListItem returns the req.listItem', async () => {
  const user = buildUser()
  const book = buildBook()
  const listItem = buildListItem({ownerId: user.id, bookId: book.id})

  booksDB.readById.mockResolvedValueOnce(book)

  // 🐨 make a request object that has properties for the user and listItem
  // 💰 checkout the implementation of getListItem in ../list-items-controller
  // to see how the request object is used and what properties it needs.
  // 💰 and you can use buildReq from utils/generate
  const req = buildReq({user, listItem})
  const res = buildRes()

  // 🐨 make a call to getListItem with the req and res (`await` the result)
  await listItemsController.getListItem(req, res)

  // 🐨 assert that booksDB.readById was called correctly
  expect(booksDB.readById).toHaveBeenCalledWith(listItem.bookId)
  expect(booksDB.readById).toHaveBeenCalledTimes(1)
  //🐨 assert that res.json was called correctly
  expect(res.json).toHaveBeenCalledWith({
    listItem: {...listItem, book},
  })
  expect(res.json).toHaveBeenCalledTimes(1)
})

test('createListItem should return a 400 when no bookId is provided', async () => {
  const user = buildUser()
  const book = buildBook()
  const listItem = buildListItem({ownerId: user.id, bookId: book.id})

  const req = buildReq({user, listItem})
  const res = buildRes()

  await listItemsController.createListItem(req, res).catch((err) => err)

  expect(res.json.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "message": "No bookId provided",
      },
    ]
  `)
  expect(res.json).toHaveBeenCalledTimes(1)

  expect(res.status).toHaveBeenCalledWith(400)
  expect(res.status).toHaveBeenCalledTimes(1)
})

test('setListItem should pass the listItem to req', async () => {
  const user = buildUser()
  const res = buildRes()
  const next = buildNext()
  const listItem = buildListItem({ownerId: user.id})
  const req = buildReq({params: {id: listItem.id}, user})

  listItemsDB.readById.mockResolvedValueOnce(listItem)

  await listItemsController.setListItem(req, res, next)

  expect(next).toHaveBeenCalledTimes(1)
  expect(next).toHaveBeenCalledWith(/* Nothing */)

  expect(req.listItem).toBe(listItem)
})

test('setListItem should 404 when no list is found by listId', async () => {
  const req = buildReq()
  const res = buildRes()

  await listItemsController.setListItem(req, res)

  expect(res.json).toHaveBeenCalledTimes(1)
  expect(res.json.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "message": "No list item was found with the id of undefined",
      },
    ]
  `)
  expect(res.status).toHaveBeenCalledWith(404)
})

test('setListItem should return 403 if the user is not authorized to access the listItem', async () => {
  const user = buildUser()
  const res = buildRes()
  const next = buildNext()
  const listItem = buildListItem({ownerId: '1234567890'})
  const req = buildReq({params: {id: listItem.id}, user})

  listItemsDB.readById.mockResolvedValueOnce(listItem)

  await listItemsController.setListItem(req, res, next)

  expect(res.json).toHaveBeenCalledTimes(1)
  expect(res.json.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "message": "User with id ${user.id} is not authorized to access the list item ${listItem.id}",
      },
    ]
  `)
  expect(res.status).toHaveBeenCalledWith(403)
})
