document.querySelectorAll('.farmerButton').forEach(button => {
    button.addEventListener('click', () => {
        const farmerValue = button.getAttribute('data-farmer');
        const jsonData = {
            farmerStatus: farmerValue
        };

        fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            //Farmer{Lo0k F0r FarM3r Wh1l3 HunT1ng}
            document.getElementById('farmerMessage').innerHTML = `<h1 style="color:${data.color}">${data.message}</h1>`
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
