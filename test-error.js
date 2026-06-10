const { Client, Databases } = require("node-appwrite");

const client = new Client()
    .setEndpoint("https://sgp.cloud.appwrite.io/v1")
    .setProject("69f423940015d35d07aa")
    .setKey("standard_180f9b897c88c981401f7bd282bcc8757f75817a89fb6dbd32d3703938c83594ba2913f0acc56b6e851f3901d34b81f536455623c5b41b4ac17c355950ee9a5bd73d86e7b648730486b06f4775dfc8966999582e5eb7ee12fcd69550ebe9e12417f5cf9dce5649ae54b376673b65c94eb01733d491bd1fea56389c8c7f71db7d");

const databases = new Databases(client);

async function test() {
    try {
        await databases.getDocument("main-stackflow", "questions", "6a104e660034070b6b62");
    } catch(e) {
        console.log("ERROR CODE TYPE:", typeof e.code, "VALUE:", e.code);
        console.log("ERROR STATUS TYPE:", typeof e.status, "VALUE:", e.status);
    }
}
test();
