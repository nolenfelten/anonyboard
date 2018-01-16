// threadController - handles all thread related actions

const { Thread } = require('models')
const { getRatingAction } = require('util/threadUtil')

const threadController = {
  async getThreadsByBoard (req, res) {
    try {
      const { boardName, page, limit, skip } = req.config
      // get threads by board, sort, and skip for pagination
      const threads = await Thread
        .find(
          { board: boardName },
          {},
          { sort: { 'createdAt': -1 } }
        )
        .skip(skip)
        .limit(limit)

      res.send({
        page,
        limit,
        threads,
        skip,
        boardName
      })
    } catch (err) {
      console.log(err)
      res.status(500).json({ err })
    }
  },

  async getRecentThreads (req, res) {
    // all boards
    try {
      res.send({
        page: 1,
        board: req.boardName,
        threads: []
      })
    } catch (err) {
      console.log(err)
      res.status(500).send('Oops something went wrong!')
    }
  },

  async createThread (req, res) {
    try {
      const { title, body, password } = req.body
      const thread = await new Thread({
        title,
        body,
        board: req.config.boardName,
        password
      }).save()

      return res.send(thread)
    } catch (err) {
      console.log(err)
      res.status(500).send('Oops something went wrong!')
    }
  },

  async rateThread (req, res) {
    // rate, report, or update
    try {
      const { type, id } = req.body
      const action = getRatingAction(type)

      if (!action) return res.status(400).send({ error: 'Invalid rating type!' })

      const thread = await Thread.findById(id)
      const updated = await thread[action]({ ...req.body, type: action })

      res.json(updated)
    } catch (err) {
      console.log(err)
      res.status(500).send('Oops something went wrong!')
    }
  },

  async deleteThread (req, res) {
    try {
      const { id, password } = req.body
      const thread = await Thread.findById(id)
      const isCorrectPassword = await thread.comparePassword(password)

      if (isCorrectPassword) {
        const deleted = await thread.remove()

        return res.json(deleted)
      } else {
        return res.status(401).json({ error: 'Invalid password!' })
      }
    } catch (err) {
      console.log(err)
      res.status(500).send('Oops something went wrong!')
    }
  }
}

module.exports = threadController
