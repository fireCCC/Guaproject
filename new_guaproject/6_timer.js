// 项目 6，计时器
const kuai = require('./kuai')
const log = kuai.log


class MainScene extends kuai.Scene {
    constructor(game) {
        super(game)
        this.setup()
    }
    setup() {
        const self = this
        // 当前时间
        self.currentTime = Date.now()
        // 是否点击开始
        self.started = false
        // 已运行时间
        self.time = 0
        self.defaultTimeText = '00: 00: 00'
        //
        self.addTimeLabel()
        self.addButtonStart()
        self.addButtonPause()
        self.addButtonReset()
        let clock = new kuai.Clock(self.timer, 1)
        self.add(clock)
        clock.run()
    }

    addTimeLabel() {
        const self = this
        let p1 = [150, 100]
        let fontSize = 60
        self.label = new kuai.Label(self.defaultTimeText, p1, fontSize)
        self.add(self.label)
    }
    addButtonStart() {
        const self = this
        let c1 = {
            text: '开始',
            position: [100, 200],
            callback: function() {
                log('开始计时, 修改 label')

                self.started = true
            },
        }
        self.startButton = new kuai.Button(c1)
        self.add(self.startButton)
    }
    addButtonPause() {
        const self = this
        let c2 = {
            text: '暂停',
            position: [230, 200],
            callback: function() {
                log('暂停')
                self.started = false
            },
        }
        self.pauseButton = new kuai.Button(c2)
        self.add(self.pauseButton)
    }
    addButtonReset() {
        const self = this
        let c3 = {
            text: '重置',
            position: [360, 200],
            callback: function() {
                log('重置')
                self.started = false
                //更新
                self.time = 0
                self.label.text = '00: 00: 00'

            },
        }
        self.resetButton = new kuai.Button(c3)
        self.add(self.resetButton)
    }

    addClock() {
        const self = this
        let clock = new kuai.Clock(self.timer, 1)
        self.add(clock)
        clock.run()
    }
    timer() {
        const self = this
        if (self.started) {
            if (Date.now() - self.currentTime > 10) {
                self.time += 0.01
                self.currentTime = Date.now()
            }
            let text = self.formattedTime()
            self.label.text = text
        }
    }
    formattedTime() {
        // 格式化时间
        const self = this
        // minute
        let m = String(Math.floor(self.time / 60))
        let minute = m.padStart(2, '0')
        let t = String(self.time % 60).slice(0, 5)
        // second
        let s = t.split('.')[0]
        let second = s.padStart(2, '0')
        // millisecond
        let ms = t.split('.')[1]
        let millisecond = ms.padStart(2, '0')

        let result = `${minute}: ${second}: ${millisecond}`
        // let result = `${minute}: ${second}`

        // log('result', result)
        return result
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
