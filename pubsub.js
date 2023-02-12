const PubNub = require("pubnub");

const credentials = {
  publishKey: "pub-c-469b871f-904c-4efd-b868-7b64e9c477f0",
  subscribeKey: "sub-c-339bea5f-81f2-4a0a-827e-2c617bbd8530",
  sectetKey: "sec-c-M2ZkNjBiZGMtYTJkNy00MGI2LWJmYTItNDI0MTA1MmQwMTEy",
  uuid: "unique-client-identifier",
};

const CHANNELS = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN",
};
class PubSub {
  constructor({ blockchain }) {
    this.blockchain = blockchain;
    this.pubnub = new PubNub(credentials);

    this.pubnub.subscribe({ channels: Object.values(CHANNELS) });
    this.pubnub.addListener(this.listener());
  }

  // listner function
  listener() {
    return {
      message: (messageObject) => {
        const { channel, message } = messageObject;
        console.log(
          `Message received. Channel: ${channel}. Message: ${message}.`
        );

        const parsedMessage = JSON.parse(message);

        if (channel === CHANNELS.BLOCKCHAIN) {
          this.blockchain.replaceChain(parsedMessage);
        }
      },
    };
  }

  // publish function
  publish({ channel, message }) {
    this.pubnub.unsubscribe(channel, () => {
      this.pubnub.publish(channel, message, () => {
        this.pubnub.subscribe(channel);
      });
    });
  }

  // broadcust chain function
  broadcustChain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain),
    });
  }
}

module.exports = PubSub;