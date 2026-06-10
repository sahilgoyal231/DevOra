const { Client, Users } = require("node-appwrite");
const client = new Client()
    .setEndpoint("https://sgp.cloud.appwrite.io/v1")
    .setProject("69f423940015d35d07aa")
    .setKey("standard_180f9b897c88c981401f7bd282bcc8757f75817a89fb6dbd32d3703938c83594ba2913f0acc56b6e851f3901d34b81f536455623c5b41b4ac17c355950ee9a5bd73d86e7b648730486b06f4775dfc8966999582e5eb7ee12fcd69550ebe9e12417f5cf9dce5649ae54b376673b65c94eb01733d491bd1fea56389c8c7f71db7d");

const users = new Users(client);

async function test() {
    try {
        const list = await users.list();
        const user = list.users[0];
        console.log("User:", user.$id);
        const prefs = await users.getPrefs(user.$id);
        console.log("Current prefs:", prefs);
        
        await users.updatePrefs(user.$id, {
            reputation: NaN
        });
        console.log("Updated to NaN!");
    } catch(e) {
        console.log("ERROR CODE:", e.code, "MESSAGE:", e.message);
    }
}
test();
