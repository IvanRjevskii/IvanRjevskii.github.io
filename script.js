Survey.StylesManager.applyTheme("defaultV2");
Survey.localization.currentLocale = "ru";

fetch('questions.json')
    .then(response => response.json())
    .then(surveyJson => {
        const survey = new Survey.Model(surveyJson);
        
        survey.onComplete.add(function(sender) {
            let correctCount = 0;
            const totalQuestions = 99;
            
            for (let i = 1; i <= totalQuestions; i++) {
                const questionName = `question${i}`;
                const userAnswer = sender.data[questionName];
                const pageIdx = Math.floor((i - 1) / 10);
                const elemIdx = (i - 1) % 10;
                const correctAnswer = surveyJson.pages[pageIdx].elements[elemIdx].correctAnswer;
                
                if (Array.isArray(correctAnswer)) {
                    const userArray = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
                    if (JSON.stringify(userArray.sort()) === JSON.stringify(correctAnswer.sort())) {
                        correctCount++;
                    }
                } else if (userAnswer === correctAnswer) {
                    correctCount++;
                }
            }
            
            const percentage = Math.round((correctCount / totalQuestions) * 100);
            alert(`✅ Тест завершён!\nПравильных ответов: ${correctCount} из ${totalQuestions} (${percentage}%)`);
        });
        
        new Survey.SurveyNG().render("surveyContainer", { model: survey });
    })
    .catch(error => {
        console.error('Ошибка загрузки вопросов:', error);
        document.getElementById('surveyContainer').innerHTML = '<h2>Ошибка загрузки теста</h2><p>Проверьте консоль браузера (F12)</p>';
    });
