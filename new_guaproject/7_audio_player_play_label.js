// 项目 7，播放器初步
const kuai = require('./kuai')
const log = kuai.log


class MainScene extends kuai.Scene {
    constructor(game) {
        super(game)
        this.game = game
        this.setup()
    }
    setup() {
        const self = this
        let audioPath = 'resource/audio/canon.mp3'
        self.audio = kuai.Audio.load(audioPath)
        self.currentTime = 0
        let c1 = {
            position: [100, 200],
            text: '开始',
            callback: function() {
                log('开始')
                self.audio.play()
            },
        }
        self.startButton = new kuai.Button(c1)
        self.add(self.startButton)

        let c2 = {
            position: [230, 200],
            text: '暂停',
            callback: function() {
                log('暂停', self.audio.duration)
                self.audio.pause()
                self.currentTime = self.audio.currentTime
            },
        }
        self.pauseButton = new kuai.Button(c2)
        self.add(self.pauseButton)
        // 添加 label
        let currentseconds = parseInt(self.audio.currentTime)
        let sumseconds = parseInt(self.audio.duration)
        let text = `${currentseconds}: ${sumseconds}`
        self.label = new kuai.Label(text, [100, 100])
        self.add(self.label)
        // 引入 clock 刷新 current time
        // todo: 确定添加定时器的方案
        let clock = new kuai.Clock(function() {
            log('***', self.audio.currentTime)
            let currentseconds = parseInt(self.audio.currentTime)
            self.label.text = `${currentseconds}: ${sumseconds}`
        }, 1000)
        self.add(clock)
        clock.run()
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
