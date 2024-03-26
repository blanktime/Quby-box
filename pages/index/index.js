Page({
  onShareAppMessage(res){
    var that = this
    console.log(that.goods_data)
    return {
      title:that.goods_data.share_title||that.goods_data.goods_name,
      // path: '',
      imageUrl:that.goods_data.share_img||that.goods_data.main_img,
      success: function (res) {         
        if(res.errMsg == 'shareAppMessage:ok'){
        console.log("Success!",res)
        }
      },
      fail:function(res){        
        console.log("Failed!",res)     
      }
    }
  },

  onShareTimeline:function(){
    return {
      title:'',
      query:{
        key:value
      },
      imageUrl:''
    }
  },

  data: {
    textList: [],             // 存放文本的数组
    showSaveDialog: false,    // 控制是否显示保存文本对话框
    showRandomDialog: false,  // 控制是否显示随机提取文本对话框
    showTextListDialog: false, 
    showConfirmDialog: false,
    userInputText: '',        // 用户输入的文本
    randomText: ''            // 随机提取的文本
  },

  // 点击保存文本按钮，显示保存文本对话框
  showInputDialog: function () {
    this.setData({
      showSaveDialog: true
    });
  },

  // 用户输入文本
  onInput: function (e) {
    this.setData({
      userInputText: e.detail.value
    });
  },

  // 确认保存文本
  confirmSave: function () {
    // 获取当前时间戳，用于作为文本的唯一标识
    const timestamp = new Date().getTime();

    // 获取用户输入的文本
    const userInputText = this.data.userInputText;

    // 检查是否输入为空
    if (!userInputText) {
      wx.showToast({
        title: '请输入愿望',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // 创建一个包含文本和时间戳的对象
    const newTextObject = {
      text: userInputText,
      timestamp: timestamp
    };

    // 将文本对象添加到文本数组中
    this.data.textList.push(newTextObject);

    // 更新数据
    this.setData({
      textList: this.data.textList,
      showSaveDialog: false,  // 关闭保存文本对话框
      userInputText: ''       // 清空输入框
    });

    // 将文本数组保存到本地存储
    wx.setStorageSync('textList', this.data.textList);
  },

  // 在页面加载时获取本地缓存中的数据
  onLoad: function() {
    let textList = wx.getStorageSync('textList') || [];
    this.setData({
      textList: textList,
    });
  },
  
  // 取消保存文本
  cancelSave: function () {
    // 关闭保存文本对话框，不保存文本
    this.setData({
      showSaveDialog: false,
      userInputText: '' // 清空输入框
    });
  },

  // 点击随机提取文本按钮，显示随机提取文本对话框
  showRandomInputDialog: function () {
    if (this.data.textList.length === 0) {
      wx.showToast({
        title: '暂无愿望可取',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // 从文本数组中随机提取一条文本
    const randomIndex = Math.floor(Math.random() * this.data.textList.length);
    const randomText = this.data.textList[randomIndex].text;

    // 显示随机提取文本对话框
    this.setData({
      showRandomDialog: true,
      randomText: randomText
    });
  },

  // 撤销随机提取
  undoRandom: function () {
    // 关闭随机提取文本对话框，不做任何操作
    this.setData({
      showRandomDialog: false
    });
  },

  // 确认随机提取
  confirmRandom: function () {
    // 从文本数组中删除随机提取的文本
    const indexToRemove = this.data.textList.findIndex(item => item.text === this.data.randomText);
    if (indexToRemove !== -1) {
      this.data.textList.splice(indexToRemove, 1);
    }

    // 更新数据
    this.setData({
      textList: this.data.textList,
      showRandomDialog: false // 关闭随机提取文本对话框
    });

    // 将文本数组保存到本地存储
    wx.setStorageSync('textList', this.data.textList);
  },

  // 随机提取另一个文本
  getAnotherRandom: function () {
    // 重新随机提取一个文本
    const randomIndex = Math.floor(Math.random() * this.data.textList.length);
    const randomText = this.data.textList[randomIndex].text;

    // 更新数据
    this.setData({
      randomText: randomText
    });
  },

  showTextList() {
    this.setData({
      showTextListDialog: true,
    });
  },

  closeTextListDialog() {
    this.setData({
      showTextListDialog: false,
    });
  },

  clearTextList() {
    this.setData({
      showConfirmDialog: true,
    });
  },

  confirmClear() {
    // 用户确认清空操作
    this.setData({
      textList: [], // 清空文本数组
      showConfirmDialog: false, // 关闭确认清空弹窗
    });
    // 在这里可以添加其他清空逻辑，比如关闭弹出框等
  },

  cancelClear() {
    // 用户取消清空操作
    this.setData({
      showConfirmDialog: false, // 关闭确认清空弹窗
    });
  },
});
