const NotificationProvider = require("./notification-provider");
const { DOWN, UP } = require("../../src/util");
const { default: axios } = require("axios");
const Crypto = require("crypto");

class DingDing extends NotificationProvider {
    name = "DingDing";

    async send(notification, msg, monitorJSON = null, heartbeatJSON = null) {

        try {
            if (heartbeatJSON != null) {
                let params = {
                    msgtype: "markdown",
                    markdown: {
                        title: monitorJSON["name"],
                        text: `## [${this.statusToString(heartbeatJSON["status"])}] \n > ${heartbeatJSON["msg"]}  \n > Time(UTC):${heartbeatJSON["time"]}`,
                    }
                };
                if (await this.sendToDingDing(notification, params)) {
                    return this.sendSuccess;
                }
            } else {
                let params = {
                    msgtype: "text",
                    text: {
                        content: msg
                    }
                };
                if (await this.sendToDingDing(notification, params)) {
                    return this.sendSuccess;
                }
            }
        } catch (error) {
            this.throwGeneralAxiosError(error);
        }
    }

    async sendToDingDing(notification, params) {
        let timestamp = Date.now();

        let config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            url: `${notification.webHookUrl}&timestamp=${timestamp}&sign=${encodeURIComponent(this.sign(timestamp, notification.secretKey))}`,
            data: JSON.stringify(params),
        };

        let result = await axios(config);
        if (result.data.errmsg == "ok") {
            return true;
        }
        return false;
    }

    /** DingDing sign */
    sign(timestamp, secretKey) {
        return Crypto
            .createHmac("sha256", Buffer.from(secretKey, "utf8"))
            .update(Buffer.from(`${timestamp}\n${secretKey}`, "utf8"))
            .digest("base64");
    }

    statusToString(status) {
        switch (status) {
            case DOWN:
                return "DOWN";
            case UP:
                return "UP";
            default:
                return status;
        }
    }
}

module.exports = DingDing;
