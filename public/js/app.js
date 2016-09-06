const sock = new WebSocket('ws://' + document.domain + ':8080');

function moveTo(x, y) {
    sock.send(JSON.stringify({
        method: 'move',
        params: [ { x, y }],
        id: 'abc123', // TODO real UUID
    }));
}

function handleMouseMove(event) {
    var dot, eventDoc, doc, body, pageX, pageY;

    event = event || window.event; // IE-ism

    console.log('got event', event.pageX, event.pageY);

    const x = event.pageX;
    const y = event.pageY;

    if (x >= 0 && x < 600 && y >= 0 && y < 600) {
        console.log('moving to', 600-x, 600-y);
        moveTo(x, y);
    }
}

document.onmousemove = handleMouseMove;