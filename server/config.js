// 支付配置文件
// TODO: 请将你在第三方支付平台（如虎皮椒/PayJS）获取的真实密钥填入此处

module.exports = {
    // 你的 AppID
    APP_ID: process.env.PAY_APP_ID || 'REPLACE_WITH_YOUR_APPID',

    // 你的 AppSecret
    APP_SECRET: process.env.PAY_APP_SECRET || 'REPLACE_WITH_YOUR_SECRET',

    // 支付网关地址 (以虎皮椒为例，不同平台地址不同)
    API_URL: 'https://api.xunhupay.com/payment/do.html',

    // 服务器回调地址 (本地开发时需要内网穿透，或者使用轮询模式)
    NOTIFY_URL: 'http://your-domain.com/api/payment/notify'
};
