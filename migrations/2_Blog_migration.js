const Blog = artifacts.require('Blog')

module.exports = function (deployer) {
  deployer.deploy(Blog, 'TheBloc')
}
