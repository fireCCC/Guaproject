// 项目 8，暂停 进度条
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
        //
        let audioPath = 'resource/audio/Pharrell Williams - Happy.mp3'
        self.audio = kuai.Audio.load(audioPath)
        self.currentTime = 0
        let c1 = {
            position: [100, 200],
            // text: '开始',
            backgroundNormal: 'resource/image/音乐播放.png',
            backgroundDown: 'resource/image/音乐播放.jpg',
            callback: function() {
                log('开始')
                self.audio.play(self.currentTime)
            },
        }
        self.startButton = new kuai.Button(c1)
        self.add(self.startButton)

        let c2 = {
            position: [230, 200],
            // text: '暂停',
            backgroundNormal: 'resource/image/音乐暂停.png',
            backgroundDown: 'resource/image/音乐暂停.jpg',
            callback: function() {
                log('暂停', self.audio.duration)
                self.audio.pause()
                self.currentTime = self.audio.currentTime
            },
        }
        self.pauseButton = new kuai.Button(c2)
        self.add(self.pauseButton)
        //已播放时间与总时间
        let currentseconds = parseInt(self.audio.currentTime)
        let sumseconds = parseInt(self.audio.duration)
        let current_text = `${currentseconds}`
        let sum_text = ` ${sumseconds}`
        self.currentTime_label = new kuai.Label(current_text, [60, 95])
        self.sumTime_label = new kuai.Label(sum_text, [340, 95])
        self.add(self.currentTime_label)
        self.add(self.sumTime_label)

        // 引入进度条, 进度条的长度是定值
        self.slider = new kuai.Slider([100, 100])
        self.add(self.slider)
        // todo: 确定添加定时器的方案
        let clock = new kuai.Clock(function() {
            // 这里实现从音频到进度条的绑定
            let percent = self.audio.currentTime / self.audio.duration
            self.slider.percent = percent
            //更改已播放时间
            let currentseconds = parseInt(self.audio.currentTime)
            self.currentTime_label.text = `${currentseconds}`
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
