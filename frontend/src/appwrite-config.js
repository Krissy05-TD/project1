import { Client, Account } from 'appwrite';

const client = new Client();

if (!(client instanceof Client)) {
  throw new Error('Failed to create Appwrite Client instance');
}

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('6679655800d35b453611');
client.setKey('standard_e6fdacf610d5e7b1d45b6258e33695b4d82fbfaf4c621718a723d22a3dfa6ec0298b0e263b69e99289c966380fde17e58b92ba41b16651b1257836312a2eab236a9d9af22c40f5081cdf62a14ffcb50c2857896b187939aac5c6e03d5b175eccc42b5cf67513778f5b6567c36a961504adb93c551f26ca535cbfbe9d867cd3db');

const account = new Account(client);

export { client, account};