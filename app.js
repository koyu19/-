document.addEventListener('DOMContentLoaded', () => {
    const questions = [
        {
            question: '日本の首都はどこですか？',
            choices: ['大阪', '京都', '東京', '札幌'],
            answer: '東京'
        },
        {
            question: '世界で一番高い山は何ですか？',
            choices: ['K2', 'エベレスト', '富士山', 'キリマンジャロ'],
            answer: 'エベレスト'
        },
        {
            question: '1週間は何日ですか？',
            choices: ['5日', '6日', '7日', '8日'],
            answer: '7日'
        },
        {
            question: '太陽系の惑星で、一番大きいのはどれ？',
            choices: ['地球', '火星', '木星', '金星'],
            answer: '木星'
        },
        {
            question: '光の速さは約何km/秒ですか？',
            choices: ['3万', '30万', '300万', '3000万'],
            answer: '30万'
        }
    ];

    let currentQuestionIndex = 0;
    let score = 0;
    let quizActive = true; // クイズが進行中かどうかのフラグ

    const questionElement = document.getElementById('question');
    const choicesElement = document.getElementById('choices');
    const feedbackElement = document.getElementById('feedback');
    const nextButton = document.getElementById('next-btn');
    const quizSection = document.getElementById('quiz');
    const resultSection = document.getElementById('result');
    const scoreSpan = document.getElementById('score');
    const totalQuestionsSpan = document.getElementById('total-questions');
    const restartButton = document.getElementById('restart-btn');

    // クイズの初期化と表示
    function loadQuestion() {
        if (currentQuestionIndex < questions.length) {
            quizActive = true;
            feedbackElement.textContent = ''; // 前回のフィードバックをクリア
            nextButton.style.display = 'none'; // 次へボタンを非表示にする

            const currentQuestion = questions[currentQuestionIndex];
            questionElement.textContent = currentQuestion.question;
            choicesElement.innerHTML = ''; // 選択肢をクリア

            currentQuestion.choices.forEach(choice => {
                const button = document.createElement('button');
                button.classList.add('btn');
                button.textContent = choice;
                button.addEventListener('click', () => selectAnswer(choice, currentQuestion.answer));
                choicesElement.appendChild(button);
            });

            // すべての選択肢ボタンを有効にする
            Array.from(choicesElement.children).forEach(btn => btn.disabled = false);

        } else {
            showResult();
        }
    }

    // 回答が選択された時の処理
    function selectAnswer(selectedChoice, correctAnswer) {
        if (!quizActive) return; // クイズが非アクティブなら何もしない

        const allButtons = Array.from(choicesElement.children);
        allButtons.forEach(button => {
            button.disabled = true; // すべての選択肢を無効にする
            if (button.textContent === correctAnswer) {
                button.classList.add('correct'); // 正解の選択肢を緑色にする
            }
            if (button.textContent === selectedChoice && selectedChoice !== correctAnswer) {
                button.classList.add('incorrect'); // 不正解の選択肢を赤色にする
            }
        });

        if (selectedChoice === correctAnswer) {
            feedbackElement.textContent = '正解！';
            feedbackElement.style.color = '#28a745'; // 緑色
            score++;
        } else {
            feedbackElement.textContent = `不正解... 正解は「${correctAnswer}」でした。`;
            feedbackElement.style.color = '#dc3545'; // 赤色
        }

        nextButton.style.display = 'block'; // 次へボタンを表示する
        quizActive = false; // クイズを一時停止
    }

    // 結果表示
    function showResult() {
        quizSection.classList.add('hidden');
        resultSection.classList.remove('hidden');
        scoreSpan.textContent = score;
        totalQuestionsSpan.textContent = questions.length;
    }

    // 次の質問へ
    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        loadQuestion();
    });

    // もう一度プレイ
    restartButton.addEventListener('click', () => {
        currentQuestionIndex = 0;
        score = 0;
        quizActive = true;
        resultSection.classList.add('hidden');
        quizSection.classList.remove('hidden');
        loadQuestion();
    });

    // アプリ起動時に最初の問題を表示
    loadQuestion();
});
