let fs = require("fs");
var path = require("path");

const ConfigSystem = {
    whatsappUrl: 'https://web.whatsapp.com',
    UserAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36',
    puppeteer: {
        headless: false,
        ignoreDefaultArgs:[
            '--log-level=3',
            '--no-default-browser-check',
            '--disable-site-isolation-trials',
            '--no-experiments',
            '--ignore-gpu-blacklist',
            '--ignore-certificate-errors',
            '--ignore-certificate-errors-spki-list',
            '--disable-gpu',
            '--disable-extensions',
            '--disable-default-apps',
            '--enable-features=NetworkService',
            '--disable-setuid-sandbox',
            '--no-sandbox',
            '--disable-webgl',
            '--disable-threaded-animation',
            '--disable-threaded-scrolling',
            '--disable-in-process-stack-traces',
            '--disable-histogram-customizer',
            '--disable-gl-extensions',
            '--disable-composited-antialiasing',
            '--disable-canvas-aa',
            '--disable-3d-apis',
            '--disable-accelerated-2d-canvas',
            '--disable-accelerated-jpeg-decoding',
            '--disable-accelerated-mjpeg-decode',
            '--disable-app-list-dismiss-on-blur',
            '--disable-accelerated-video-decode'
        ]
    }
}


const Session = {
    
    getSession: () => {
        let data = fs.readFileSync(path.join(__dirname, "../script/session.json"), "ascii");
        data = JSON.parse(data)
        return (data.WABrowserId && data.WASecretBundle && data.WAToken1 && data.WAToken2)?data:null;
    },
    setSession: async (session) => {
        fs.writeFileSync(path.join(__dirname, "../script/session.json"), JSON.stringify(session, null, "\t"));
    }
}

module.exports = { ConfigSystem, Session }