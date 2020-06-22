document.addEventListener('DOMContentLoaded', () => {
    console.log('hello')
    document.getElementById('submitEmail').addEventListener('click', async event => {
        event.preventDefault();
        let context = {}
        context.email = document.getElementById('email').value;
        context.fname = document.getElementById('fname').value;
        context.lname = document.getElementById('lname').value;
        let regions = document.getElementById('states');
        context.regionsList = [];
        for (var i = 0; i < regions.selectedOptions.length; i++) {
            context.regionsList.push(regions.selectedOptions[i].value);
        }
        let result = await fetch('/emailsubmit', {
            method: 'post',
            body: JSON.stringify(context),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        result = await result.json();
        if (result.success) {
            document.location('/email-form');
        }
        else {
            document.getElementById('form-error').style.display = "block";
        }
    })
})