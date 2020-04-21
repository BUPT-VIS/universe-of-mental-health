    /* 弹出框 */
    function showPopup(infoElem) {
        let popupBox = document.getElementById('popupText')
        let age = infoElem['What is your age?']
        let gender = infoElem['What is your gender?']
        let comment = infoElem['Why or why not?(mental)']
        let conditions = infoElem['If so, what condition(s) were you diagnosed with?']
        let positions = infoElem['Which of the following best describes your work position?']
        let bring = infoElem['Would you bring up a mental health issue with a potential employer in an interview?']
        popupBox.innerHTML = '(1) Age: ' + age + '<br/>' 
        + '(2) Genger: ' + gender + '<br/>'
        + '(3) Conditions: ' + conditions + '<br/>' 
        + '(4) Positions: ' + positions + '<br/>' 
        + '(5) Would Bring up Mental Health in Interview?: ' + bring + '<br/>' 
        + '(6) Why?: ' + comment
        // console.log(infoElem)
        document.getElementById('popupBox').style.display = 'block'
    }