fetch('questions.json')
    .then(response => response.json())
    .then(questions => {
        const survey = new Survey.Model(questions);
        
        survey.onComplete.add(function(sender) {
            const results = sender.data;
            const correctCount = Object.keys(results).reduce((count, key) => {
                const questionIndex = parseInt(key.replace('question', '')) - 1;
                const correctAnswer = questions.pages[Math.floor(questionIndex / 10)].elements[questionIndex % 10].correctAnswer;
                
                if (Array.isArray(correctAnswer)) {
                    const userAnswers = results[key];
                    if (JSON.stringify(userAnswers.sort()) === JSON.stringify(correctAnswer.sort())) {
                        return count + 1;
                    }
                } else {
                    if (results[key] === correctAnswer) {
                        return count + 1;
                    }
                }
                return count;
            }, 0);
            
            const percentage = Math.round((correctCount / 99) * 100);
            alert(`Тест завершен!\nПравильных ответов: ${correctCount} из 99 (${percentage}%)`);
        });
        
        Survey.SurveyNG.render("surveyContainer", { model: survey });
    });
