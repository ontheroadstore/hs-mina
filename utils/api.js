let categoriesJson = '../jsons/categories.json';

const getCategories = () => {
  wx.request({
    url: '../jsons/categories.json',
    method: 'GET',
    success:(data) => {
      console.log(data);
    },
    fail: (data) => {
      console.log(data);
    }
  })
}

module.exports = {
  getCategories: getCategories
}
