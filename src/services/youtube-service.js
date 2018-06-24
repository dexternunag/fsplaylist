import axios from 'axios'

const YOUTUBE_SEARCH = 'https://www.googleapis.com/youtube/v3/search';
const YT_KEY = 'AIzaSyBvZUJRL2kqjL53k_OFiLxeVRMzJKUUajg';

function search(query, cb) {
    const YT_DATA = {
        key: YT_KEY,
        part: 'snippet',
        q: query,
        maxResults: 30,
        order: 'relevance',
        type: 'video'
    };

    axios.get(YOUTUBE_SEARCH, {params : YT_DATA}).then(response => {
        cb(null, response.data.items);
    }).catch(err => {
        cb(err, null);
    });

}

export { search }

