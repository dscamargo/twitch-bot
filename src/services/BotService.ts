import tmi, { Options, Client } from 'tmi.js';
import MediviaAPI from 'medivia-api';

import api from '../config/api';

interface IGuildInfo {
  name: string;
  rank: string;
}

interface ICharacterInfo {
  characters: {
    error?: string;
    data: {
      name: string;
      level: number;
      world: string;
      vocation: string;
      status: string;
      guild?: IGuildInfo | undefined;
    };
  };
}

class ConnectService {
  protected client: Client;

  protected channel: string;

  protected username: string | undefined;

  protected async medivia(message: string): Promise<void> {
    const mediviaAPI = new MediviaAPI({ worldName: 'Destiny' });
    const characterMediviaFormatted = message.toLowerCase();
    const [, characterMedivia] = characterMediviaFormatted.split('!medivia ');
    const charInfo = await mediviaAPI.getCharacterInformation({
      characterName: characterMedivia,
    });

    const msg = `${charInfo.name} - Level ${charInfo.level} - ${charInfo.profession} - Status: ${charInfo.status} @${this.username}`;

    this.client.say(this.channel, msg);
  }

  protected async tibia(message: string): Promise<void> {
    const characterFormatted = message.toLowerCase();
    const [, character] = characterFormatted.split('!char ');

    if (!character) {
      this.notFoundMessage();
      return;
    }

    const response = await api.get<ICharacterInfo>(
      `/characters/${encodeURIComponent(character)}.json`,
    );

    if (response?.data?.characters?.error) {
      this.notFoundMessage();
      return;
    }

    const {
      name,
      level,
      world,
      status,
      guild,
      vocation,
    } = response.data.characters.data;

    this.client.say(
      this.channel,
      `${name}, level ${level} - ${vocation} - Mundo: ${world} - Status: ${status} ${
        guild?.name ? `, ${guild.rank} de ${guild.name}` : ''
      } @${this.username}`,
    );
  }

  public sendMessage(): void {
    this.connect();

    this.client.on('chat', async (channel, userstate, message, self) => {
      this.channel = channel;
      this.username = userstate.username;

      if (self) return;

      if (message.toLowerCase().includes('!medivia')) {
        this.medivia(message);
      }

      if (message.toLowerCase().includes('!char')) {
        this.tibia(message);
      }
    });
  }

  protected notFoundMessage(): void {
    this.client.say(this.channel, `@${this.username} Char não encontrado`);
  }

  protected async connect(): Promise<void> {
    const channels = process.env.CHANNELS?.split(';');
    const username = process.env.BOT_USERNAME;

    const options = {
      options: {
        debug: true,
      },
      connection: {
        reconnect: true,
        secure: true,
      },
      identity: {
        username,
        password: process.env.TWITCH_PASS_GENERATOR,
      },
      channels,
    } as Options;

    this.client = tmi.client(options);

    this.client.connect();

    this.client.on('connected', () => console.log('Connected'));
  }
}

export default new ConnectService();
