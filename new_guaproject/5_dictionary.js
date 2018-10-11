// 项目 5，图形化词典软件
const kuai = require('./kuai')
const log = kuai.log

const request = require('syncrequest')


const openUrl = function(url) {
    // 这是一个工具函数, 用来获取访问 url 后返回的结果
    // 这个函数的返回值是 String 类型
    let r = request.get.sync(url)
    let data = r.body
    return data
}


// 主界面是一个继承自 kuai.Scene 的类
class MainScene extends kuai.Scene {
    constructor(game) {
        super(game)
        this.setup()
    }
    setup() {
        const self = this
        // p1 是输入框的坐标，尺寸是默认的
        let p1 = [200, 100]
        self.input = new kuai.Input(p1)
        self.add(self.input)
        // 下面分别是文本框的内容 坐标 尺寸
        let p2 = [200, 200]
        let size = [400, 300]
        self.textView = new kuai.TextView('未查询', p2, size)
        self.add(self.textView)
        // 下面是按钮的创建
        // 初始化「查询 button」
        let c1 = {
            // text 是按钮的标题
            text: '查询',
            // position 是按钮的 x y 坐标
            position: [405, 100],
            // callback 是按钮被点击的时候会被调用的函数
            callback: function() {
                let t = self.translate()
                self.textView.text = t
            }
        }
        self.button1 = new kuai.Button(c1)
        self.add(self.button1)
    }
    fetchResponse(word) {
        // 返回翻译的结果
        log('fetchResponse test word:', word)
        const self = this
        let key = '71595B2CA80D9B60B12B76023FBA60A5'
        let url = `http://dict-co.iciba.com/api/dictionary.php?type=json&key=${key}&w=${word}`
        let data = openUrl(url)
        return JSON.parse(data)
    }
    translate() {
        const self = this
        let word = self.input.text
        if(word.length > 0) {
            let data = self.fetchResponse(word)
            let symbols_parts = data.symbols[0]
            let parts = symbols_parts.parts
            let result = ''
            for (let i = 0; i < parts.length; i++) {
                let part = parts[i].part
                let means = parts[i].means
                result += part + means[0] + '\n'
            }
            return result
        } else {
            return ''
        }
    }
}

// 创建主界面并且运行
const __main = function() {
    let title = '这是一个有灵性滴窗口标题'
    // size 是窗口的宽高
    let size = [800, 600]
    let win = new kuai.Window(title, size)
    // 创建主界面并且用窗口显示界面
    let scene = new MainScene(win)
    win.runWithScene(scene)
}

__main()
