const db = require('../../models')
const User = db.User
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const adminController = {
  signUp: async (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password || !req.body.passwordCheck) {
      return res.json({
        status: 'error',
        message: '所有欄位都要填寫'
      })
    }
    if (req.body.password !== req.body.passwordCheck) {
      return res.json({
        status: 'error',
        message: '兩次密碼輸入不同！'
      })
    }

    const user = await User.findOne({
      where: { email: req.body.email }
    })
    if (user) {
      return res.json({
        status: 'error',
        message: '信箱重複！'
      })
    }

    const salt = bcrypt.genSaltSync(10)
    let newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, salt),
      address: '天龍市忠孝東路走九遍87號',
      role: 'user'
    })

    return res.json({
      status: 'success',
      message: '成功註冊帳號！',
      user: newUser
    })
  },

  signIn: async (req, res) => {
    if (!req.body.email || !req.body.password) {
      return res.json({
        status: 'error',
        message: '所有欄位都要填寫'
      })
    }

    const user = await User.findOne({
      where: {
        email: req.body.email
      }
    })

    if (!user) {
      return res.json({
        status: 'error',
        message: '帳號錯誤'
      })
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.json({
        status: 'error',
        message: '密碼錯誤'
      })
    }

    const payload = user.dataValues
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
    return res.json({
      status: 'success',
      message: 'ok',
      token,
      user
    })
  }
}

module.exports = adminController