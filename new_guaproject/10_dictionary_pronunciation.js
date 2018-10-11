// 项目 10，单词读音
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

class MainScene extends kuai.Scene {
    constructor(game) {
        super(game)
        this.setup()
    }
    setup() {
        const self = this
        //
        let p1 = [200, 100]
        self.input = new kuai.Input(p1)
        self.add(self.input)
        //
        let p2 = [200, 200]
        let size = [400, 300]
        self.tv = new kuai.TextView('未查询', p2, size)
        self.add(self.tv)
        // 初始化「查询 button」
        let c1 = {
            text: '查询',
            position: [405, 100],
            callback: function() {
                let t = self.translate()
                self.tv.text = t
            }
        }
        self.button1 = new kuai.Button(c1)
        self.add(self.button1)
        // 点击查看读音
        let c2 = {
            text: '读音',
            position: [510, 100],
            callback: self.play,
        }
        self.button2 = new kuai.Button(c2)
        self.add(self.button2)
    }
    play() {
        this.loadPronunciation()
        if (this.audio !== undefined) {
            this.audio.play()
        }
    }
    loadPronunciation() {
        // todo 这里并没有判断是否 exist，直接下载/覆盖
        const self = this
        if (self.input.text.length !== 0) {
            let data = self.fetchResponse()
            let symbols_parts = data.symbols[0]
            let path = 'resource/audio/' + self.input.text + '.mp3'
            // 通过 url 下载音频
            // todo: 这个下载方案可以让他们当作套路使用
            let result = request.sync(symbols_parts.ph_en_mp3, {
                pipe: path,
            })
            self.audio = kuai.Audio.load(path)
        }
    }
    fetchResponse() {
        // 返回翻译的结果
        const self = this
        let word = self.input.text
        // todo: 这里的 key 是我自己的, 应该让他们使用自己的 key
        // let key = '这里填写邮箱中收到的 key'
        let key = '664A82AD371DBB548A719D96A6D5A27C'
        let url = `http://dict-co.iciba.com/api/dictionary.php?type=json&key=${key}&w=${word}`
        let data = openUrl(url)
        return JSON.parse(data)
    }
    translate() {
        const self = this
        let data = self.fetchResponse()
        let symbols_parts = data.symbols[0]
        let parts = symbols_parts.parts
        let result = ''
        for (let i = 0; i < parts.length; i++) {
            let part = parts[i].part
            let means = parts[i].means
            result += part + means[0] + '\n'
        }
        return result
    }
}

// 创建主界面并且运行
const __main = function() {
    let title = '这是窗口标题'
    // size 是窗口的宽高
    let size = [800, 600]
    let win = new kuai.Window(title, size)
    // 创建主界面并且用窗口显示界面
    let scene = new MainScene(win)
    win.runWithScene(scene)
}

__main()
