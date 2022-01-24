const middleware = {}

middleware['administrator'] = require('../middleware/administrator.js')
middleware['administrator'] = middleware['administrator'].default || middleware['administrator']

middleware['loginUser'] = require('../middleware/loginUser.js')
middleware['loginUser'] = middleware['loginUser'].default || middleware['loginUser']

middleware['representative'] = require('../middleware/representative.js')
middleware['representative'] = middleware['representative'].default || middleware['representative']

export default middleware
