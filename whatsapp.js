'use strict';
const EventEmitter = require('events');
const puppeteer = require('puppeteer');
const { ConfigSystem, Session } = require('./config/config');
const path = require("path");


class WhatsApp extends EventEmitter {

    constructor() {
        super();
        this.Browser = null;
        this.Page = null;
    }

    async initialize() {
        this.Browser = await puppeteer.launch(ConfigSystem.puppeteer);
        this.Page = await this.Browser.newPage();
        this.Page.setUserAgent(ConfigSystem.UserAgent);

        const session = await Session.getSession();

        if (session) {
            await this.Page.evaluateOnNewDocument(
                session => {
                    localStorage.clear();
                    localStorage.setItem("WABrowserId", session.WABrowserId);
                    localStorage.setItem("WASecretBundle", session.WASecretBundle);
                    localStorage.setItem("WAToken1", session.WAToken1);
                    localStorage.setItem("WAToken2", session.WAToken2);
                }, session);
        }

        await this.Page.goto(ConfigSystem.whatsappUrl);
             
        await this.Page.exposeFunction('generatedQRcode', (code) => {
            this.emit('onGenerateQrcode', code);
        });

        await this.Page.exposeFunction('connected', async () => {
            const localStorage = JSON.parse(await this.Page.evaluate(() => {
                return JSON.stringify(window.localStorage);
            }));

            const session = {
                WABrowserId: localStorage.WABrowserId,
                WASecretBundle: localStorage.WASecretBundle,
                WAToken1: localStorage.WAToken1,
                WAToken2: localStorage.WAToken2
            }
            await Session.setSession(session);
            this.emit('onConnect');
        });

        await this.Page.exposeFunction('disconnected', () => {
            this.emit('onDisconnect');
        });

        await this.Page.exposeFunction('receiveMessage', (messages) => {
            this.emit('onReceiveMessage', messages);
        });

        await this.Page.exposeFunction('sentMessage', (messages) => {
            this.emit('onSentMessage', messages);
        });

        await this.Page.exposeFunction('openPageConflict', (message) => {
            this.emit('onOpenPageConflict', message);
        });

        var pathScript = path.join(__dirname, "script/script.js");
        await this.Page.addScriptTag({ path: require.resolve(pathScript) });      
        
    }

    async disconnect() {
        await this.Page.click("div[title='Menu']");
        await this.Page.click("div[title='Sair']");
    }

    async isConnect() {
        const retorno =  await this.Page.evaluate(()=>{
            return window.Store.Contact && window.Store.Contact.checksum !== undefined;
        });
        return retorno;
    }

}

module.exports = WhatsApp;