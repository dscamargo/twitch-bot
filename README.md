# Tibia and Medivia Twitch Bot

## Under Development.

| Env                   | Description                              | Example                                                                 |
|-----------------------|------------------------------------------|-------------------------------------------------------------------------|
| TWITCH_PASS_GENERATOR | OAuth Twitch Token                       | <a href='https://twitchapps.com/tmi/' target='_blank'>Generate here</a> |
| TIBIA_DATA_API        | Tibia Data API Url                       | https://api.tibiadata.com/v2                                            |
| BOT_USERNAME          | Bot username in Twitch                   | bot-username                                                            |
| CHANNELS              | List of channels separated by semicolons | channel1;channel2;channel3;...                                          |

## Installation

Clone the project with

```sh
git clone https://github.com/dscamargo/twitch-bot.git
```

Get in the path project, then install the dependencies with:

```sh
yarn
```

After install dependencies, you can start the development server with:

```sh
yarn dev:server
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
