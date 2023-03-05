const YoutubeTranscript = require('youtube-transcript/dist/youtube-transcript.common').default;
const { Configuration, OpenAIApi } = require('openai');

const videoUrl = '';
const configuration = new Configuration({
    // https://platform.openai.com/account/org-settings
    organization: '',
    // https://platform.openai.com/account/api-keys
    apiKey: '',
});

(async () => {
    const transcript = await YoutubeTranscript.fetchTranscript(videoUrl);
    const text = transcript.map(t => t.text).filter(t => !t.startsWith('[')).join(' ');

    const gptModel = 'gpt-3.5-turbo';
    const command = 'Summarize the transcript in 10 bullet points. Only points should be the answer. Here is the transcript: ';

    const openAIApi = new OpenAIApi(configuration);
    const gptResponse = await openAIApi.createChatCompletion({
        model: gptModel,
        messages: [{
            role: 'user',
            content: `${command} ${text}`
        }]
    });

    const summary = gptResponse.data.choices[0].message.content;
    console.log(summary);
})();
