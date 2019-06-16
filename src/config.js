import Pusher from 'pusher-js';

const pusher = new Pusher('f9126fc42e7cc112a924', {
    cluster: 'ap2',
    forceTLS: true
});
const channel = pusher.subscribe('inventory');

export default channel;