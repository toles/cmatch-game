// 化学元素数据
const elements = [
    { symbol: 'H', name: '氢' },
    { symbol: 'He', name: '氦' },
    { symbol: 'Li', name: '锂' },
    { symbol: 'Be', name: '铍' },
    { symbol: 'B', name: '硼' },
    { symbol: 'C', name: '碳' },
    { symbol: 'N', name: '氮' },
    { symbol: 'O', name: '氧' },
    { symbol: 'F', name: '氟' },
    { symbol: 'Ne', name: '氖' },
    { symbol: 'Na', name: '钠' },
    { symbol: 'Mg', name: '镁' },
    { symbol: 'Al', name: '铝' },
    { symbol: 'Si', name: '硅' },
    { symbol: 'P', name: '磷' },
    { symbol: 'S', name: '硫' },
    { symbol: 'Cl', name: '氯' },
    { symbol: 'Ar', name: '氩' },
    { symbol: 'K', name: '钾' },
    { symbol: 'Ca', name: '钙' }
];

class Game {
    constructor() {
        this.gameBoard = document.getElementById('game-board');
        this.scoreElement = document.getElementById('score');
        this.timerElement = document.getElementById('timer');
        this.restartBtn = document.getElementById('restart-btn');
        this.cards = [];
        this.selectedCards = [];
        this.score = 0;
        this.timeLeft = 120;
        this.timer = null;
        this.currentElementIndex = 0;

        this.restartBtn.addEventListener('click', () => this.startGame());
    }

    startGame() {
        this.resetGame();
        this.createBoard();
        this.startTimer();
    }

    resetGame() {
        this.gameBoard.innerHTML = '';
        this.cards = [];
        this.selectedCards = [];
        this.score = 0;
        this.timeLeft = 120;
        this.scoreElement.textContent = '0';
        this.timerElement.textContent = '120';
        if (this.timer) clearInterval(this.timer);
        this.currentElementIndex = 0;
    }

    createBoard() {
        // 创建配对卡片
        const pairs = [...elements, ...elements].map((element, index) => ({
            id: index,
            content: index < elements.length ? element.symbol : element.name,
            elementIndex: index % elements.length,
            isSymbol: index < elements.length
        }));

        // 随机打乱卡片
        this.shuffle(pairs);

        // 创建卡片元素
        pairs.forEach(pair => {
            const card = document.createElement('div');
            card.className = 'card';
            card.textContent = pair.content;
            card.dataset.id = pair.id;
            card.dataset.elementIndex = pair.elementIndex;
            card.dataset.isSymbol = pair.isSymbol;

            card.addEventListener('click', () => this.handleCardClick(card));
            this.gameBoard.appendChild(card);
            this.cards.push(card);
        });
    }

    handleCardClick(card) {
        if (
            card.classList.contains('matched') ||
            card.classList.contains('selected') ||
            this.selectedCards.length >= 2
        ) return;

        card.classList.add('selected');
        this.selectedCards.push(card);

        if (this.selectedCards.length === 2) {
            setTimeout(() => this.checkMatch(), 500);
        }
    }

    checkMatch() {
        const [card1, card2] = this.selectedCards;
        const elementIndex = parseInt(card1.dataset.elementIndex);
        
        // 检查是否是当前需要匹配的元素
        const isCurrentElement = elementIndex === this.currentElementIndex;
        
        const match = 
            card1.dataset.elementIndex === card2.dataset.elementIndex &&
            card1.dataset.isSymbol !== card2.dataset.isSymbol &&
            isCurrentElement;

        if (match) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            this.score += 10;
            this.scoreElement.textContent = this.score;
            this.currentElementIndex++;

            // 检查游戏是否结束
            if (this.score === elements.length * 10) {
                alert('恭喜你赢得了游戏！');
                clearInterval(this.timer);
            }
        } else {
            // 如果不匹配，可以添加提示信息
            if (!isCurrentElement) {
                alert(`请先匹配 ${elements[this.currentElementIndex].symbol} (${elements[this.currentElementIndex].name})`);
            }
        }

        card1.classList.remove('selected');
        card2.classList.remove('selected');
        this.selectedCards = [];
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.timerElement.textContent = this.timeLeft;
            
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                alert('时间到！游戏结束！');
                this.resetGame();
            }
        }, 1000);
    }

    // 注释掉整个 updateGamePrompt 方法
    /*
    updateGamePrompt() {
        const oldPrompt = document.getElementById('current-element-prompt');
        if (oldPrompt) {
            oldPrompt.remove();
        }

        if (this.currentElementIndex < elements.length) {
            const promptDiv = document.createElement('div');
            promptDiv.id = 'current-element-prompt';
            promptDiv.className = 'game-prompt';
            promptDiv.textContent = `当前需要匹配: ${elements[this.currentElementIndex].symbol} (${elements[this.currentElementIndex].name})`;
            this.gameBoard.parentElement.insertBefore(promptDiv, this.gameBoard);
        }
    }
    */
}

// 初始化游戏
window.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.startGame();
}); 
