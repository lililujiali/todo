let data
axios.get('http://8.134.114.156:8887/todos').then(function (res) {
  console.log(res.data)
  data = res.data
  render()
})

const render = function () {
  const divList = document.querySelector('.list')
  divList.innerHTML = ''
  const count = function () {
    let xxx = 0
    for (let index = 0; index < data.length; index++) {
      if (data[index].finish === false) {
        xxx = xxx + 1
      }
    }
    return xxx
  }
  const divCount = document.querySelector('.count')
  divCount.innerHTML = count() + ' 条待完成'
  for (let index = 0; index < data.length; index++) {
    const divItem = document.createElement('div')
    divList.appendChild(divItem)
    divItem.className = 'item'
    const divIcon = document.createElement('div')
    divItem.appendChild(divIcon)
    divIcon.className = 'icon'
    if (data[index].finish === true) {
      divIcon.innerHTML = '✓ '
    }
    divIcon.onclick = function () {
      if (data[index].finish === true) {
        data[index].finish = false
      } else {
        data[index].finish = true
      }
      render()
      axios.patch('http://8.134.114.156:8887/todos/' + data[index].id, data[index])
        .then(function (res) {
          console.log('打印修改成功', res)
        })
    }
    const divText = document.createElement('div')
    divItem.appendChild(divText)
    divText.className = 'text'
    divText.innerHTML = data[index].content
    const divBtn = document.createElement('button')
    divItem.appendChild(divBtn)
    divBtn.className = 'del-btn'
    divBtn.innerHTML = '྾'
    divBtn.onclick = function () {
      const id = data[index].id
      data.splice(index, 1)
      render()
      axios.delete('http://8.134.114.156:8887/todos/' + id).then(function (res) {
        console.log('打印删除成功', res)
      })
    }
  }
}

const divBtnAdd = document.querySelector('.add-btn')
const divInput = document.querySelector('.input')

const add = function () {
  const item = {
    content: divInput.value,
    finish: false
  }
  divInput.value = ''
  data.push(item)
  render()
  axios.post('http://8.134.114.156:8887/todos', item).then(function (res) {
    console.log('打印添加成功', res)
    // 当新增一条数据的时候,服务器会给这条数据创建一个ID,并且返回给我们
    // 然后我们要把这个ID添加到数据里面
    item.id = res.data.id
  })
}

divBtnAdd.onclick = function () {
  add()
}

// 键盘抬起事件
divInput.onkeyup = function (event) {
  // event 叫做事件对象
  if (event.code === 'Enter') {
    add()
  }
}
