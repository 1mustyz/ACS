


  const data = {
    username: "ACS/ADMIN/005",
    password: "password"
};

fetch('https://tim-acs.herokuapp.com/admin/login', {
  method: 'POST', // or 'PUT'
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
})
.then(response => response.json())
.then(data => {
  console.log('Success:', data);
})
.catch((error) => {
  console.error('Error:', error);
});

setTimeout(() => {
  fetch('https://tim-acs.herokuapp.com/admin/get-all-staff')
	.then(response => response.json())
	.then(data => console.log(data))
	// .catch(err => console.error(err));

}, 10000);