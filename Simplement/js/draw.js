window.addEventListener('load', () => {
    let canvas = document.querySelector('#canvas');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    let ctx = canvas.getContext("2d");
    let brushBtn = document.querySelector('#brush');
    let rectangleBtn = document.querySelector('#rectangle');
    let lineBtn = document.querySelectorAll('.line');
    let colorInput = document.querySelector('#color');
    let downBtn = document.querySelector('.download');
    let allBtn = document.querySelectorAll('.btn');
    let drawBoard = {
        type: 'none',
        isDraw: false,
        beginX: 0,
        beginY: 0,
        lineWidth: 6,
        color: colorInput.value,
        imgData: null,
        brushFn: function (evt) {
            let x = evt.clientX - canvas.offsetLeft;
            let y = evt.clientY - canvas.offsetTop;
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.restore();
        },
        rectFn: function (evt) {
            let x = evt.clientX - canvas.offsetLeft;
            let y = evt.clientY - canvas.offsetTop;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (drawBoard.imgData !== null) {
                ctx.putImageData(drawBoard.imgData, 0, 0, 0, 0, canvas.offsetWidth, canvas.offsetHeight);
            }
            ctx.save();
            ctx.lineWidth = drawBoard.lineWidth;
            ctx.strokeStyle = drawBoard.color;
            ctx.beginPath();
            ctx.strokeRect(drawBoard.beginX, drawBoard.beginY, x - drawBoard.beginX, y - drawBoard.beginY);
            ctx.restore();
        },

    };

    brushBtn.addEventListener('click', evt => {
        allBtn.forEach(function (item, i) {
            item.classList.remove('active');
        });
        brushBtn.classList.add('active');
        drawBoard.type = 'brush';
    });
    rectangleBtn.addEventListener('click', evt => {
        allBtn.forEach(function (item, i) {
            item.classList.remove('active');
        });
        rectangleBtn.classList.add('active');
        drawBoard.type = 'rect';
    });
    lineBtn.forEach(function (item, i) {
        item.addEventListener("click", evt => {
            lineBtn.forEach(function (element, index) {
                element.classList.remove('active');
            });
            item.classList.add('active');
            if (i === 0) {
                drawBoard.lineWidth = 6;
            } else if (i === 1) {
                drawBoard.lineWidth = 16;
            } else {
                drawBoard.lineWidth = 32;
            }
        });
    });
    colorInput.addEventListener("change", evt => {
        drawBoard.color = colorInput.value;
    });

    canvas.addEventListener('mousedown', evt => {
        drawBoard.isDraw = true;
        if (drawBoard.type === 'rect') {
            drawBoard.beginX = evt.clientX - canvas.offsetLeft;
            drawBoard.beginY = evt.clientY - canvas.offsetTop;
        }
        if (drawBoard.type === 'brush') {
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.lineWidth = drawBoard.lineWidth;
            ctx.strokeStyle = drawBoard.color;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(evt.clientX - canvas.offsetLeft, evt.clientY - canvas.offsetTop);
        }
    });
    downBtn.addEventListener('click', evt => {
        let url = canvas.toDataURL()
        let img = new Image();
        img.url = url;
        
    });

    canvas.addEventListener('mouseup', evt => {
        drawBoard.imgData = ctx.getImageData(0, 0, canvas.offsetWidth, canvas.offsetHeight);
        drawBoard.isDraw = false;
    });

    canvas.addEventListener('mousemove', evt => {
        if (drawBoard.isDraw) {
            drawBoard[drawBoard.type + 'Fn'](evt);
        }
    });
});