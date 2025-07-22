const admin = require("firebase-admin");
const { OpenAI } = require("openai");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { defineSecret } = require("firebase-functions/params");

const openAiApiKey = defineSecret("OPENAI_API_KEY");

admin.initializeApp();

const db = admin.firestore();

exports.generateCharacterResponse = onDocumentCreated(
  {
    document: "chats/{chatId}/messages/{messageId}",
    secrets: [openAiApiKey]
  },
  async (event) => {
    const newMessageSnapshot = event.data;
    if (!newMessageSnapshot) {
      console.log("No data associated with the event.");
      return null;
    }

    const newMessage = newMessageSnapshot.data();
    const { chatId } = event.params;

    const openai = new OpenAI({ apiKey: openAiApiKey.value() });

    const chatDoc = await db.collection("chats").doc(chatId).get();
    const chatData = chatDoc.data();
    if (!chatData) {
      console.log(`Chat document ${chatId} not found. Aborting function.`);
      return null;
    }

    const { characterId, userId } = chatData;

    if (newMessage.senderId === characterId) {
      console.log(
        "New message is from the character itself. Ignoring to prevent echo."
      );
      return null;
    }

    const characterDoc = await db
      .collection("characters")
      .doc(characterId)
      .get();
    const characterData = characterDoc.data();
    if (!characterData || !characterData.prompt) {
      console.log(
        `Character ${characterId} not found or missing prompt. Aborting function.`
      );
      return null;
    }

    const messagesQuery = db
      .collection(`chats/${chatId}/messages`)
      .orderBy("timestamp", "desc")
      .limit(10);

    const messagesSnapshot = await messagesQuery.get();
    const recentMessages = messagesSnapshot.docs
      .map((doc) => doc.data())
      .reverse();

    const formattedMessages = recentMessages.map((msg) => ({
      role: msg.senderId === userId ? "user" : "assistant",
      content: msg.text
    }));

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: characterData.prompt },
          ...formattedMessages
        ]
      });

      const responseText = completion.choices[0]?.message?.content?.trim();

      if (responseText) {
        await db.collection(`chats/${chatId}/messages`).add({
          text: responseText,
          senderId: characterId,
          timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        await db.collection("chats").doc(chatId).update({
          lastMessageText: responseText,
          lastMessageTimestamp: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      } else {
        console.log("OpenAI returned an empty response for chat:", chatId);
      }
    } catch (error) {
      console.error(`Error calling OpenAI API for chat ${chatId}:`, error);
    }

    return null;
  }
);
